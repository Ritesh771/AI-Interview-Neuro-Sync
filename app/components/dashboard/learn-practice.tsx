import React from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface TopicData {
  name: string
  solved: number
  total: number
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const codingTopics: TopicData[] = [
  { name: 'Conditional statements, loops', solved: 16, total: 26, description: 'Coding problem set', difficulty: 'Easy' },
  { name: 'Arrays', solved: 0, total: 78, description: 'Coding problem set', difficulty: 'Medium' },
  { name: 'String', solved: 0, total: 69, description: 'Coding problem set', difficulty: 'Medium' },
  { name: 'Recursion', solved: 0, total: 40, description: 'Coding problem set', difficulty: 'Hard' },
  { name: 'Searching', solved: 0, total: 38, description: 'Coding problem set', difficulty: 'Medium' },
  { name: 'Sorting', solved: 0, total: 48, description: 'Coding problem set', difficulty: 'Medium' },
  { name: 'Linked list', solved: 0, total: 49, description: 'Coding problem set', difficulty: 'Medium' },
  { name: 'Stack', solved: 0, total: 5, description: 'Coding problem set', difficulty: 'Easy' },
  { name: 'Queue', solved: 0, total: 30, description: 'Coding problem set', difficulty: 'Easy' },
  { name: 'Hashing', solved: 0, total: 44, description: 'Coding problem set', difficulty: 'Medium' },
  { name: 'Trees', solved: 0, total: 50, description: 'Coding problem set', difficulty: 'Hard' },
  { name: 'Heap', solved: 0, total: 39, description: 'Coding problem set', difficulty: 'Hard' },
  { name: 'Graphs', solved: 0, total: 39, description: 'Coding problem set', difficulty: 'Hard' },
  { name: 'Dynamic programming', solved: 0, total: 52, description: 'Coding problem set', difficulty: 'Hard' },
]

const LearnPracticeSection = () => {
  const totalSolved = codingTopics.reduce((sum, topic) => sum + topic.solved, 0)
  const totalProblems = codingTopics.reduce((sum, topic) => sum + topic.total, 0)
  const overallProgress = Math.round((totalSolved / totalProblems) * 100)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
      case 'Hard': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
      default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    }
  }

  return (
    <div className='w-full flex flex-col gap-6 pb-10 xl:pb-0'>
      {/* Header Section */}
      <div className="bg-white/60 rounded-4xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Coding Practice</h1>
          <p className="text-gray-600 text-lg">Master algorithms and data structures through structured practice</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="text-center group-hover:scale-105 transition-transform duration-200">
                <p className="text-3xl font-bold text-gray-800 mb-1">{totalSolved}</p>
                <p className="text-sm text-gray-600 font-medium">Problems Solved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="text-center group-hover:scale-105 transition-transform duration-200">
                <p className="text-3xl font-bold text-gray-800 mb-1">{totalProblems}</p>
                <p className="text-sm text-gray-600 font-medium">Total Problems</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="text-center group-hover:scale-105 transition-transform duration-200">
                <p className="text-3xl font-bold text-gray-800 mb-1">{overallProgress}%</p>
                <p className="text-sm text-gray-600 font-medium">Overall Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {codingTopics.map((topic, index) => {
          const percentage = Math.round((topic.solved / topic.total) * 100)
          const isCompleted = percentage === 100
          const isStarted = topic.solved > 0

          return (
            <Card
              key={index}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-gray-800 leading-tight group-hover:text-gray-900 transition-colors duration-200">
                    {topic.name}
                  </CardTitle>
                  <span className={`px-3 py-1 text-xs font-medium rounded-md border transition-all duration-200 ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{percentage}% Complete</span>
                    <span className="text-xs text-gray-500">{topic.solved}/{topic.total} solved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        isCompleted ? 'bg-green-500' :
                        isStarted ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className={`w-full font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md'
                      : isStarted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                      : 'bg-gray-600 hover:bg-gray-700 text-white hover:shadow-md'
                  }`}
                >
                  {isCompleted ? 'Review Problems' : isStarted ? 'Continue Practice' : 'Start Practice'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-4xl p-6 border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 mb-2">Practice Guidelines</h3>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Focus on understanding core concepts before moving to complex problems. Regular practice builds strong algorithmic thinking skills.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LearnPracticeSection