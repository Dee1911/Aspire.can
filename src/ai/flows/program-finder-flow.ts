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

const FindProgramsInputSchema = z.object({
  grades: z.string().describe("The student's grades or academic average."),
  interests: z
    .string()
    .describe("The student's academic interests and favorite subjects."),
  careerAspirations: z
    .string()
    .describe("The student's career goals and aspirations."),
  extracurriculars: z
    .string()
    .describe("The student's extracurricular activities and hobbies."),
});
export type FindProgramsInput = z.infer<typeof FindProgramsInputSchema>;

const ProgramSuggestionSchema = z.object({
  programName: z.string().describe('The name of the suggested program.'),
  universityName: z.string().describe('The name of the university.'),
  justification: z
    .string()
    .describe(
      'A detailed explanation of why this program is a good fit for the student based on their profile.'
    ),
  admissionRequirements: z
    .string()
    .describe(
      'The estimated admission average and prerequisite courses required.'
    ),
  careerPaths: z
    .string()
    .describe('Potential career paths for graduates of this program.'),
});

const FindProgramsOutputSchema = z.object({
  reach: z
    .array(ProgramSuggestionSchema)
    .describe(
      'A list of ambitious "reach" program suggestions that may be challenging to get into.'
    ),
  target: z
    .array(ProgramSuggestionSchema)
    .describe(
      'A list of "target" program suggestions where the student has a strong chance of admission.'
    ),
  safety: z
    .array(ProgramSuggestionSchema)
    .describe(
      'A list of "safety" program suggestions where admission is very likely.'
    ),
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
  prompt: `You are an expert university guidance counselor in Canada, with deep knowledge of programs across all provinces. Your task is to provide highly personalized and detailed university program recommendations.

Analyze the student's profile below. Based on their grades, interests, career aspirations, and extracurriculars, suggest two Canadian university programs for each category: "reach", "target", and "safety".

For each suggestion, you MUST provide:
1.  **Justification:** A detailed paragraph explaining precisely WHY this program is an excellent match for the student. Connect their specific interests, skills (implied from ECs), and career goals to the program's curriculum and strengths.
2.  **Admission Requirements:** Provide the estimated competitive admission average (e.g., "High 80s to low 90s") and a list of key prerequisite high school courses.
3.  **Career Paths:** List 3-5 potential career paths that a graduate from this program could pursue.

Student Profile:
-   Grades: {{{grades}}}
-   Interests: {{{interests}}}
-   Career Aspirations: {{{careerAspirations}}}
-   Extracurriculars: {{{extracurriculars}}}

Provide a diverse set of recommendations from different universities across Canada. Make your justifications insightful and your advice actionable.`,
});

const findProgramsFlow = ai.defineFlow(
  {
    name: 'findProgramsFlow',
    inputSchema: FindProgramsInputSchema,
    outputSchema: FindProgramsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
