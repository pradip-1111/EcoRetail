"use server";
import { suggestShelfPlacement, type SuggestShelfPlacementInput, type SuggestShelfPlacementOutput } from "@/ai/flows/suggest-shelf-placement";
import { generateShelfPlacementFallback } from "@/lib/ai-fallbacks";

export async function handleShelfPlacementSuggestion(data: { productName: string, currentShelfPlacement: string }): Promise<{
  success: boolean;
  data?: SuggestShelfPlacementOutput;
  error?: string;
  source?: 'live-ai' | 'smart-analytics';
}> {
  const input: SuggestShelfPlacementInput = {
    productName: data.productName,
    currentShelfPlacement: data.currentShelfPlacement,
    salesData: JSON.stringify([
      { date: "2023-10-01", sales: 15 },
      { date: "2023-10-02", sales: 25 },
      { date: "2023-10-03", sales: 18 },
    ]),
    spoilageData: JSON.stringify([
      { date: "2023-10-01", spoiled: 2 },
      { date: "2023-10-02", spoiled: 4 },
      { date: "2023-10-03", spoiled: 3 },
    ]),
    transportationData: JSON.stringify({
      mode: "Refrigerated Truck",
      averageDuration: "2 days",
      route: "Farm -> Distribution Center -> Store"
    }),
  };

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = geminiApiKey && geminiApiKey !== 'YOUR_API_KEY_HERE';

  if (isKeyConfigured) {
    try {
      const result = await suggestShelfPlacement(input);
      if (result && result.shelfPlacementSuggestion) {
        return { success: true, data: result, source: 'live-ai' };
      }
    } catch (error: any) {
      console.warn("Live Gemini shelf placement failed or key revoked, falling back to smart analytics engine:", error?.message || error);
    }
  }

  // Resilient fallback: calculate intelligent shelf & transport recommendation
  const fallback = generateShelfPlacementFallback(data.productName, data.currentShelfPlacement);
  return {
    success: true,
    data: fallback,
    source: 'smart-analytics',
  };
}
