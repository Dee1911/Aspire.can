'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/improve-essay.ts';
import '@/ai/flows/essay-feedback.ts';
import '@/ai/flows/program-finder-flow.ts';
import '@/ai/flows/timeline-generator-flow.ts';
import '@/ai/flows/admission-calculator-flow.ts';
import '@/ai/flows/scholarship-finder-flow.ts';
import '@/ai/flows/ec-impact-suggester-flow.ts';
import '@/ai/flows/feature-recommender-flow.ts';
