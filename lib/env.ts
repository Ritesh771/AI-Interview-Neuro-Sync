export const getApiKey = (): string | undefined => {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
};