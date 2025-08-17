'use server';
/**
 * @fileOverview An AI agent for generating application timelines.
 *
 * - generateTimeline - A function that creates a personalized application timeline.
 * - GenerateTimelineInput - The input type for the generateTimeline function.
 * - GenerateTimelineOutput - The return type for the generateTimeline function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTimelineInputSchema = z.object({
  grade: z.string().describe('The student\'s current grade level (e.g., "11" or "12").'),
  goals: z
    .string()
    .describe(
      'The student\'s application goals (e.g., "Early admission", "specific scholarships").'
    ),
  universities: z
    .string()
    .describe(
      'A list of target universities the student is interested in.'
    ),
});
export type GenerateTimelineInput = z.infer<typeof GenerateTimelineInputSchema>;

const MilestoneSchema = z.object({
  date: z
    .string()
    .describe('The month and year for the milestone (e.g., "September 2024").'),
  task: z
    .string()
    .describe(
      'A specific, detailed, and actionable task or action item for that milestone. It should be a concrete to-do item.'
    ),
});

const GenerateTimelineOutputSchema = z.object({
  milestones: z
    .array(MilestoneSchema)
    .describe(
      'A list of personalized milestones for the application journey, broken down month-by-month.'
    ),
});
export type GenerateTimelineOutput = z.infer<typeof GenerateTimelineOutputSchema>;

export async function generateTimeline(
  input: GenerateTimelineInput
): Promise<GenerateTimelineOutput> {
  return generateTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTimelinePrompt',
  input: { schema: GenerateTimelineInputSchema },
  output: { schema: GenerateTimelineOutputSchema },
  prompt: `You are an AI university application strategist. Your task is to create a highly detailed, personalized, and actionable month-by-month timeline for a student.

The timeline should start from September of their chosen grade and extend to the May of their graduation year. It needs to be comprehensive, covering all key aspects of the application process.

Student Profile:
-   Current Grade: {{{grade}}}
-   Application Goals: {{{goals}}}
-   Target Universities: {{{universities}}}

Generate a list of 8-12 key milestones. For each milestone:
1.  **Date:** Assign a specific Month and Year.
2.  **Task:** Create a clear, specific, and actionable task. Avoid vague suggestions. For example, instead of "Work on essays," use "Create outlines for supplementary essays for UofT and Waterloo." Instead of "Look for scholarships," use "Research and shortlist 5-10 scholarships with deadlines in the fall."

Be thorough and consider all aspects including:
-   Standardized testing (if applicable).
-   Asking for reference letters.
-   Researching programs and universities.
-   Drafting and refining personal statements and supplementary essays.
-   Submitting applications (including early and regular deadlines).
-   Applying for financial aid and scholarships.
-   Accepting offers.`,
});

const generateTimelineFlow = ai.defineFlow(
  {
    name: 'generateTimelineFlow',
    inputSchema: GenerateTimelineInputSchema,
    outputSchema: GenerateTimelineOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
