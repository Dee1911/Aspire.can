'use server';
/**
 * @fileOverview An AI agent for finding relevant scholarships for students.
 *
 * - findScholarships - A function that suggests scholarships based on a student's profile.
 * - FindScholarshipsInput - The input type for the findScholarships function.
 * - FindScholarshipsOutput - The return type for the findScholarships function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { scholarships, Scholarship } from '@/lib/scholarships-data';

const FindScholarshipsInputSchema = z.object({
  userProfile: z.string().describe("A detailed profile of the student, including their grades, extracurriculars, achievements, personal story, and any struggles they've overcome."),
});
export type FindScholarshipsInput = z.infer<typeof FindScholarshipsInputSchema>;

const ScholarshipSuggestionSchema = z.object({
  name: z.string().describe('The name of the scholarship.'),
  amount: z.number().describe('The value of the scholarship award.'),
  eligibility: z.string().describe('The key eligibility criteria for the scholarship.'),
  deadline: z.string().describe('The application deadline for the scholarship.'),
  website: z.string().describe('The official website for the scholarship.'),
  justification: z
    .string()
    .describe(
      "A detailed, personalized explanation of why this scholarship is an excellent fit for the student, directly referencing their profile."
    ),
});

const FindScholarshipsOutputSchema = z.object({
  topMatches: z
    .array(ScholarshipSuggestionSchema)
    .describe(
      'A list of the top 5-7 scholarship suggestions that are the best fit for the student.'
    ),
});
export type FindScholarshipsOutput = z.infer<typeof FindScholarshipsOutputSchema>;

export async function findScholarships(
  input: FindScholarshipsInput
): Promise<FindScholarshipsOutput> {
  return findScholarshipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findScholarshipsPrompt',
  input: { schema: FindScholarshipsInputSchema },
  output: { schema: FindScholarshipsOutputSchema },
  prompt: `You are an expert Canadian university scholarship advisor. You have a comprehensive database of scholarships and a knack for matching students with the perfect funding opportunities.

Your task is to analyze the student's profile and identify the 5-7 best-fit scholarships from the provided list. For each scholarship you recommend, you MUST provide a detailed, personalized justification explaining exactly why the student is a strong candidate, linking specific parts of their profile to the scholarship's criteria.

Student Profile:
{{{userProfile}}}

Here is the list of available scholarships in Canada. You must only recommend scholarships from this list.
---
{{#each scholarships}}
Name: {{{name}}}
Amount: {{{amount}}}
Eligibility: {{{eligibility}}}
Deadline: {{{deadline}}}
Website: {{{website}}}
---
{{/each}}`,
});

const findScholarshipsFlow = ai.defineFlow(
  {
    name: 'findScholarshipsFlow',
    inputSchema: FindScholarshipsInputSchema,
    outputSchema: FindScholarshipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({
      ...input,
      // @ts-ignore
      scholarships,
    });
    return output!;
  }
);
