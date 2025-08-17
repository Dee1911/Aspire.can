'use server';
/**
 * @fileOverview An AI agent for calculating university admission chances.
 *
 * - calculateAdmissionChance - A function that estimates admission probability.
 * - CalculateAdmissionChanceInput - The input type for the calculateAdmissionChance function.
 * - CalculateAdmissionChanceOutput - The return type for the calculateAdmissionChance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateAdmissionChanceInputSchema = z.object({
  grades: z.string().describe("The student's grades, GPA, or academic average."),
  extracurriculars: z
    .string()
    .describe(
      "A detailed list of the student's extracurricular activities, including leadership roles and achievements."
    ),
  awards: z
    .string()
    .describe('A list of any awards or honors the student has received.'),
  essayQuality: z
    .string()
    .describe(
      'A self-assessment of the essay quality (e.g., "Average", "Good", "Exceptional, professionally reviewed").'
    ),
  targetUniversity: z
    .string()
    .describe('The name of the university the student is applying to.'),
  targetProgram: z
    .string()
    .describe('The specific program the student is applying to.'),
});
export type CalculateAdmissionChanceInput = z.infer<
  typeof CalculateAdmissionChanceInputSchema
>;

const CalculateAdmissionChanceOutputSchema = z.object({
  admissionChancePercentage: z
    .number()
    .describe(
      'The estimated percentage chance of admission, from 0 to 100.'
    ),
  analysis: z
    .string()
    .describe(
      "A detailed, qualitative analysis explaining the rationale behind the admission chance. This should include the applicant's strengths, weaknesses, and concrete suggestions for improvement."
    ),
});
export type CalculateAdmissionChanceOutput = z.infer<
  typeof CalculateAdmissionChanceOutputSchema
>;

export async function calculateAdmissionChance(
  input: CalculateAdmissionChanceInput
): Promise<CalculateAdmissionChanceOutput> {
  return calculateAdmissionChanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateAdmissionChancePrompt',
  input: { schema: CalculateAdmissionChanceInputSchema },
  output: { schema: CalculateAdmissionChanceOutputSchema },
  prompt: `You are a highly experienced admissions officer for top-tier Canadian universities. You have decades of experience reviewing thousands of applications and have a deep, nuanced understanding of what makes a successful applicant for competitive programs.

A student has come to you for a brutally honest, data-driven assessment of their chances. Analyze their profile in detail. You must provide a specific percentage for their chance of admission and a detailed qualitative analysis.

Student Profile:
- Target University: {{{targetUniversity}}}
- Target Program: {{{targetProgram}}}
- Grades/Average: {{{grades}}}
- Extracurricular Activities: {{{extracurriculars}}}
- Awards and Honors: {{{awards}}}
- Self-Assessed Essay Quality: {{{essayQuality}}}

Instructions:
1.  **Calculate Percentage:** Based on all the provided data, estimate a specific admission percentage. Be realistic. A 95% average doesn't guarantee admission to a program like Waterloo Engineering or UofT Rotman Commerce if the extracurriculars are weak. Consider the competitiveness of the specific program mentioned.
2.  **Provide Detailed Analysis:** Write a comprehensive analysis that breaks down your reasoning.
    -   **Strengths:** Clearly identify the strongest parts of the application.
    -   **Weaknesses:** Honestly point out the areas that weaken the application.
    -   **Suggestions for Improvement:** Provide concrete, actionable advice on how the student could improve their chances.

Your analysis is critical. It must justify the percentage you've given and provide real value to the student. Be direct, insightful, and act as a true expert.`,
});

const calculateAdmissionChanceFlow = ai.defineFlow(
  {
    name: 'calculateAdmissionChanceFlow',
    inputSchema: CalculateAdmissionChanceInputSchema,
    outputSchema: CalculateAdmissionChanceOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
