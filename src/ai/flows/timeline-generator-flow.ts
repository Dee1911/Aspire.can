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

export const GenerateTimelineInputSchema = z.object({
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
  date: z.string().describe('The month and year for the milestone (e.g., "September 2024").'),
  task: z.string().describe('The specific task or action item for that milestone.'),
});

export const GenerateTimelineOutputSchema = z.object({
  milestones: z
    .array(MilestoneSchema)
    .describe('A list of personalized milestones for the application journey.'),
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
  prompt: `You are an AI university application assistant. Create a personalized timeline of 5-7 key milestones for a student with the following profile. The timeline should start from September of their chosen grade.

Student Profile:
- Current Grade: {{{grade}}}
- Application Goals: {{{goals}}}
- Target Universities: {{{universities}}}

Generate a list of milestones with a date (Month Year) and a specific, actionable task.`,
});

const generateTimelineFlow = ai.defineFlow(
  {
    name: 'generateTimelineFlow',
    inputSchema: GenerateTimelineInputSchema,
    outputSchema: GenerateTimelineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
