'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal shelf placement and transportation adjustments to reduce product loss.
 *
 * - suggestShelfPlacement - A function that suggests shelf placement.
 * - SuggestShelfPlacementInput - The input type for the suggestShelfPlacement function.
 * - SuggestShelfPlacementOutput - The return type for the suggestShelfPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShelfPlacementInputSchema = z.object({
  productName: z.string().describe('The name of the product to analyze.'),
  salesData: z.string().describe('Sales data for the product, including dates and quantities sold.'),
  spoilageData: z.string().describe('Spoilage data for the product, including dates and quantities spoiled.'),
  currentShelfPlacement: z.string().describe('The current shelf placement of the product.'),
  transportationData: z.string().describe('Transportation data for the product, including transportation modes and routes.'),
});

export type SuggestShelfPlacementInput = z.infer<typeof SuggestShelfPlacementInputSchema>;

const SuggestShelfPlacementOutputSchema = z.object({
  shelfPlacementSuggestion: z.string().describe('A suggestion for optimal shelf placement to reduce spoilage and increase sales. Each suggestion should be on a new line.'),
  transportationAdjustmentSuggestion: z
    .string()
    .describe('A suggestion for transportation adjustments to reduce spoilage and increase sales. Each suggestion should be on a new line.'),
  reasoning: z.string().describe('The reasoning behind the shelf placement and transportation adjustment suggestions.'),
});

export type SuggestShelfPlacementOutput = z.infer<typeof SuggestShelfPlacementOutputSchema>;

export async function suggestShelfPlacement(input: SuggestShelfPlacementInput): Promise<SuggestShelfPlacementOutput> {
  return suggestShelfPlacementFlow(input);
}

const suggestShelfPlacementPrompt = ai.definePrompt(
  {
    name: 'suggestShelfPlacementPrompt',
    input: { schema: SuggestShelfPlacementInputSchema },
    output: { schema: SuggestShelfPlacementOutputSchema },
    prompt: `As a retail operations expert, analyze the provided data for {{{productName}}} to suggest optimal shelf placement and transportation adjustments to reduce product loss.

Sales Data: {{{salesData}}}
Spoilage Data: {{{spoilageData}}}
Current Shelf Placement: {{{currentShelfPlacement}}}
Transportation Data: {{{transportationData}}}`,
  },
);

const suggestShelfPlacementFlow = ai.defineFlow(
  {
    name: 'suggestShelfPlacementFlow',
    inputSchema: SuggestShelfPlacementInputSchema,
    outputSchema: SuggestShelfPlacementOutputSchema,
  },
  async input => {
    const { output } = await suggestShelfPlacementPrompt(input);
    return output!;
  }
);
