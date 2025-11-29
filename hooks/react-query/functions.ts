type interviewsType = {
  name: string;
  id: string;
  createdAt: string; // ISO string from API
  role: string;
  difficultyLevel: string;
  interviewType: string;
  isCompleted: boolean | null;
  feedBack?: string | null;
  totalScore?: number | null;
}[];

export const FetchMockInterviews = async () => {
  const res = await fetch(`/api/interview/getall`);
  const data: interviewsType = await res.json();
  return data.filter((x) => !x.isCompleted);
};

export const FetchInterviewHistory = async () => {
  const res = await fetch(`/api/interview/getall`);
  const data: interviewsType = await res.json();
  return data.filter((x) => x.isCompleted);
};