from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client, Client
import httpx
import secrets
import openai
import json
import PyPDF2
import io
import base64
from datetime import datetime

# Load environment variables
load_dotenv()

# Constants
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Initialize FastAPI app with metadata
app = FastAPI(
    title="Career Launch AI Backend",
    description="AI-powered career advice and guidance platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize Supabase client
supabase_url = os.getenv("VITE_SUPABASE_URL")
supabase_key = os.getenv("VITE_SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials. Please check your .env file.")

supabase: Client = create_client(supabase_url, supabase_key)

# LinkedIn OAuth configuration
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI", "http://localhost:8080/auth/linkedin/callback")

# Models with better type hints and validation
class CareerQuery(BaseModel):
    query: str = Field(..., min_length=1, description="The career-related question or query")
    user_id: Optional[str] = Field(None, description="Optional user ID for tracking interactions")

class CareerResponse(BaseModel):
    response: str = Field(..., description="Main response to the career query")
    suggestions: List[str] = Field(..., min_items=1, description="List of actionable suggestions")

class APIResponse(BaseModel):
    status: str = Field(..., description="Status of the API response")
    message: str = Field(..., description="Message describing the response")
    data: Optional[Dict[str, Any]] = Field(None, description="Response data if any")

class LinkedInCallback(BaseModel):
    code: str = Field(..., description="Authorization code from LinkedIn")

class JobDescription(BaseModel):
    description: str

class ResumeProcessor:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    async def extract_resume_data(self, file_content: bytes) -> Dict:
        try:
            # Convert PDF to text
            pdf_file = io.BytesIO(file_content)
            try:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                if len(pdf_reader.pages) == 0:
                    raise ValueError("PDF file is empty")
                
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if not page_text.strip():
                        raise ValueError("PDF appears to be empty or contains no text")
                    text += page_text
            except Exception as e:
                raise ValueError(f"Error reading PDF file: {str(e)}")
            
            # Use GPT-4 to extract structured information with detailed analysis
            prompt = f"""As an expert ATS resume analyzer and career coach, perform a comprehensive analysis of the following resume. Extract and structure ALL possible information, including implicit details and potential improvements.

            Return the data in this detailed JSON format:
            {{
                "personalInfo": {{
                    "name": "",
                    "email": "",
                    "phone": "",
                    "location": "",
                    "linkedin": "",
                    "portfolio": "",
                    "github": "",
                    "other_profiles": []
                }},
                "summary": {{
                    "professional_summary": "",
                    "key_achievements": [],
                    "core_competencies": [],
                    "career_objectives": [],
                    "value_proposition": ""
                }},
                "education": [
                    {{
                        "degree": "",
                        "institution": "",
                        "year": "",
                        "gpa": "",
                        "relevant_coursework": [],
                        "achievements": [],
                        "extracurricular": [],
                        "honors": [],
                        "thesis": "",
                        "specialization": ""
                    }}
                ],
                "workExperience": [
                    {{
                        "company": "",
                        "position": "",
                        "duration": "",
                        "location": "",
                        "achievements": [],
                        "responsibilities": [],
                        "technologies_used": [],
                        "quantifiable_results": [],
                        "key_projects": [],
                        "team_size": "",
                        "reporting_to": "",
                        "industry": "",
                        "company_size": "",
                        "impact_metrics": []
                    }}
                ],
                "skills": {{
                    "technical": [],
                    "soft": [],
                    "certifications": [],
                    "languages": [],
                    "tools": [],
                    "methodologies": [],
                    "domain_knowledge": [],
                    "emerging_technologies": []
                }},
                "projects": [
                    {{
                        "name": "",
                        "description": "",
                        "technologies": [],
                        "achievements": [],
                        "duration": "",
                        "url": "",
                        "role": "",
                        "team_size": "",
                        "challenges": [],
                        "solutions": [],
                        "impact": "",
                        "key_learnings": []
                    }}
                ],
                "career_analysis": {{
                    "career_progression": "",
                    "industry_expertise": [],
                    "leadership_qualities": [],
                    "innovation_contributions": [],
                    "problem_solving_abilities": [],
                    "adaptability_indicators": []
                }},
                "ats_optimization": {{
                    "keywords": [],
                    "skills_alignment": [],
                    "formatting_score": 0,
                    "content_score": 0,
                    "suggestions": [],
                    "keyword_density": {{}},
                    "missing_keywords": [],
                    "formatting_issues": [],
                    "content_gaps": []
                }},
                "improvement_suggestions": {{
                    "content_enhancements": [],
                    "formatting_improvements": [],
                    "skill_gaps": [],
                    "achievement_quantification": [],
                    "keyword_optimization": [],
                    "career_development": []
                }}
            }}

            Resume text:
            {text}
            
            Analyze the resume thoroughly and extract ALL possible information. Include implicit details and potential improvements. Return only the JSON object, no additional text."""
            
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4-turbo-preview",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    temperature=0.3  # Lower temperature for more consistent output
                )
                
                extracted_data = json.loads(response.choices[0].message.content)
                
                # Store the extracted data in Supabase
                try:
                    result = supabase.table("resume_analysis").insert({
                        "extracted_data": extracted_data,
                        "created_at": datetime.utcnow().isoformat()
                    }).execute()
                    
                    if result.error:
                        print(f"Warning: Failed to store resume analysis: {result.error}")
                except Exception as e:
                    print(f"Warning: Failed to store resume analysis: {str(e)}")
                
                return extracted_data
                
            except json.JSONDecodeError:
                raise ValueError("Failed to parse AI response as JSON")
            except Exception as e:
                raise ValueError(f"Error processing resume with AI: {str(e)}")
                
        except Exception as e:
            raise ValueError(f"Error processing resume: {str(e)}")
    
    async def generate_portfolio(self, resume_data: Dict) -> Dict:
        prompt = f"""As an expert web developer and designer, create four unique portfolio landing pages based on this resume data. Each page should have its own distinct style and layout while maintaining professionalism.

        Resume data:
        {json.dumps(resume_data, indent=2)}
        
        Create four different portfolio styles:
        1. A modern, minimalist design
        2. A creative, artistic design
        3. A professional, corporate design
        4. A dynamic, interactive design

        For each style, generate:
        1. Complete HTML structure with inline CSS
        2. Responsive design that works on all devices
        3. Sections for: Hero, About, Skills, Projects, Experience, Contact
        4. Unique color schemes and typography
        5. Modern UI elements and animations

        Return the portfolio content in this JSON format:
        {{
            "minimal": {{
                "html": "Complete HTML with inline CSS for minimal design",
                "style": "Description of the minimal design approach",
                "preview_url": "/portfolio/minimal"
            }},
            "creative": {{
                "html": "Complete HTML with inline CSS for creative design",
                "style": "Description of the creative design approach",
                "preview_url": "/portfolio/creative"
            }},
            "professional": {{
                "html": "Complete HTML with inline CSS for professional design",
                "style": "Description of the professional design approach",
                "preview_url": "/portfolio/professional"
            }},
            "dynamic": {{
                "html": "Complete HTML with inline CSS for dynamic design",
                "style": "Description of the dynamic design approach",
                "preview_url": "/portfolio/dynamic"
            }}
        }}

        Guidelines for each style:
        - Minimal: Clean, whitespace-focused, typography-driven
        - Creative: Bold colors, unique layouts, artistic elements
        - Professional: Corporate colors, structured layout, formal presentation
        - Dynamic: Interactive elements, smooth animations, modern features

        Use the resume data to populate all sections with real content.
        Return only the JSON object, no additional text."""
        
        response = self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        portfolio_data = json.loads(response.choices[0].message.content)
        
        # Store the portfolio data in Supabase
        try:
            result = supabase.table("portfolios").insert({
                "template": "all",
                "title": resume_data.get("personalInfo", {}).get("name", "Portfolio"),
                "subtitle": resume_data.get("personalInfo", {}).get("target_role", "Professional Portfolio"),
                "content": portfolio_data,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            
            if result.error:
                print(f"Warning: Failed to store portfolio: {result.error}")
        except Exception as e:
            print(f"Warning: Failed to store portfolio: {str(e)}")
        
        return portfolio_data
    
    async def generate_ats_resume(self, resume_data: Dict, job_description: str) -> Dict:
        prompt = f"""As an expert ATS resume optimizer, create an optimized resume based on this resume data and job description.
        Focus on:
        1. Keyword optimization and matching
        2. Clear, ATS-friendly formatting
        3. Quantifiable achievements
        4. Skills alignment with job requirements
        5. Professional summary optimization
        
        Resume data:
        {json.dumps(resume_data, indent=2)}
        
        Job Description:
        {job_description}
        
        Return the optimized resume content in this JSON format:
        {{
            "optimized_summary": "",
            "optimized_experience": [],
            "optimized_skills": [],
            "optimized_education": [],
            "optimized_projects": [],
            "ats_score": 0,
            "keyword_matches": [],
            "improvement_suggestions": []
        }}"""
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        optimized_data = json.loads(response.choices[0].message.content)
        
        # Store the optimized version
        try:
            result = supabase.table("ats_optimized_resumes").insert({
                "original_resume_id": resume_data.get("id"),
                "job_description": job_description,
                "optimized_data": optimized_data,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            
            if result.error:
                print(f"Warning: Failed to store ATS optimized resume: {result.error}")
        except Exception as e:
            print(f"Warning: Failed to store ATS optimized resume: {str(e)}")
        
        return optimized_data
    
    async def generate_cover_letter(self, resume_data: Dict, job_description: str) -> Dict:
        prompt = f"""As an expert cover letter writer, create a compelling and personalized cover letter based on this resume data and job description.
        Focus on:
        1. Strong opening that captures attention
        2. Clear connection between experience and job requirements
        3. Specific examples and achievements
        4. Enthusiasm and cultural fit
        5. Professional closing with call to action
        
        Resume data:
        {json.dumps(resume_data, indent=2)}
        
        Job Description:
        {job_description}
        
        Return the cover letter content in this JSON format:
        {{
            "opening": "",
            "body": "",
            "closing": "",
            "signature": "",
            "key_points": [],
            "tone_analysis": {{
                "professionalism_score": 0,
                "enthusiasm_score": 0,
                "personalization_score": 0
            }}
        }}"""
        
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        cover_letter_data = json.loads(response.choices[0].message.content)
        
        # Store the cover letter
        try:
            result = supabase.table("cover_letters").insert({
                "resume_id": resume_data.get("id"),
                "job_description": job_description,
                "cover_letter_data": cover_letter_data,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            
            if result.error:
                print(f"Warning: Failed to store cover letter: {result.error}")
        except Exception as e:
            print(f"Warning: Failed to store cover letter: {str(e)}")
        
        return cover_letter_data

# Initialize the processor
resume_processor = ResumeProcessor()

# Routes with better documentation
@app.get("/", response_model=APIResponse, tags=["Health Check"])
async def root():
    """Health check endpoint to verify the API is running."""
    return APIResponse(
        status="success",
        message="Career Launch AI Backend is running",
        data={"version": "1.0.0"}
    )

@app.post("/api/linkedin/callback", response_model=APIResponse, tags=["Authentication"])
async def linkedin_callback(callback: LinkedInCallback):
    """Handle LinkedIn OAuth callback and create/update user account."""
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://www.linkedin.com/oauth/v2/accessToken",
                data={
                    "grant_type": "authorization_code",
                    "code": callback.code,
                    "client_id": LINKEDIN_CLIENT_ID,
                    "client_secret": LINKEDIN_CLIENT_SECRET,
                    "redirect_uri": LINKEDIN_REDIRECT_URI,
                }
            )
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get LinkedIn access token")
            
            access_token = token_response.json()["access_token"]
            
            # Get user profile from LinkedIn
            profile_response = await client.get(
                "https://api.linkedin.com/v2/me",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if profile_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get LinkedIn profile")
            
            profile_data = profile_response.json()
            
            # Get email address
            email_response = await client.get(
                "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if email_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get LinkedIn email")
            
            email_data = email_response.json()
            email = email_data["elements"][0]["handle~"]["emailAddress"]
            
            # Generate a random password for the user
            password = secrets.token_urlsafe(16)
            
            # Create or update user in Supabase
            user_response = await supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "full_name": f"{profile_data.get('localizedFirstName', '')} {profile_data.get('localizedLastName', '')}",
                        "linkedin_id": profile_data.get("id"),
                        "linkedin_url": f"https://www.linkedin.com/in/{profile_data.get('id')}"
                    }
                }
            })
            
            if user_response.error:
                raise HTTPException(status_code=400, detail=str(user_response.error))
            
            return APIResponse(
                status="success",
                message="LinkedIn authentication successful",
                data={
                    "email": email,
                    "password": password,  # In production, use a more secure method
                    "linkedinUrl": f"https://www.linkedin.com/in/{profile_data.get('id')}"
                }
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test-career-interactions", response_model=APIResponse, tags=["Career Interactions"])
async def test_career_interactions():
    """Test endpoint to verify Supabase career interactions table accessibility."""
    try:
        result = supabase.table("career_interactions").select("*").limit(1).execute()
        return APIResponse(
            status="success",
            message="Career interactions table exists and is accessible",
            data={"interactions": result.data}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error accessing career_interactions table: {str(e)}"
        )

@app.post("/api/career-advice", response_model=CareerResponse, tags=["Career Advice"])
async def get_career_advice(query: CareerQuery):
    """Get AI-powered career advice based on user query."""
    try:
        # Create a prompt for OpenAI
        prompt = f"""
        As a career advisor, please provide advice for the following query:
        {query.query}
        
        Please provide:
        1. A detailed response
        2. 3-5 specific action items or suggestions
        """

        # Get response from OpenAI
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a professional career advisor with expertise in career development, job searching, and professional growth."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Process the response
        advice = response.choices[0].message.content
        
        # Split the response into main response and suggestions
        parts = advice.split("\n\n")
        main_response = parts[0]
        suggestions = [s.strip() for s in parts[1:] if s.strip()]

        # Store the interaction in Supabase if user_id is provided
        if query.user_id:
            try:
                result = supabase.table("career_interactions").insert({
                    "user_id": query.user_id,
                    "query": query.query,
                    "response": advice,
                    "suggestions": suggestions,
                    "created_at": "now()"
                }).execute()
                print("Stored in Supabase:", result)
            except Exception as e:
                print("Error storing in Supabase:", str(e))
                # Continue even if storage fails

        return CareerResponse(
            response=main_response,
            suggestions=suggestions
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing career advice request: {str(e)}"
        )

@app.post("/api/resume/process", tags=["Resume Processing"])
async def process_resume(file: UploadFile = File(...)):
    try:
        # Check file size
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds the 5MB limit"
            )

        # Check file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only PDF and DOCX files are supported"
            )

        try:
            # Process the resume
            resume_data = await resume_processor.extract_resume_data(content)
            
            # Store in Supabase
            try:
                # Convert file content to base64 for storage
                file_base64 = base64.b64encode(content).decode('utf-8')
                
                # Create resume record
                resume_record = {
                    "file_name": file.filename,
                    "file_content": file_base64,
                    "file_type": file.content_type,
                    "file_size": len(content),
                    "extracted_data": resume_data,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
                
                # Insert into resumes table
                result = supabase.table("resumes").insert(resume_record).execute()
                
                if result.error:
                    print(f"Error storing resume: {result.error}")
                    raise Exception(f"Error storing resume: {result.error}")
                
                # Also store in resume_analysis table
                analysis_result = supabase.table("resume_analysis").insert({
                    "extracted_data": resume_data,
                    "created_at": datetime.utcnow().isoformat()
                }).execute()
                
                if analysis_result.error:
                    print(f"Warning: Failed to store resume analysis: {analysis_result.error}")
                
                return {
                    "status": "success",
                    "data": resume_data,
                    "resume_id": result.data[0]["id"]
                }
                
            except Exception as e:
                print(f"Error in database operations: {str(e)}")
                # If storage fails, still return the processed data
                return {
                    "status": "partial_success",
                    "message": "Resume processed but storage failed",
                    "data": resume_data
                }
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing resume: {str(e)}"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

@app.post("/api/resume/generate-portfolio", tags=["Resume Processing"])
async def generate_portfolio(resume_data: Dict):
    try:
        portfolio = await resume_processor.generate_portfolio(resume_data)
        return {"status": "success", "data": portfolio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/generate-ats", tags=["Resume Processing"])
async def generate_ats_resume(resume_data: Dict, job_description: JobDescription):
    try:
        ats_resume = await resume_processor.generate_ats_resume(resume_data, job_description.description)
        return {"status": "success", "data": ats_resume}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/generate-cover-letter", tags=["Resume Processing"])
async def generate_cover_letter(resume_data: Dict, job_description: JobDescription):
    try:
        cover_letter = await resume_processor.generate_cover_letter(resume_data, job_description.description)
        return {"status": "success", "data": cover_letter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/resume/latest", tags=["Resume Processing"])
async def get_latest_resume():
    try:
        # Fetch the most recent resume from the database
        result = supabase.table("resumes").select("*").order('created_at', desc=True).limit(1).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No resumes found in the database"
            )
            
        resume = result.data[0]
        return {
            "status": "success",
            "data": {
                "file_name": resume["file_name"],
                "extracted_data": resume["extracted_data"],
                "created_at": resume["created_at"]
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching resume: {str(e)}"
        ) 