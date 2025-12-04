"use server";
import { generateEmail, type GenerateEmailInput, type GenerateEmailOutput } from "@/ai/flows/generate-email-flow";

export async function handleEmailGeneration(data: GenerateEmailInput): Promise<{ success: boolean; data?: GenerateEmailOutput; error?: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || geminiApiKey === 'YOUR_API_KEY_HERE') {
    const errorMessage = "The Google AI API key is not configured. Please add your key to the GEMINI_API_KEY variable in the .env file. You can get a key from Google AI Studio.";
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  try {
    const result = await generateEmail(data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in email generation flow:", error);
    const errorMessage = error.message || "An unexpected error occurred during email generation.";
    return { success: false, error: `Failed to get an email from the AI model. Details: ${errorMessage}` };
  }
}
