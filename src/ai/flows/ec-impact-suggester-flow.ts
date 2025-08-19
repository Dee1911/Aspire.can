'use server';
/**
 * @fileOverview An AI agent for suggesting impactful descriptions for extracurricular activities.
 *
 * - suggestEcImpact - A function that generates impactful descriptions for an extracurricular activity.
 * - SuggestEcImpactInput - The input type for the suggestEcImpact function.
 * - SuggestEcImpactOutput - The return type for the suggestEcImpact function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestEcImpactInputSchema = z.object({
  activityName: z.string().describe('The name of the extracurricular activity.'),
  activityDescription: z
    .string()
    .describe('The user\'s description of their role, tasks, and what they did in the activity.'),
});
export type SuggestEcImpactInput = z.infer<typeof SuggestEcImpactInputSchema>;

const SuggestEcImpactOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of three distinct, impactful, and action-oriented bullet points describing the activity. Each bullet point should start with a strong action verb.'
    ),
});
export type SuggestEcImpactOutput = z.infer<typeof SuggestEcImpactOutputSchema>;

export async function suggestEcImpact(
  input: SuggestEcImpactInput
): Promise<SuggestEcImpactOutput> {
  return suggestEcImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEcImpactPrompt',
  input: { schema: SuggestEcImpactInputSchema },
  output: { schema: SuggestEcImpactOutputSchema },
  prompt: `You are an expert university admissions consultant who specializes in helping students craft compelling application narratives. A student needs help describing one of their extracurricular activities.

Your task is to take the student's description of their activity and transform it into three powerful, action-oriented, and quantifiable bullet points. These bullet points should be suitable for a university application's extracurriculars section.

Focus on:
- Starting each bullet point with a strong action verb (e.g., "Orchestrated," "Engineered," "Spearheaded," "Analyzed").
- Highlighting leadership, initiative, collaboration, and specific skills.
- Quantifying achievements whenever possible (e.g., "raised $1500," "led a team of 10," "increased membership by 25%").
- Using concise and impactful language.

Student's Activity: {{{activityName}}}
Student's Description: {{{activityDescription}}}

Generate exactly three distinct suggestions.`,
});

const suggestEcImpactFlow = ai.defineFlow(
  {
    name: 'suggestEcImpactFlow',
    inputSchema: SuggestEcImpactInputSchema,
    outputSchema: SuggestEcImpactOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
