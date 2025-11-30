import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";

// Fallback helper functions for basic text extraction
function extractSkillsFallback(text: string): string {
  const skillsKeywords = ['skills', 'technologies', 'programming languages', 'frameworks', 'tools'];
  const lines = text.split('\n');
  const skillsSection = lines.find(line =>
    skillsKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );

  if (skillsSection) {
    return skillsSection.replace(/^(skills?|technologies?|programming languages?|frameworks?|tools?):\s*/i, '').trim();
  }

  // Look for common tech skills in the text
  const commonSkills = ['javascript', 'python', 'java', 'react', 'node.js', 'html', 'css', 'sql', 'git'];
  const foundSkills = commonSkills.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return foundSkills.length > 0 ? `Technical Skills: ${foundSkills.join(', ')}` : 'Skills not detected. Please enter manually.';
}

function extractWorkExperienceFallback(text: string): string {
  const experienceKeywords = ['experience', 'work', 'employment', 'job', 'position'];
  const lines = text.split('\n');
  const experienceLines = lines.filter(line =>
    experienceKeywords.some(keyword => line.toLowerCase().includes(keyword)) ||
    /\d{4}/.test(line) // Look for years
  );

  return experienceLines.length > 0
    ? experienceLines.join('\n')
    : 'Work experience not detected. Please enter manually.';
}

function extractEducationFallback(text: string): string {
  const educationKeywords = ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'phd'];
  const lines = text.split('\n');
  const educationLines = lines.filter(line =>
    educationKeywords.some(keyword => line.toLowerCase().includes(keyword)) ||
    /\b(university|college|institute)\b/i.test(line)
  );

  return educationLines.length > 0
    ? educationLines.join('\n')
    : 'Education not detected. Please enter manually.';
}

export async function POST(req: NextRequest) {
  try {
    const { rawProfileText } = await req.json();

    if (!rawProfileText) {
      return NextResponse.json({ error: "Raw profile text is required" }, { status: 400 });
    }

    let structuredProfile: string;

    try {
      const { text } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Parse the following raw profile text and extract structured information. Return ONLY a valid JSON object with these exact keys:

{
  "summary": "Professional summary text",
  "skills": "Skills organized by categories with proper formatting",
  "workExperience": "Work experience with company, dates, role, and bullet points",
  "projects": "Key projects with descriptions",
  "education": "Education with institution, degree, dates, and grades",
  "certifications": "Certifications with title and date"
}

Rules:
- Extract information accurately from the provided text
- Format work experience as: "Company (dates) - Role, Location\\n• Bullet point\\n• Bullet point"
- Format education as: "Degree - Institution, Location (dates) - Grade"
- Format certifications as: "Certification Title — Issuer (date)"
- Keep skills organized by categories like "Languages: skill1, skill2"
- Ensure all text is properly formatted and professional
- Return ONLY the JSON object, no additional text or markdown

Raw profile text:
${rawProfileText}`,
      });
      structuredProfile = text;
    } catch (aiError) {
      console.warn("AI quota exceeded, using fallback profile structuring:", aiError);

      // Fallback: Basic text extraction without AI
      const fallbackProfile = {
        summary: "Professional summary not available due to service limits. Please enter manually.",
        skills: extractSkillsFallback(rawProfileText),
        workExperience: extractWorkExperienceFallback(rawProfileText),
        projects: "Projects not available due to service limits. Please enter manually.",
        education: extractEducationFallback(rawProfileText),
        certifications: "Certifications not available due to service limits. Please enter manually."
      };

      return NextResponse.json({
        structuredProfile: fallbackProfile,
        warning: "AI service quota exceeded. Basic text extraction used as fallback. Please upgrade your plan for full AI-powered parsing."
      });
    }

    // Parse the AI response
    const parsedProfile = JSON.parse(structuredProfile.replace(/^```json\n|```$/g, "").trim());

    return NextResponse.json({ structuredProfile: parsedProfile });
  } catch (error) {
    console.error("Error structuring profile:", error);
    return NextResponse.json({ error: "Failed to structure profile" }, { status: 500 });
  }
}