"use client";

import React, { useState, useEffect } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { RadialBar, RadialBarChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../ui/chart"
import { SignOutButton } from '../../auth/sign-out'
import { User, Briefcase, Code, GraduationCap, Award, FileText } from 'lucide-react'

interface ProfileData {
  summary?: string
  workExperience?: string
  projects?: string
  skills?: string
  education?: string
  certifications?: string
}

// Add interface for score data
interface ScoreData {
  score: number;
  maxScore: number;
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  sections: {
    summary: { score: number; maxScore: number; feedback: string };
    experience: { score: number; maxScore: number; feedback: string };
    projects: { score: number; maxScore: number; feedback: string };
    skills: { score: number; maxScore: number; feedback: string };
    education: { score: number; maxScore: number; feedback: string };
    certifications: { score: number; maxScore: number; feedback: string };
  };
}

const chartConfig = {
  completion: {
    label: "Profile Completion"
  },
  remaining: {
    label: "Remaining"
  }
} satisfies ChartConfig

const CompleteProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rawProfileText, setRawProfileText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [interviewStats, setInterviewStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0
  })
  const [formData, setFormData] = useState<ProfileData>({
    summary: '',
    workExperience: '',
    projects: '',
    skills: '',
    education: '',
    certifications: ''
  })
  // Add state for score data
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [isScoring, setIsScoring] = useState(false)

  const saveProfile = async (profileData: ProfileData) => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })
      if (response.ok) {
        loadProfile() // Reload to show updated data
        return true
      } else {
        toast.error('Failed to save profile')
        return false
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Error saving profile')
      return false
    }
  }

  const handleAIParsing = async () => {
    if (!rawProfileText.trim()) {
      toast.error('Please enter profile text to parse')
      return
    }

    setIsParsing(true)
    try {
      const response = await fetch('/api/profile/structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rawProfileText })
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(data.structuredProfile)
        // Automatically save the parsed profile
        await saveProfile(data.structuredProfile)
        toast.success('Profile structured and saved successfully!')
      } else {
        toast.error('Failed to structure profile')
      }
    } catch (error) {
      console.error('Error parsing profile:', error)
      toast.error('Error parsing profile')
    } finally {
      setIsParsing(false)
    }
  }

  useEffect(() => {
    loadProfile()
    loadUserData()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/profile/get')
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setFormData(data.profile)
        }
        if (data.user) {
          setUserData(data.user)
        }
        if (data.interviewStats) {
          setInterviewStats(data.interviewStats)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setInterviewStats(data.interviewStats)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form data:", formData)
    const success = await saveProfile(formData)
    if (success) {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  const profileFields = ['summary', 'workExperience', 'projects', 'skills', 'education', 'certifications']
  const hasData = profileFields.some(field => formData[field as keyof ProfileData] && typeof formData[field as keyof ProfileData] === 'string' && (formData[field as keyof ProfileData] as string).trim() !== '')

  // Calculate profile completion percentage
  const filledFields = profileFields.filter(field => formData[field as keyof ProfileData] && typeof formData[field as keyof ProfileData] === 'string' && (formData[field as keyof ProfileData] as string).trim() !== '').length
  const totalFields = 6
  const progressPercentage = Math.round((filledFields / totalFields) * 100)

  // Add function to calculate resume score
  const calculateResumeScore = async () => {
    if (!hasData) {
      toast.error('Please complete your profile first')
      return
    }

    setIsScoring(true)
    try {
      const response = await fetch('/api/profile/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileData: formData })
      })

      if (response.ok) {
        const data = await response.json()
        setScoreData(data.scoreResult)
        toast.success('Resume scored successfully!')
      } else {
        toast.error('Failed to score resume')
      }
    } catch (error) {
      console.error('Error scoring resume:', error)
      toast.error('Error scoring resume')
    } finally {
      setIsScoring(false)
    }
  }

  if (!isEditing && hasData) {
    // View mode - Professional structured design
    return (
      <div className='w-full flex flex-col gap-8 pb-10 xl:pb-0'>
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Dashboard
              </h1>
              <p className="text-gray-600 text-lg mt-2">AI-powered analysis and insights for your career growth</p>
            </div>
            <div className="flex items-center gap-3">
              <SignOutButton />
              <Button
                onClick={() => setIsEditing(true)}
                className='bg-blue-600 hover:bg-blue-700 text-white'
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Completion */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{progressPercentage}%</p>
                <p className="text-sm text-gray-600 font-medium">Profile Completion</p>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Interviews */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">{interviewStats.total}</p>
                <p className="text-sm text-gray-600 font-medium">Total Interviews</p>
              </div>
            </CardContent>
          </Card>

          {/* Completed Interviews */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600 mb-2">{interviewStats.completed}</p>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600 mb-2">{interviewStats.inProgress}</p>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Score Section */}
        <div className="grid grid-cols-1 gap-8">
          {/* Resume Score Card */}
          {scoreData ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Resume Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">{scoreData.score}</p>
                    <p className="text-sm text-gray-600">out of {scoreData.maxScore}</p>
                  </div>
                  <div className="flex-1 ml-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(scoreData.score / scoreData.maxScore) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 text-center">Professional Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-lg font-bold text-gray-900">{scoreData.strengths.length}</p>
                    <p className="text-xs text-gray-600">Strengths</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-lg font-bold text-gray-900">{scoreData.weaknesses.length}</p>
                    <p className="text-xs text-gray-600">Improvements</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-lg font-bold text-gray-900">{scoreData.recommendations.length}</p>
                    <p className="text-xs text-gray-600">Recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">Resume Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Get AI-Powered Resume Score</h3>
                  <p className="text-gray-600 text-sm mb-6">Receive detailed analysis and personalized recommendations to improve your resume</p>
                </div>
                <Button
                  onClick={calculateResumeScore}
                  disabled={isScoring}
                  className='bg-blue-600 hover:bg-blue-700 text-white'
                >
                  {isScoring ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Score Details Modal */}
        {scoreData && (
          <Card className='shadow-sm'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle className='text-xl'>Resume Analysis</CardTitle>
                <Button 
                  variant='outline' 
                  onClick={() => setScoreData(null)}
                >
                  Close Analysis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold mb-2'>Overall Score: {scoreData.score}/{scoreData.maxScore}</h3>
                <p className='text-gray-700'>{scoreData.analysis}</p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h4 className='font-semibold mb-2 text-green-700'>Strengths</h4>
                  <ul className='list-disc pl-5 space-y-1'>
                    {scoreData.strengths.map((strength, index) => (
                      <li key={index} className='text-gray-700'>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold mb-2 text-yellow-700'>Areas for Improvement</h4>
                  <ul className='list-disc pl-5 space-y-1'>
                    {scoreData.weaknesses.map((weakness, index) => (
                      <li key={index} className='text-gray-700'>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className='mt-6'>
                <h4 className='font-semibold mb-2 text-blue-700'>Recommendations</h4>
                <ul className='list-disc pl-5 space-y-1'>
                  {scoreData.recommendations.map((recommendation, index) => (
                    <li key={index} className='text-gray-700'>{recommendation}</li>
                  ))}
                </ul>
              </div>

              <div className='mt-6'>
                <h4 className='font-semibold mb-3'>Section Scores</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  {Object.entries(scoreData.sections).map(([section, data]) => (
                    <Card key={section} className='p-3'>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium capitalize'>{section}</span>
                        <span className='text-sm'>{data.score}/{data.maxScore}</span>
                      </div>
                      <p className='text-xs text-gray-600 mt-1'>{data.feedback}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structured Profile Display */}
        <div className='space-y-8'>
          <Card className='shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-0'>
            <CardHeader className='text-center pb-2'>
              <CardTitle className='text-3xl text-gray-800 flex items-center justify-center gap-3'>
                <User className="w-8 h-8 text-blue-600" />
                Your Professional Profile
              </CardTitle>
              <p className='text-gray-600 mt-2'>A comprehensive view of your career journey and expertise</p>
            </CardHeader>
          </Card>

          {/* Professional Summary Section */}
          {formData.summary && (
            <Card className='shadow-md border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl text-blue-800 flex items-center gap-2'>
                  <User className="w-5 h-5" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-white rounded-lg p-4 shadow-sm border border-blue-100'>
                  <p className='text-gray-700 whitespace-pre-line leading-relaxed text-base'>{formData.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Work Experience Section */}
          {formData.workExperience && (
            <Card className='shadow-md border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl text-green-800 flex items-center gap-2'>
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {formData.workExperience.split('\n\n').filter(exp => exp.trim()).map((experience, index) => (
                    <div key={index} className='bg-white rounded-lg p-5 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 w-3 h-3 rounded-full bg-green-500 mt-2'></div>
                        <div className='flex-1'>
                          <div className='whitespace-pre-line text-gray-700 leading-relaxed'>{experience.trim()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Projects Section */}
          {formData.projects && (
            <Card className='shadow-md border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl text-purple-800 flex items-center gap-2'>
                  <Code className="w-5 h-5" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4'>
                  {formData.projects.split('\n\n').filter(project => project.trim()).map((project, index) => {
                    const lines = project.trim().split('\n');
                    const title = lines[0] || 'Untitled Project';
                    const description = lines.slice(1).join('\n').trim();

                    return (
                      <div key={index} className='bg-white rounded-lg p-6 shadow-sm border border-purple-100 hover:shadow-lg transition-all duration-300'>
                        <div className='flex items-start gap-3 mb-3'>
                          <div className='flex-shrink-0 w-4 h-4 rounded-full bg-purple-500 mt-1'></div>
                          <h4 className='text-lg font-bold text-gray-800 leading-tight'>{title}</h4>
                        </div>
                        {description && (
                          <div className='ml-7'>
                            <p className='text-gray-700 whitespace-pre-line leading-relaxed text-sm'>{description}</p>
                          </div>
                        )}
                        <div className='ml-7 mt-3 flex flex-wrap gap-2'>
                          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200'>
                            <Code className="w-3 h-3 mr-1" />
                            Project
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills Section */}
          {formData.skills && (
            <Card className='shadow-md border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl text-yellow-800 flex items-center gap-2'>
                  <Award className="w-5 h-5" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-white rounded-lg p-6 shadow-sm border border-yellow-100'>
                  <div className='flex flex-wrap gap-3'>
                    {formData.skills.split(',').filter(skill => skill.trim()).map((skill, index) => (
                      <span key={index} className='inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200 hover:bg-yellow-200 transition-colors duration-200'>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education Section */}
          {formData.education && (
            <Card className='shadow-md border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl text-red-800 flex items-center gap-2'>
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {formData.education.split('\n\n').filter(edu => edu.trim()).map((education, index) => (
                    <div key={index} className='bg-white rounded-lg p-5 shadow-sm border border-red-100 hover:shadow-md transition-shadow duration-200'>
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 w-3 h-3 rounded-full bg-red-500 mt-2'></div>
                        <div className='flex-1'>
                          <div className='whitespace-pre-line text-gray-700 leading-relaxed'>{education.trim()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications Section */}
          {formData.certifications && (
            <Card className='shadow-md border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50 to-white'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl text-indigo-800 flex items-center gap-2'>
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-white rounded-lg p-6 shadow-sm border border-indigo-100'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {formData.certifications.split('\n').filter(cert => cert.trim()).map((certification, index) => (
                      <div key={index} className='flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors duration-200'>
                        <div className='mr-3 text-indigo-600'>
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                          </svg>
                        </div>
                        <span className='text-gray-700 font-medium'>{certification.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Edit mode or no data
  return (
    <div className='w-full max-w-7xl mx-auto flex flex-col gap-8 pb-10 xl:pb-0'>
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {hasData ? 'Edit Your Profile' : 'Complete Your Profile'}
            </h1>
            <p className="text-gray-600 text-lg mt-2">Add your details to personalize your interview experience.</p>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Completion */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
                <p className="text-sm text-gray-600">Profile Completion</p>
              </div>
              <div className="w-16 h-16">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <RadialBarChart
                    data={[
                      { type: "completion", visitors: progressPercentage, fill: "hsl(var(--chart-1))" },
                      { type: "remaining", visitors: 100 - progressPercentage, fill: "hsl(var(--chart-2))" },
                    ]}
                    innerRadius={15}
                    outerRadius={30}
                  >
                    <RadialBar dataKey="visitors" background={false} />
                  </RadialBarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Interviews */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{interviewStats.total}</p>
                <p className="text-sm text-gray-600">Total Interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Interviews */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{interviewStats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Code className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{interviewStats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Parsing Section */}
      <Card className='border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl text-blue-900 flex items-center gap-2'>
            <FileText className="w-5 h-5" />
            AI-Powered Profile Parsing
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='rawProfile' className="text-gray-700 font-medium">Paste your complete profile or resume text here</Label>
            <p className="text-sm text-gray-600 mb-2">The AI will automatically extract and structure your information</p>
            <Textarea
              id='rawProfile'
              value={rawProfileText}
              onChange={(e) => setRawProfileText(e.target.value)}
              placeholder='Paste your resume text, LinkedIn profile, or any professional information here...'
              rows={8}
              className='mt-2 border-gray-300 focus:border-blue-500'
            />
          </div>
          <Button
            onClick={handleAIParsing}
            disabled={isParsing || !rawProfileText.trim()}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {isParsing ? 'Parsing...' : 'Parse with AI ✨'}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Entry Form */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Manual Profile Entry</h2>
          <p className="text-gray-600">Fill in your details manually or use AI parsing above</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Professional Summary */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-blue-600" />
                Professional Summary
              </CardTitle>
              <p className="text-sm text-gray-600">Write a compelling summary highlighting your key strengths and career goals</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id='summary'
                name='summary'
                value={formData.summary || ''}
                onChange={handleChange}
                placeholder='Example: Results-driven Full-Stack Developer with 3+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Passionate about creating user-centric solutions that drive business growth.'
                rows={4}
                className="border-gray-300 focus:border-blue-500"
              />
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-green-600" />
                Work Experience
              </CardTitle>
              <p className="text-sm text-gray-600">List your work experience with company names, positions, dates, and key responsibilities. Separate each experience with a blank line.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id='workExperience'
                name='workExperience'
                value={formData.workExperience || ''}
                onChange={handleChange}
                placeholder={`Example:
Senior Full-Stack Developer at TechCorp
Jan 2023 - Present
• Led development of microservices architecture serving 100K+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews

Full-Stack Developer at StartupXYZ
Jun 2020 - Dec 2022
• Built responsive web applications using React and Node.js
• Integrated third-party APIs and payment systems
• Collaborated with design team to improve UX/UI`}
                rows={8}
                className="border-gray-300 focus:border-green-500"
              />
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="w-5 h-5 text-purple-600" />
                Projects
              </CardTitle>
              <p className="text-sm text-gray-600">Describe your key projects with titles, technologies used, and your contributions. Separate each project with a blank line.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id='projects'
                name='projects'
                value={formData.projects || ''}
                onChange={handleChange}
                placeholder={`Example:
E-Commerce Platform
• Built a full-stack e-commerce solution using React, Node.js, and PostgreSQL
• Implemented real-time inventory management and payment processing
• Deployed on AWS with 99.9% uptime and handled 10K+ daily transactions

AI Chat Application
• Developed an AI-powered chatbot using Python, TensorFlow, and WebSockets
• Integrated natural language processing for conversational interfaces
• Reduced customer support tickets by 40% through automated responses`}
                rows={8}
                className="border-gray-300 focus:border-purple-500"
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-yellow-600" />
                Skills
              </CardTitle>
              <p className="text-sm text-gray-600">List your technical skills, programming languages, frameworks, and tools. Separate with commas.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id='skills'
                name='skills'
                value={formData.skills || ''}
                onChange={handleChange}
                placeholder='Example: JavaScript, React, Node.js, Python, Django, PostgreSQL, AWS, Docker, Git, Agile, Scrum'
                rows={4}
                className="border-gray-300 focus:border-yellow-500"
              />
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5 text-red-600" />
                Education
              </CardTitle>
              <p className="text-sm text-gray-600">List your educational background with degrees, institutions, and graduation dates. Separate each entry with a blank line.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id='education'
                name='education'
                value={formData.education || ''}
                onChange={handleChange}
                placeholder={`Example:
Master of Computer Science
Stanford University, 2020
• GPA: 3.8/4.0
• Relevant Coursework: Data Structures, Algorithms, Machine Learning

Bachelor of Engineering in Computer Science
MIT, 2018
• GPA: 3.7/4.0
• Capstone Project: AI-Powered Healthcare System`}
                rows={6}
                className="border-gray-300 focus:border-red-500"
              />
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-indigo-600" />
                Certifications
              </CardTitle>
              <p className="text-sm text-gray-600">List your professional certifications with issuing organizations and dates obtained. One certification per line.</p>
            </CardHeader>
            <CardContent>
              <Textarea
                id='certifications'
                name='certifications'
                value={formData.certifications || ''}
                onChange={handleChange}
                placeholder={`Example:
AWS Certified Solutions Architect - Amazon Web Services (2023)
Google Cloud Professional Developer - Google Cloud (2022)
Certified Scrum Master - Scrum Alliance (2021)
React Developer Certification - Meta (2020)`}
                rows={6}
                className="border-gray-300 focus:border-indigo-500"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex gap-4 justify-center pt-6'>
            <Button type='submit' className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
              Save Profile
            </Button>
            {hasData && (
              <Button type='button' variant='outline' onClick={() => setIsEditing(false)} className="px-8 py-2">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompleteProfileTab