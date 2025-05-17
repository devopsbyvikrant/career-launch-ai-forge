import requests
import os
from pathlib import Path
import json
from pprint import pprint
from datetime import datetime

def print_section(title, data, indent=0):
    print("\n" + " " * indent + f"=== {title} ===")
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                print_section(key.replace("_", " ").title(), value, indent + 2)
            else:
                print(" " * (indent + 2) + f"{key.replace('_', ' ').title()}: {value}")
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                print_section("Item", item, indent + 2)
            else:
                print(" " * (indent + 2) + f"- {item}")

def save_analysis_to_file(data, filename=None):
    if filename is None:
        filename = f"resume_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return filename

def test_resume_upload():
    # API endpoint
    url = "http://localhost:8000/api/resume/process"
    
    # Path to test resume (you'll need to provide a PDF file)
    resume_path = input("Enter the path to your test resume PDF file: ").strip('"').strip("'")
    
    # Convert to Path object for better path handling
    resume_path = Path(resume_path)
    
    if not resume_path.exists():
        print(f"Error: File not found at {resume_path}")
        return
    
    # Check file size
    file_size = resume_path.stat().st_size
    if file_size > 5 * 1024 * 1024:  # 5MB limit
        print(f"Error: File size ({file_size/1024/1024:.2f}MB) exceeds 5MB limit")
        return
    
    # Prepare the file for upload
    try:
        with open(resume_path, 'rb') as f:
            files = {
                'file': ('resume.pdf', f, 'application/pdf')
            }
            
            # Send POST request
            print("Uploading resume...")
            response = requests.post(url, files=files)
            
            # Check response
            if response.status_code == 200:
                result = response.json()
                print("\nUpload successful!")
                
                # Save raw response to file for reference
                filename = save_analysis_to_file(result)
                print(f"\nRaw response saved to {filename}")
                
                print("\nDetailed Resume Analysis:")
                data = result.get('data', {})
                
                # Print all sections with detailed information
                print_section("Personal Information", data.get('personalInfo', {}))
                
                print_section("Professional Summary", data.get('summary', {}))
                
                print_section("Education", data.get('education', []))
                
                print_section("Work Experience", data.get('workExperience', []))
                
                print_section("Skills", data.get('skills', {}))
                
                print_section("Projects", data.get('projects', []))
                
                print_section("Career Analysis", data.get('career_analysis', {}))
                
                print_section("ATS Optimization", data.get('ats_optimization', {}))
                
                print_section("Improvement Suggestions", data.get('improvement_suggestions', {}))
                
                print(f"\nResume ID: {result.get('resume_id')}")
                
                # Print any additional metadata
                if 'metadata' in result:
                    print_section("Metadata", result['metadata'])
                
                print("\nAnalysis complete! The detailed JSON output has been saved to:", filename)
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
                
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    test_resume_upload() 