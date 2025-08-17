'use server';
/**
 * @fileOverview An AI agent for finding university programs.
 *
 * - findPrograms - A function that suggests university programs based on student profile.
 * - FindProgramsInput - The input type for the findPrograms function.
 * - FindProgramsOutput - The return type for the findPrograms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const FindProgramsInputSchema = z.object({
  grades: z.string().describe('The student\'s grades or academic average.'),
  interests: z
    .string()
    .describe('The student\'s academic interests and favorite subjects.'),
  careerAspirations: z
    .string()
    .describe('The student\'s career goals and aspirations.'),
  extracurriculars: z
    .string()
    .describe('The student\'s extracurricular activities and hobbies.'),
});
export type FindProgramsInput = z.infer<typeof FindProgramsInputSchema>;

const ProgramSuggestionSchema = z.object({
  programName: z.string().describe('The name of the suggested program.'),
  universityName: z.string().describe('The name of the university.'),
});

export const FindProgramsOutputSchema = z.object({
  reach: z
    .array(ProgramSuggestionSchema)
    .describe('A list of "reach" program suggestions.'),
  target: z
    .array(ProgramSuggestionSchema)
    .describe('A list of "target" program suggestions.'),
  safety: z
    .array(ProgramSuggestionSchema)
    .describe('A list of "safety" program suggestions.'),
});
export type FindProgramsOutput = z.infer<typeof FindProgramsOutputSchema>;

export async function findPrograms(
  input: FindProgramsInput
): Promise<FindProgramsOutput> {
  return findProgramsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findProgramsPrompt',
  input: { schema: FindProgramsInputSchema },
  output: { schema: FindProgramsOutputSchema },
  prompt: `You are an expert university guidance counselor in Canada. Based on the student's profile below, suggest two Canadian university programs for each category: "reach", "target", and "safety".

Student Profile:
- Grades: {{{grades}}}
- Interests: {{{interests}}}
- Career Aspirations: {{{careerAspirations}}}
- Extracurriculars: {{{extracurriculars}}}

Provide a diverse set of recommendations from different universities across Canada.`,
});

const findProgramsFlow = ai.defineFlow(
  {
    name: 'findProgramsFlow',
    inputSchema: FindProgramsInputSchema,
    outputSchema: FindProgramsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
