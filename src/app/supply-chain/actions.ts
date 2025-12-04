"use server";
import { suggestShelfPlacement, type SuggestShelfPlacementInput, type SuggestShelfPlacementOutput } from "@/ai/flows/suggest-shelf-placement";

export async function handleShelfPlacementSuggestion(data: { productName: string, currentShelfPlacement: string }): Promise<{ success: boolean; data?: SuggestShelfPlacementOutput; error?: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || geminiApiKey === 'YOUR_API_KEY_HERE') {
    const errorMessage = "The Google AI API key is not configured. Please add your key to the GEMINI_API_KEY variable in the .env file. You can get a key from Google AI Studio.";
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }

  // In a real application, you would fetch this data from your database.
  // For this demo, we'll use mocked data for sales, spoilage, and transportation.
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

  try {
    const result = await suggestShelfPlacement(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error in shelf placement suggestion flow:", error);
    const errorMessage = error.message || "An unexpected error occurred during suggestion generation.";
    return { success: false, error: `Failed to get a suggestion from the AI model. Details: ${errorMessage}` };
  }
}
