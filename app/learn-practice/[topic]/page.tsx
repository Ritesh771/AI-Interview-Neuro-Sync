'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { problemsData } from '@/lib/problems-data'

// Define the topics and their slugs
const topics = [
  { name: 'Conditional statements, loops', slug: 'conditional-statements-loops', difficulty: 'Easy' },
  { name: 'Arrays', slug: 'arrays', difficulty: 'Medium' },
  { name: 'String', slug: 'string', difficulty: 'Medium' },
  { name: 'Recursion', slug: 'recursion', difficulty: 'Hard' },
  { name: 'Searching', slug: 'searching', difficulty: 'Medium' },
  { name: 'Sorting', slug: 'sorting', difficulty: 'Medium' },
  { name: 'Linked list', slug: 'linked-list', difficulty: 'Medium' },
  { name: 'Stack', slug: 'stack', difficulty: 'Easy' },
  { name: 'Queue', slug: 'queue', difficulty: 'Easy' },
  { name: 'Hashing', slug: 'hashing', difficulty: 'Medium' },
  { name: 'Trees', slug: 'trees', difficulty: 'Hard' },
  { name: 'Heap', slug: 'heap', difficulty: 'Hard' },
  { name: 'Graphs', slug: 'graphs', difficulty: 'Hard' },
  { name: 'Dynamic programming', slug: 'dynamic-programming', difficulty: 'Hard' },
]

interface Problem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solved: boolean
}

interface PageProps {
  params: Promise<{ topic: string }>
}

export default function TopicPracticePage({ params }: PageProps) {
  const [topic, setTopic] = useState<string>('')
  const [problems, setProblems] = useState<Problem[]>([])
  const [total, setTotal] = useState(0)
  const [solved, setSolved] = useState(0)

  useEffect(() => {
    params.then(({ topic: t }) => {
      setTopic(t)
      const topicData = topics.find(tp => tp.slug === t)
      if (!topicData) {
        notFound()
      }
      const probs = problemsData[t] || []
      const updatedProblems = probs.map(p => ({
        ...p,
        solved: typeof window !== 'undefined' && localStorage.getItem(`solved-${t}-${p.id}`) === 'true'
      }))
      setProblems(updatedProblems)
      setTotal(probs.length)
      setSolved(updatedProblems.filter(p => p.solved).length)
    })
  }, [params])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
      case 'Hard': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
      default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    }
  }

  const topicData = topics.find(t => t.slug === topic)

  if (!topicData) {
    return <div>Topic not found</div>
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 shadow-sm mb-8">
        <div className="flex flex-col gap-6">
          {/* Top Row: Title and Back Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{topicData.name}</h1>
              <p className="text-gray-600 text-base sm:text-lg mt-1">Practice coding problems to master this topic</p>
            </div>
            <div className="flex-shrink-0">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 border-gray-300 transition-all duration-200 hover:shadow-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Learn & Practice
                </Button>
              </Link>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-gray-900">{solved}</div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">Completed</div>
                <div>of {total} problems</div>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{total > 0 ? Math.round((solved / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${total > 0 ? (solved / total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-6">
        {problems.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No problems available</h3>
              <p className="text-gray-500">Problems for this topic are coming soon. Check back later!</p>
            </div>
          </div>
        ) : (
          problems.map((problem, index) => (
            <div
              key={problem.id}
              className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-lg hover:border-gray-300/50 transition-all duration-300 group"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-6 flex-1 min-w-0">
                    {/* Problem Number */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-200 ${
                        problem.solved
                          ? 'bg-green-100 text-green-700 border-2 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-200 group-hover:border-blue-300 group-hover:bg-blue-50'
                      }`}>
                        {problem.id}
                      </div>
                    </div>

                    {/* Problem Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 leading-tight group-hover:text-gray-900 transition-colors">
                        {problem.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        {problem.solved && (
                          <span className="inline-flex items-center gap-2 text-sm text-green-600 font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {problem.solved ? (
                      <div className="flex items-center gap-3 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium">Solved</span>
                      </div>
                    ) : (
                      <Link href={`/coding-problem/${topic}/${problem.id}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          Solve Problem →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {problems.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200/50 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Practice Tips</h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Focus on understanding the problem requirements first. Write clean, efficient code and test your solution thoroughly before moving to the next problem.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}