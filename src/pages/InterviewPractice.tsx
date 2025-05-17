
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useProfileData } from '@/hooks/useProfileData';

interface InterviewQuestion {
  id: number;
  question: string;
  type: 'behavioral' | 'technical';
}

interface InterviewAnswer {
  questionId: number;
  answer: string;
  feedback: string | null;
  score: number | null;
}

const InterviewPractice: React.FC = () => {
  const { profileData, isLoading } = useProfileData();
  
  const [jobTitle, setJobTitle] = useState('');
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical'>('behavioral');
  const [isStarting, setIsStarting] = useState(false);
  const [interviewMode, setInterviewMode] = useState<'setup' | 'interview' | 'feedback'>('setup');
  
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  const handleStartInterview = () => {
    if (!jobTitle) {
      toast.error('Please enter a job title');
      return;
    }
    
    setIsStarting(true);
    
    // Simulate API call to generate questions
    setTimeout(() => {
      let generatedQuestions: InterviewQuestion[];
      
      if (interviewType === 'behavioral') {
        generatedQuestions = [
          { id: 1, question: 'Tell me about a time when you faced a difficult problem at work. How did you solve it?', type: 'behavioral' },
          { id: 2, question: 'Describe a situation where you had to work under pressure to meet a deadline.', type: 'behavioral' },
          { id: 3, question: 'Give an example of when you had to work with someone difficult. How did you handle it?', type: 'behavioral' },
          { id: 4, question: 'Tell me about a time when you failed at something. What did you learn from it?', type: 'behavioral' },
          { id: 5, question: 'Describe a project where you demonstrated leadership skills.', type: 'behavioral' },
        ];
      } else {
        generatedQuestions = [
          { id: 1, question: `What is the difference between == and === in JavaScript?`, type: 'technical' },
          { id: 2, question: `Explain the concept of React hooks and give an example of when to use useState.`, type: 'technical' },
          { id: 3, question: `How would you optimize a web application's performance?`, type: 'technical' },
          { id: 4, question: `What is the box model in CSS? Explain its components.`, type: 'technical' },
          { id: 5, question: `Explain how you would implement error handling in a React application.`, type: 'technical' },
        ];
      }
      
      setQuestions(generatedQuestions);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setCurrentAnswer('');
      setInterviewMode('interview');
      setIsStarting(false);
      
      toast.success('Interview started! Answer each question to the best of your ability.');
    }, 2000);
  };
  
  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer before submitting');
      return;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    
    // Simulate processing and feedback generation
    const updatedAnswers = [...answers];
    updatedAnswers.push({
      questionId: currentQuestion.id,
      answer: currentAnswer,
      feedback: null,
      score: null,
    });
    
    setAnswers(updatedAnswers);
    setCurrentAnswer('');
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of interview, generate feedback
      setTimeout(() => {
        const answersWithFeedback = updatedAnswers.map((answer, index) => {
          // Generate mock feedback
          const feedbacks = [
            "Good answer, but could provide more specific examples.",
            "Strong response with good structure. Consider quantifying your impact more.",
            "Clear explanation, but could connect more directly to the job requirements.",
            "Excellent use of the STAR method in your response.",
            "Good technical knowledge demonstrated. Consider explaining the concept in simpler terms."
          ];
          
          const scores = [7, 8, 9, 7, 8];
          
          return {
            ...answer,
            feedback: feedbacks[index],
            score: scores[index],
          };
        });
        
        setAnswers(answersWithFeedback);
        setInterviewMode('feedback');
        toast.success('Interview completed! View your feedback below.');
      }, 2000);
    }
  };
  
  const calculateAverageScore = () => {
    if (!answers.length || answers.some(a => a.score === null)) return null;
    const sum = answers.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return (sum / answers.length).toFixed(1);
  };
  
  const handleRestartInterview = () => {
    setInterviewMode('setup');
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple mb-4"></div>
          <p className="text-gray-600">Loading interview practice...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Mock Interview Practice</h1>
        <p className="text-gray-600">
          Practice for your interviews with our AI interviewer and receive real-time feedback
        </p>
      </div>
      
      {interviewMode === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Your Interview</CardTitle>
            <CardDescription>
              Select the type of interview you want to practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Frontend Developer, Product Manager"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <p className="text-sm text-gray-500">Enter the job title you are applying for</p>
              </div>
              
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Tabs defaultValue="behavioral" onValueChange={(value) => setInterviewType(value as 'behavioral' | 'technical')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                  </TabsList>
                  <TabsContent value="behavioral" className="mt-4">
                    <p className="text-sm text-gray-600">
                      Practice answering questions about your past experiences, soft skills, and how you handle workplace situations.
                    </p>
                  </TabsContent>
                  <TabsContent value="technical" className="mt-4">
                    <p className="text-sm text-gray-600">
                      Answer technical questions related to your field to demonstrate your knowledge and problem-solving abilities.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy - Entry Level</SelectItem>
                    <SelectItem value="medium">Medium - Mid Level</SelectItem>
                    <SelectItem value="hard">Hard - Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleStartInterview} 
                className="w-full bg-purple hover:bg-purple-dark"
                disabled={isStarting}
              >
                {isStarting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Setting Up Interview...
                  </>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {interviewMode === 'interview' && questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                <CardDescription>
                  {interviewType === 'behavioral' ? 'Behavioral Question' : 'Technical Question'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-purple-light/20 p-4 rounded-lg border border-purple-light">
                    <p className="text-lg font-medium">{questions[currentQuestionIndex].question}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="answer">Your Answer</Label>
                    <textarea
                      id="answer"
                      className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple"
                      placeholder="Type your answer here..."
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Try to be specific and use concrete examples from your past experiences.
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    >
                      Previous Question
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitAnswer} 
                      className="bg-purple hover:bg-purple-dark"
                    >
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Interview Progress</CardTitle>
                <CardDescription>
                  Track your progress through the interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Completed: {answers.length}/{questions.length}</span>
                      <span>{Math.round((answers.length / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-purple rounded-full"
                        style={{ width: `${(answers.length / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <div 
                        key={q.id} 
                        className={`p-3 rounded-lg text-sm flex items-center gap-3 ${
                          index === currentQuestionIndex
                            ? 'bg-purple text-white'
                            : index < currentQuestionIndex
                            ? 'bg-purple-light/30 text-gray-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span className="font-medium">Q{index + 1}</span>
                        <span className="truncate flex-1">{q.question.length > 40 ? `${q.question.substring(0, 40)}...` : q.question}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-gray-600">
                      {interviewType === 'behavioral' 
                        ? 'Tip: Use the STAR method (Situation, Task, Action, Result) to structure your answers.' 
                        : 'Tip: Explain your thought process clearly when answering technical questions.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {interviewMode === 'feedback' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Interview Feedback Summary</CardTitle>
              <CardDescription>
                Review your performance and areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-purple-light/20 p-6 rounded-lg border border-purple-light text-center">
                  <p className="text-sm text-gray-600 mb-2">Overall Score</p>
                  <p className="text-4xl font-bold text-purple">{calculateAverageScore()}/10</p>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-2">Questions Answered</p>
                  <p className="text-4xl font-bold text-gray-800">{answers.length}/{questions.length}</p>
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-2">Interview Type</p>
                  <p className="text-xl font-bold text-gray-800 capitalize">{interviewType}</p>
                  <p className="text-sm text-gray-600 mt-1">for {jobTitle}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Areas of Strength</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Clear communication and structured responses</li>
                  <li>Good examples from past experiences</li>
                  <li>Professional tone and language</li>
                </ul>
                
                <h3 className="text-lg font-medium pt-4">Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be more specific with examples and outcomes</li>
                  <li>Quantify your achievements when possible</li>
                  <li>Connect your experiences more directly to the job requirements</li>
                </ul>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={handleRestartInterview} className="bg-purple hover:bg-purple-dark">
                  Practice Again
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Question Analysis</h2>
            
            {answers.map((answer, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  <CardDescription>{questions[index]?.question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Your Answer:</h4>
                      <p className="text-gray-800">{answer.answer}</p>
                    </div>
                    
                    <div className="bg-purple-light/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-500">Feedback:</h4>
                        <span className="px-2 py-1 bg-purple text-white text-xs rounded-full">
                          Score: {answer.score}/10
                        </span>
                      </div>
                      <p className="text-gray-800">{answer.feedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPractice;
