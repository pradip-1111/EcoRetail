"use server";

import { generateDashboardSuggestions, type DashboardAiSuggestion } from "@/lib/ai-fallbacks";
import { ai } from "@/ai/genkit";

export async function fetchDashboardAiSuggestions(products: Array<{
  name: string;
  score: number;
  status: string;
  co2Footprint: number;
  labels: string[];
}>): Promise<{
  success: boolean;
  suggestions: DashboardAiSuggestion[];
  source: 'live-ai' | 'smart-analytics';
  message?: string;
}> {
  // If no products, return empty list
  if (!products || products.length === 0) {
    return {
      success: true,
      suggestions: [],
      source: 'smart-analytics',
    };
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = geminiApiKey && geminiApiKey !== 'YOUR_API_KEY_HERE';

  if (isKeyConfigured) {
    try {
      // Try generating enhanced insights with Genkit / Gemini
      const prompt = `You are an expert sustainable retail operations AI analyst.
Analyze these products in our catalog:
${JSON.stringify(products.slice(0, 8), null, 2)}

Provide 4 actionable recommendations for the retail dashboard in strictly valid JSON array format:
[
  {
    "id": "unique-id",
    "category": "inventory" | "carbon" | "score" | "supply-chain",
    "title": "Short title",
    "description": "1-2 sentence actionable recommendation",
    "impact": "High" | "Medium" | "Low",
    "actionLabel": "Button text",
    "actionHref": "/waste-reduction" | "/products" | "/carbon-footprint" | "/supply-chain" | "/email-marketing" | "/certifications",
    "metricBadge": "Short badge text"
  }
]
Return ONLY JSON, no markdown backticks.`;

      const response = await ai.generate({ prompt });
      const text = response.text?.trim() || "";
      const cleaned = text.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          success: true,
          suggestions: parsed,
          source: 'live-ai',
        };
      }
    } catch (err: any) {
      console.warn("Live Gemini call for dashboard skipped, using smart analytics fallback:", err?.message || err);
    }
  }

  // Gracefully fallback to our smart analytical recommendation engine
  const fallbackSuggestions = generateDashboardSuggestions(products);
  return {
    success: true,
    suggestions: fallbackSuggestions,
    source: 'smart-analytics',
    message: isKeyConfigured 
      ? 'Generated using local smart sustainability algorithms.'
      : 'Running in smart analytics mode. Set a valid GEMINI_API_KEY in .env.local to enable live generative AI.',
  };
}
