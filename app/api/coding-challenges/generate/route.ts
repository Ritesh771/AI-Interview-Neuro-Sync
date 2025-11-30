import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

// Define the structure for a coding challenge
interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleTestCases: { input: string; output: string }[];
  hiddenTestCases: { input: string; output: string }[];
}

export async function POST(req: NextRequest) {
  try {
    const { 
      role, 
      experienceLevel, 
      difficulty, 
      numberOfQuestions 
    } = await req.json();

    // Generate coding challenges using Google Gemini
    let challenges: CodingChallenge[];
    
    try {
      const { text: generatedChallenges } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `Generate ${numberOfQuestions} coding interview challenges for a ${role} position with ${experienceLevel} experience level and ${difficulty} difficulty.
      
      Each challenge should include:
      1. A unique title
      2. A clear problem description
      3. Input format specification
      4. Output format specification
      5. Constraints
      6. 2 sample test cases with input/output
      7. 3 hidden test cases with input/output for evaluation
      
      Return ONLY a valid JSON array of challenge objects with the following structure:
      [
        {
          "id": "1",
          "title": "Two Sum",
          "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          "difficulty": "Easy",
          "inputFormat": "First line contains an integer n representing the size of array. Second line contains n space separated integers representing the array elements. Third line contains an integer target.",
          "outputFormat": "Print two space separated integers representing the indices of the two numbers that add up to target.",
          "constraints": "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
          "sampleTestCases": [
            {
              "input": "4\\n2 7 11 15\\n9",
              "output": "0 1"
            },
            {
              "input": "3\\n3 2 4\\n6",
              "output": "1 2"
            }
          ],
          "hiddenTestCases": [
            {
              "input": "2\\n3 3\\n6",
              "output": "0 1"
            },
            {
              "input": "5\\n1 2 3 4 5\\n8",
              "output": "2 4"
            },
            {
              "input": "6\\n-1 -2 -3 -4 -5 -6\\n-7",
              "output": "0 5"
            }
          ]
        }
      ]
      
      IMPORTANT:
      - Return ONLY valid JSON, nothing else
      - Ensure all fields are populated
      - Make problems appropriate for the experience level and role
      - Ensure hidden test cases are more comprehensive than sample test cases
      - Do not include markdown or any other formatting
      - Make sure each challenge has a unique ID
      `,
    });

    // Clean up the response and parse the generated challenges
    let challenges: CodingChallenge[];
    try {
      // Remove any markdown formatting if present
      const cleanText = generatedChallenges.replace(/```json\s*|\s*```/g, '').trim();
      challenges = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Error parsing generated challenges:", parseError);
      console.error("Raw response:", generatedChallenges);
      throw new Error("Failed to parse generated challenges");
    }
    } catch (apiError: any) {
      console.error("Gemini API quota exceeded for coding challenges, using fallback challenges:", apiError.message);
      
      // Generate fallback coding challenges
      challenges = generateFallbackCodingChallenges(role, experienceLevel, difficulty, numberOfQuestions);
    }

    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error("Error generating coding challenges:", error);
    return NextResponse.json(
      { error: "Failed to generate coding challenges" }, 
      { status: 500 }
    );
  }
}

// Fallback coding challenge generation when Gemini API quota is exceeded
function generateFallbackCodingChallenges(
  role: string,
  experienceLevel: string,
  difficulty: string,
  numberOfQuestions: number
): CodingChallenge[] {
  const challenges: CodingChallenge[] = [];
  
  // Define fallback challenges based on difficulty
  const fallbackChallenges = {
    Easy: [
      {
        id: "1",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy",
        inputFormat: "First line contains two integers n and target. Second line contains n space separated integers.",
        outputFormat: "Print two space separated integers representing the indices.",
        constraints: "2 <= n <= 10^4, -10^9 <= nums[i], target <= 10^9",
        sampleTestCases: [
          { input: "4 9\n2 7 11 15", output: "0 1" },
          { input: "3 6\n3 2 4", output: "1 2" }
        ],
        hiddenTestCases: [
          { input: "2 6\n3 3", output: "0 1" },
          { input: "5 8\n1 2 3 4 5", output: "2 4" },
          { input: "4 -1\n-3 -1 2 1", output: "0 3" }
        ]
      },
      {
        id: "2",
        title: "Palindrome Number",
        description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.",
        difficulty: "Easy",
        inputFormat: "First line contains an integer x.",
        outputFormat: "Print 'true' if palindrome, 'false' otherwise.",
        constraints: "-2^31 <= x <= 2^31 - 1",
        sampleTestCases: [
          { input: "121", output: "true" },
          { input: "-121", output: "false" }
        ],
        hiddenTestCases: [
          { input: "10", output: "false" },
          { input: "0", output: "true" },
          { input: "12321", output: "true" }
        ]
      }
    ],
    Medium: [
      {
        id: "3",
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
        difficulty: "Medium",
        inputFormat: "First line contains a string s.",
        outputFormat: "Print 'true' if valid, 'false' otherwise.",
        constraints: "1 <= s.length <= 10^4, s consists of parentheses only '()[]{}'",
        sampleTestCases: [
          { input: "()[]{}", output: "true" },
          { input: "(]", output: "false" }
        ],
        hiddenTestCases: [
          { input: "([)]", output: "false" },
          { input: "{[]}", output: "true" },
          { input: "((()))", output: "true" }
        ]
      }
    ],
    Hard: [
      {
        id: "4",
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        difficulty: "Hard",
        inputFormat: "First line contains two integers m and n. Second line contains m integers. Third line contains n integers.",
        outputFormat: "Print the median as a floating point number.",
        constraints: "nums1.length == m, nums2.length == n, 0 <= m <= 1000, 0 <= n <= 1000, 1 <= m + n <= 2000",
        sampleTestCases: [
          { input: "2 2\n1 3\n2 4", output: "2.5" },
          { input: "2 1\n1 2\n3", output: "2.0" }
        ],
        hiddenTestCases: [
          { input: "1 1\n1\n2", output: "1.5" },
          { input: "3 3\n1 2 3\n4 5 6", output: "3.5" },
          { input: "0 1\n\n1", output: "1.0" }
        ]
      }
    ]
  };

  const availableChallenges = fallbackChallenges[difficulty as keyof typeof fallbackChallenges] || fallbackChallenges.Easy;
  
  // Generate the requested number of challenges
  for (let i = 0; i < numberOfQuestions; i++) {
    const challengeIndex = i % availableChallenges.length;
    const challenge = { ...availableChallenges[challengeIndex] };
    challenge.id = (i + 1).toString();
    challenges.push(challenge);
  }

  return challenges;
}