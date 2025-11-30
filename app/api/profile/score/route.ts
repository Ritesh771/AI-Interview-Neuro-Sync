import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { profileData } = await req.json();

    if (!profileData) {
      return NextResponse.json({ error: "Profile data is required" }, { status: 400 });
    }

    // Create a comprehensive profile text from the structured data
    let profileText = "";
    
    if (profileData.summary) {
      profileText += `Professional Summary:\n${profileData.summary}\n\n`;
    }
    
    if (profileData.workExperience) {
      profileText += `Work Experience:\n${profileData.workExperience}\n\n`;
    }
    
    if (profileData.projects) {
      profileText += `Projects:\n${profileData.projects}\n\n`;
    }
    
    if (profileData.skills) {
      profileText += `Skills:\n${profileData.skills}\n\n`;
    }
    
    if (profileData.education) {
      profileText += `Education:\n${profileData.education}\n\n`;
    }
    
    if (profileData.certifications) {
      profileText += `Certifications:\n${profileData.certifications}\n\n`;
    }

    let scoreResult;

    try {
      const { text: scoreAnalysis } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Analyze the following professional profile and provide a comprehensive scoring assessment. 

Profile Content:
${profileText}

Please evaluate this profile and provide a detailed analysis with the following structure:
{
  "score": 85,
  "maxScore": 100,
  "analysis": "A detailed explanation of the score (300-400 words)",
  "strengths": ["List of key strengths identified in the profile"],
  "weaknesses": ["Areas that need improvement in the profile"],
  "recommendations": ["Specific recommendations to improve the profile"],
  "sections": {
    "summary": {
      "score": 20,
      "maxScore": 20,
      "feedback": "Feedback on the professional summary"
    },
    "experience": {
      "score": 25,
      "maxScore": 25,
      "feedback": "Feedback on work experience section"
    },
    "projects": {
      "score": 15,
      "maxScore": 15,
      "feedback": "Feedback on projects section"
    },
    "skills": {
      "score": 10,
      "maxScore": 10,
      "feedback": "Feedback on skills section"
    },
    "education": {
      "score": 10,
      "maxScore": 10,
      "feedback": "Feedback on education section"
    },
    "certifications": {
      "score": 5,
      "maxScore": 5,
      "feedback": "Feedback on certifications section"
    }
  }
}

IMPORTANT:
- Return ONLY valid JSON, nothing else
- Ensure all fields are populated
- Provide realistic scores based on the profile quality
- Do not include markdown or any other formatting
- Be constructive and specific in your feedback
- The total score should be out of 100
`,
      });

      // Clean up the response and parse the evaluation
      try {
        // Remove any markdown formatting if present
        const cleanText = scoreAnalysis.replace(/```json\s*|\s*```/g, '').trim();
        scoreResult = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("Error parsing score analysis:", parseError);
        console.error("Raw response:", scoreAnalysis);
        throw new Error("Failed to parse score analysis");
      }
    } catch (aiError: any) {
      console.warn("AI quota exceeded for profile scoring, using fallback analysis:", aiError.message);
      
      // Generate fallback profile scoring
      scoreResult = generateFallbackProfileScore(profileData);
    }

    return NextResponse.json({ scoreResult }, { status: 200 });
  } catch (error) {
    console.error("Error scoring profile:", error);
    return NextResponse.json({ error: "Failed to score profile" }, { status: 500 });
  }
}

// Fallback profile scoring when Gemini API quota is exceeded
function generateFallbackProfileScore(profileData: any) {
  // Calculate basic scores based on content presence and length
  const calculateSectionScore = (content: string, maxScore: number) => {
    if (!content || content.trim().length === 0) return 0;
    const length = content.trim().length;
    // Basic scoring: more content = higher score, up to maxScore
    const score = Math.min(maxScore, Math.floor((length / 100) * maxScore));
    return Math.max(1, score); // Minimum score of 1 if content exists
  };

  const sections = {
    summary: {
      score: calculateSectionScore(profileData.summary || '', 20),
      maxScore: 20,
      feedback: profileData.summary ? 
        "Professional summary is present and provides an overview of your background." : 
        "Consider adding a professional summary to highlight your key qualifications and career goals."
    },
    experience: {
      score: calculateSectionScore(profileData.workExperience || '', 25),
      maxScore: 25,
      feedback: profileData.workExperience ? 
        "Work experience section is included, showcasing your professional background." : 
        "Add detailed work experience to demonstrate your career progression and achievements."
    },
    projects: {
      score: calculateSectionScore(profileData.projects || '', 15),
      maxScore: 15,
      feedback: profileData.projects ? 
        "Projects section highlights your practical experience and technical skills." : 
        "Include relevant projects to showcase your hands-on experience and problem-solving abilities."
    },
    skills: {
      score: calculateSectionScore(profileData.skills || '', 10),
      maxScore: 10,
      feedback: profileData.skills ? 
        "Skills section demonstrates your technical competencies." : 
        "List your technical skills and competencies to show potential employers your capabilities."
    },
    education: {
      score: calculateSectionScore(profileData.education || '', 10),
      maxScore: 10,
      feedback: profileData.education ? 
        "Education background is documented, showing your academic qualifications." : 
        "Include your educational background to establish your foundational knowledge."
    },
    certifications: {
      score: calculateSectionScore(profileData.certifications || '', 5),
      maxScore: 5,
      feedback: profileData.certifications ? 
        "Certifications demonstrate your commitment to professional development." : 
        "Consider adding relevant certifications to strengthen your professional credentials."
    }
  };

  // Calculate total score
  const totalScore = Object.values(sections).reduce((sum, section) => sum + section.score, 0);

  // Generate basic analysis
  const completeness = Object.values(sections).filter(section => section.score > 0).length;
  const completenessPercentage = Math.round((completeness / 6) * 100);

  const analysis = `This profile analysis is based on content completeness and basic quality assessment due to service limitations. Your profile is ${completenessPercentage}% complete with ${completeness} out of 6 sections filled. The overall score of ${totalScore}/100 reflects the presence and detail of information provided. For a more comprehensive AI-powered analysis, please upgrade your service plan to access advanced profile evaluation features.`;

  // Generate basic strengths and weaknesses
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  Object.entries(sections).forEach(([key, section]) => {
    if (section.score > 0) {
      strengths.push(`${key.charAt(0).toUpperCase() + key.slice(1)} section is present`);
    } else {
      weaknesses.push(`Missing ${key} section`);
      recommendations.push(`Add detailed information to the ${key} section`);
    }
  });

  if (strengths.length === 0) {
    strengths.push("Profile structure is established");
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Consider adding more detailed content to existing sections");
    recommendations.push("Expand on existing sections with more specific details and achievements");
  }

  return {
    score: totalScore,
    maxScore: 100,
    analysis,
    strengths,
    weaknesses,
    recommendations,
    sections,
    warning: "This is a basic analysis due to AI service quota limitations. Upgrade your plan for detailed AI-powered profile evaluation."
  };
}