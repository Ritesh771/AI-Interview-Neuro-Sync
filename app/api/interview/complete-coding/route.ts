import { auth } from "@/app/(auth-pages)/auth";
import { createInterviewFeedback, updateInterview } from "@/lib/firebase-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interviewId, results } = await req.json();

    if (!interviewId || !results) {
      return NextResponse.json(
        { error: "Missing interviewId or results" },
        { status: 400 }
      );
    }

    // Create feedback record for coding interview
    const passedQuestions = results.scores.filter((score: number) => score === 100).length;
    const totalQuestions = results.scores.length;
    
    const feedbackData = {
      interviewId: interviewId,
      userId: session.user.id,
      feedBack: `Coding interview completed. ${passedQuestions} out of ${totalQuestions} challenges solved correctly (${results.averageScore}% success rate). ${results.passed ? 'Overall: PASSED' : 'Overall: FAILED'}`,
      problemSolving: results.averageScore, // Percentage of correct solutions
      systemDesign: results.averageScore, // Using same score for consistency
      communicationSkills: 0, // Not applicable for coding interviews
      technicalAccuracy: results.averageScore, // Percentage of correct solutions
      behavioralResponses: 0, // Not applicable for coding interviews
      timeManagement: 0, // Not applicable for coding interviews
    };

    // Create the feedback record
    await createInterviewFeedback(feedbackData);

    // Update the interview status to completed
    await updateInterview(interviewId, { isCompleted: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error completing coding interview:", error);
    return NextResponse.json(
      { error: "Failed to complete coding interview" },
      { status: 500 }
    );
  }
}