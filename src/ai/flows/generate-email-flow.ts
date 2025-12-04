'use server';
/**
 * @fileOverview Generates email marketing content for a product using AI.
 *
 * - generateEmail - A function that generates a marketing email.
 * - GenerateEmailInput - The input type for the generateEmail function.
 * - GenerateEmailOutput - The return type for the generateEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateEmailInputSchema = z.object({
  productName: z.string().describe('The name of the product to promote.'),
  productFeatures: z.string().describe('A comma-separated list of key features of the product.'),
});
export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

const GenerateEmailOutputSchema = z.object({
  subject: z.string().describe('A compelling subject line for the email.'),
  body: z.string().describe('The HTML body of the email. It should be visually appealing but simple, using h2, p, and ul tags. It should include a call to action.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;

export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
  return generateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: {schema: GenerateEmailInputSchema},
  output: {schema: GenerateEmailOutputSchema},
  prompt: `You are a marketing expert for an eco-friendly retail company. Generate a promotional email for the following product.

Product Name: {{{productName}}}
Features: {{{productFeatures}}}

The email should be engaging, highlight the eco-friendly aspects, and persuade customers to make a purchase.
The body of the email must be in simple HTML format (using h2, p, ul, li, a tags).
Create a compelling subject line and a clear call-to-action in the body.`,
});

const generateEmailFlow = ai.defineFlow(
  {
    name: 'generateEmailFlow',
    inputSchema: GenerateEmailInputSchema,
    outputSchema: GenerateEmailOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
