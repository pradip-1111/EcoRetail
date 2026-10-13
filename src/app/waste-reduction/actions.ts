// src/app/waste-reduction/actions.ts
"use server";
import { predictWaste, type PredictWasteInput, type PredictWasteOutput } from "@/ai/flows/predict-waste";
import { generateWastePredictionFallback } from "@/lib/ai-fallbacks";

export async function handleWastePrediction(data: { productName: string }): Promise<{
  success: boolean;
  data?: PredictWasteOutput;
  error?: string;
  source?: 'live-ai' | 'smart-analytics';
}> {
  const input: PredictWasteInput = {
    productName: data.productName,
    historicalSalesData: JSON.stringify([
      { date: "2023-10-01", sales: 50 },
      { date: "2023-10-02", sales: 55 },
      { date: "2023-10-03", sales: 48 },
    ]),
    weatherForecast: JSON.stringify({
      next7days: [
        { day: "Monday", temp: "15°C", condition: "Sunny" },
        { day: "Tuesday", temp: "12°C", condition: "Rainy" },
        { day: "Wednesday", temp: "14°C", condition: "Cloudy" },
      ],
    }),
    seasonality: JSON.stringify({
      currentSeason: "Autumn",
      upcomingEvents: ["Halloween Promotion"],
    }),
  };

  const geminiApiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = geminiApiKey && geminiApiKey !== 'YOUR_API_KEY_HERE';

  if (isKeyConfigured) {
    try {
      const result = await predictWaste(input);
      if (result && typeof result.predictedWasteQuantity === 'number') {
        return { success: true, data: result, source: 'live-ai' };
      }
    } catch (error: any) {
      console.warn("Live Gemini waste prediction failed or key expired, falling back to smart analytics engine:", error?.message || error);
    }
  }

  // Resilient fallback: calculate intelligent waste prediction
  const fallback = generateWastePredictionFallback(data.productName);
  return {
    success: true,
    data: fallback,
    source: 'smart-analytics',
  };
}
