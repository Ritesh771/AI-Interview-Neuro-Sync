"use server";

import { z } from "zod";
import { FormState } from "../components/auth/auth-form";
import { auth } from "../(auth-pages)/auth";

const CreateInterviewSchema = z.object({
  name: z.string().trim().min(2),
  type: z.string().trim().min(2),
  role: z.string().trim().min(2),
  techStack: z.string().trim().min(2),
  experience: z.string().trim().min(2),
  difficultyLevel: z.string().trim().min(2),
  noOfQuestions: z.number().nonnegative(),
  userId: z.string().nonempty(),
  interviewType: z.string().trim().min(2),
});

export async function handleCreateInterviewFormAction(
  prevState: FormState,
  formData: FormData
) {
  try {
    const Session = await auth();
    const userId = Session?.user?.id;

    const data = {
      name: formData.get("name"),
      type: formData.get("type"),
      role: formData.get("role"),
      techStack: formData.get("techStack"),
      experience: formData.get("experience"),
      difficultyLevel: formData.get("difficultyLevel"),
      noOfQuestions: formData.get("numberOfQuestions")
        ? parseInt(formData.get("numberOfQuestions") as string)
        : null,
      interviewType: formData.get("interviewType") || "Live Voice Interview",
      userId: userId,
    };
    
    await CreateInterviewSchema.parseAsync(data);

    // Check the interview type
    const interviewType = (formData.get("interviewType") as string) || "Live Voice Interview";
    const isCodingInterview = interviewType === "Coding Round";
    const isAptitude = interviewType === "Aptitude Round";
    // Map Live Voice Interview to be processed by the Gemini server endpoint
    const shouldUseGeminiEndpoint = isAptitude || interviewType === "Live Voice Interview";
    
    console.log("Form data received:", {
      interviewType,
      type: formData.get("type"),
      isAptitude,
      shouldUseGeminiEndpoint
    });
    
    // For Aptitude interviews, keep type as 'aptitude'. For Live Voice interviews routed to Gemini
    // we keep the original `type` (Technical/Behavioral/...), but use Gemini endpoint for generation
    const interviewData = {
      ...data,
      type: isAptitude ? "aptitude" : data.type,
    };
    
    console.log("Final interview data:", interviewData);
    
    // Determine which API endpoint to use
    let apiUrl;
    if (isCodingInterview) {
      apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/create-coding`;
    } else if (shouldUseGeminiEndpoint) {
      apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/gemini`;
    } else {
      apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/create`;
    }

    const createInterviewRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interviewData),
    });

    if (createInterviewRes.ok) {
      return { success: true };
    } else {
      const errorData = await createInterviewRes.json();
      console.error("API Error:", errorData);
      return { success: false };
    }
  } catch (e) {
    console.error("Form Action Error:", e);
    return { success: false };
  }
}

export async function handleCompleteInterviewAction(data:any) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error("Interview completion API Error:", errorData);
      return { success: false, error: errorData.error || `HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (e) {
    console.error("Interview completion error:", e);
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}