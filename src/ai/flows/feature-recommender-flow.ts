'use server';
/**
 * @fileOverview An AI agent for recommending app features based on user needs.
 *
 * - recommendFeatures - A function that suggests features.
 * - RecommendFeaturesInput - The input type for the recommendFeatures function.
 * - RecommendFeaturesOutput - The return type for the recommendFeatures function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendFeaturesInputSchema = z.object({
  userNeed: z.string().describe('The user\'s stated problem, question, or need regarding the university application process.'),
});
export type RecommendFeaturesInput = z.infer<typeof RecommendFeaturesInputSchema>;

const RecommendedFeatureSchema = z.object({
  featureName: z.string().describe('The name of the recommended feature.'),
  justification: z.string().describe('A brief, one-sentence explanation of how this feature directly addresses the user\'s need.'),
});

const RecommendFeaturesOutputSchema = z.object({
  recommendedFeatures: z.array(RecommendedFeatureSchema).describe('A list of 2-3 of the most relevant features to help the user.'),
  overallJustification: z.string().describe('A one or two sentence summary of the recommendations, framed to be encouraging and helpful.'),
});
export type RecommendFeaturesOutput = z.infer<typeof RecommendFeaturesOutputSchema>;

export async function recommendFeatures(
  input: RecommendFeaturesInput
): Promise<RecommendFeaturesOutput> {
  return recommendFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendFeaturesPrompt',
  input: { schema: RecommendFeaturesInputSchema },
  output: { schema: RecommendFeaturesOutputSchema },
  prompt: `You are an expert guide for the Aspire university application app. Your goal is to help users by recommending the most relevant features to solve their problems.

A user has described their need: "{{{userNeed}}}"

Here is a list of the available features in the Aspire app and what they do:
- **AI Program Finder**: Recommends university programs based on a user's grades, interests, and goals.
- **AI Admission Calculator**: Estimates a user's chance of admission to a specific program and provides strengths/weaknesses.
- **AI Timeline Generator**: Creates a personalized month-by-month to-do list for the application process.
- **Program Explorer**: A database to browse all university programs.
- **AI Scholarship Matchmaker**: Finds scholarships based on the user's profile from the Story Builder.
- **Extracurricular Explorer**: A database to find and discover extracurricular activities.
- **Deadline Calendar**: Tracks all important application and scholarship deadlines.
- **Story Builder**: A workspace to write down and organize personal stories, extracurriculars, achievements, and skills.
- **AI Essay Tool**: Provides feedback on essay drafts and helps improve them using the Story Builder content.
- **Extracurricular Impact Suggester**: An AI tool within the Story Builder that helps users write powerful descriptions of their activities.

Based on the user's need, identify the 2 or 3 most helpful features. For each recommended feature, provide the feature name and a concise, one-sentence justification for why it's a good recommendation. Also provide a brief, encouraging overall justification for your set of recommendations.

Do not recommend more than 3 features. Focus on the most direct solutions to the user's problem.`,
});

const recommendFeaturesFlow = ai.defineFlow(
  {
    name: 'recommendFeaturesFlow',
    inputSchema: RecommendFeaturesInputSchema,
    outputSchema: RecommendFeaturesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
