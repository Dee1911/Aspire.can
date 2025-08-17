// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Provides AI-powered feedback on essay drafts.
 *
 * - analyzeEssay - Analyzes an essay draft and provides feedback.
 * - AnalyzeEssayInput - The input type for the analyzeEssay function.
 * - AnalyzeEssayOutput - The return type for the analyzeEssay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEssayInputSchema = z.object({
  essayDraft: z.string().describe('The essay draft to be analyzed.'),
  storyBuilderContext: z
    .string()
    .optional()
    .describe(
      'Context from the Story Builder, including extracurriculars, achievements, grades, struggles, skills, and personal story.'
    ),
});
export type AnalyzeEssayInput = z.infer<typeof AnalyzeEssayInputSchema>;

const AnalyzeEssayOutputSchema = z.object({
  strengths: z.string().describe('The strengths of the essay.'),
  weaknesses: z.string().describe('The weaknesses of the essay.'),
  suggestions: z.string().describe('Suggestions for improving the essay.'),
});
export type AnalyzeEssayOutput = z.infer<typeof AnalyzeEssayOutputSchema>;

export async function analyzeEssay(input: AnalyzeEssayInput): Promise<AnalyzeEssayOutput> {
  return analyzeEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEssayPrompt',
  input: {schema: AnalyzeEssayInputSchema},
  output: {schema: AnalyzeEssayOutputSchema},
  prompt: `You are an AI essay feedback tool that analyzes essay drafts and provides feedback to students.

  Analyze the essay draft below, considering the context from the Story Builder, and provide feedback on its strengths, weaknesses, and suggestions for improvement.

  Story Builder Context:
  {{#if storyBuilderContext}}
  {{{storyBuilderContext}}}
  {{else}}
  None provided.
  {{/if}}

  Essay Draft:
  {{{essayDraft}}}

  Provide your analysis in the following format:
  Strengths: [List the strengths of the essay]
  Weaknesses: [List the weaknesses of the essay]
  Suggestions: [List suggestions for improving the essay]`,
});

const analyzeEssayFlow = ai.defineFlow(
  {
    name: 'analyzeEssayFlow',
    inputSchema: AnalyzeEssayInputSchema,
    outputSchema: AnalyzeEssayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
