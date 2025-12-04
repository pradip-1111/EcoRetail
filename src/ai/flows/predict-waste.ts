'use server';
/**
 * @fileOverview AI-powered waste prediction flow for retail managers.
 *
 * - predictWaste - Predicts potential overstock or spoilage of products.
 * - PredictWasteInput - The input type for the predictWaste function.
 * - PredictWasteOutput - The return type for the predictWaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictWasteInputSchema = z.object({
  productName: z.string().describe('The name of the product to predict waste for.'),
  historicalSalesData: z.string().describe('Historical sales data for the product, as a JSON string.'),
  weatherForecast: z.string().describe('Weather forecast data for the upcoming period, as a JSON string.'),
  seasonality: z.string().describe('Seasonality information relevant to the product, as a JSON string.'),
});
export type PredictWasteInput = z.infer<typeof PredictWasteInputSchema>;

const PredictWasteOutputSchema = z.object({
  predictedWasteQuantity: z.number().describe('The predicted quantity of waste for the product (e.g., 25).'),
  wasteReductionSuggestions: z.string().describe('Suggestions for reducing waste for the product. This should be a concise list of suggestions, with each suggestion on a new line.'),
});
export type PredictWasteOutput = z.infer<typeof PredictWasteOutputSchema>;

export async function predictWaste(input: PredictWasteInput): Promise<PredictWasteOutput> {
  return predictWasteFlow(input);
}

const predictWastePrompt = ai.definePrompt(
  {
    name: 'predictWastePrompt',
    input: { schema: PredictWasteInputSchema },
    output: { schema: PredictWasteOutputSchema },
    prompt: `Analyze the provided retail data to predict product waste and suggest reductions.

Product Name: {{{productName}}}
Historical Sales Data: {{{historicalSalesData}}}
Weather Forecast: {{{weatherForecast}}}
Seasonality: {{{seasonality}}}`,
  },
);

const predictWasteFlow = ai.defineFlow(
  {
    name: 'predictWasteFlow',
    inputSchema: PredictWasteInputSchema,
    outputSchema: PredictWasteOutputSchema,
  },
  async (input) => {
    const { output } = await predictWastePrompt(input);
    return output!;
  }
);
