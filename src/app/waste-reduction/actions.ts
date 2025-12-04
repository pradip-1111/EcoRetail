// src/app/waste-reduction/actions.ts
"use server";
import { predictWaste, type PredictWasteInput, type PredictWasteOutput } from "@/ai/flows/predict-waste";

export async function handleWastePrediction(data: { productName: string }): Promise<{ success: boolean; data?: PredictWasteOutput; error?: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || geminiApiKey === 'YOUR_API_KEY_HERE') {
    const errorMessage = "The Google AI API key is not configured. Please add your key to the GEMINI_API_KEY variable in the .env file. You can get a key from Google AI Studio.";
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  // In a real application, you would fetch this data from your database.
  // For this demo, we'll use mocked data.
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

  try {
    const result = await predictWaste(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in waste prediction flow:", error);
    const errorMessage = error.message || "An unexpected error occurred during prediction.";
    return { success: false, error: `Failed to get a prediction from the AI model. Details: ${errorMessage}` };
  }
}
