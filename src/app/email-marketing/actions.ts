"use server";
import { generateEmail, type GenerateEmailInput, type GenerateEmailOutput } from "@/ai/flows/generate-email-flow";
import { generateMarketingEmailFallback } from "@/lib/ai-fallbacks";

export async function handleEmailGeneration(data: GenerateEmailInput): Promise<{
  success: boolean;
  data?: GenerateEmailOutput;
  error?: string;
  source?: 'live-ai' | 'smart-analytics';
}> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = geminiApiKey && geminiApiKey !== 'YOUR_API_KEY_HERE';

  if (isKeyConfigured) {
    try {
      const result = await generateEmail(data);
      if (result && result.subject && result.body) {
        return { success: true, data: result, source: 'live-ai' };
      }
    } catch (error: any) {
      console.warn("Live Gemini email generation failed or key revoked, falling back to smart marketing engine:", error?.message || error);
    }
  }

  // Resilient fallback
  const fallback = generateMarketingEmailFallback(data.productName, data.productFeatures);
  return {
    success: true,
    data: fallback,
    source: 'smart-analytics',
  };
}
