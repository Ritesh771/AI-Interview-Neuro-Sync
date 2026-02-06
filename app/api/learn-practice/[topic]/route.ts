import { NextRequest, NextResponse } from 'next/server'
import { problemsData } from '@/lib/problems-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
    const { topic } = await params

    // Find the problems for this topic
    const problems = problemsData[topic]

    if (!problems) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // In a real app, you would fetch user progress from database
    // For now, return the static problems
    return NextResponse.json({
      problems,
      total: problems.length,
      solved: problems.filter(p => p.solved).length
    })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}