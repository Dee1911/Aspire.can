
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, BrainCircuit, Calculator, Calendar, DollarSign, FileClock, GraduationCap, HelpCircle, LayoutDashboard, Lightbulb, Sparkles, Target } from 'lucide-react';

const features = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Your central hub for tracking university applications. Add universities, set deadlines, and categorize them as Reach, Target, or Safety to stay organized.'
  },
  {
    title: 'AI Program Finder',
    icon: Target,
    description: "Don't know where to start? Answer a few questions about your grades, interests, and goals. Our AI will recommend Reach, Target, and Safety university programs across Canada that are a good fit for you."
  },
  {
    title: 'AI Admission Calculator',
    icon: Calculator,
    description: "Get a realistic estimate of your admission chances for any Canadian university program. The AI provides a percentage and a detailed analysis of your application's strengths, weaknesses, and areas for improvement."
  },
  {
    title: 'AI Timeline Generator',
    icon: FileClock,
    description: 'Generate a personalized, month-by-month application timeline. Enter your grade and goals, and the AI will create a checklist of key tasks and deadlines to keep you on track.'
  },
  {
    title: 'Program Explorer',
    icon: GraduationCap,
    description: 'Browse our database of university programs across Canada. Filter by province and faculty to explore your options and discover new possibilities.'
  },
  {
    title: 'AI Scholarship Matchmaker',
    icon: DollarSign,
    description: 'Load your profile from the Story Builder, and our AI will search our database of Canadian scholarships to find funding opportunities tailored to your unique background, achievements, and experiences.'
  },
  {
    title: 'Extracurricular Explorer',
    icon: Lightbulb,
    description: 'Find impactful extracurricular activities to boost your application. You can filter by category and province and add them directly to your Story Builder.'
  },
  {
    title: 'Deadline Calendar',
    icon: Calendar,
    description: 'Never miss a deadline. This calendar automatically syncs with your application tracker and timeline generator to give you a clear view of all your important dates.'
  },
  {
    title: 'Story Builder',
    icon: BookOpen,
    description: 'This is where you craft your unique narrative. Add your extracurriculars, achievements, skills, and personal stories. The AI tools use this information to provide personalized results.'
  },
  {
    title: 'AI Essay Tool',
    icon: Sparkles,
    description: "Get feedback on your application essays. Paste your draft and the AI will provide strengths, weaknesses, and suggestions. You can also use your Story Builder narrative to generate improved, personalized essay content."
  },
   {
    title: 'Extracurricular Impact Suggester',
    icon: BrainCircuit,
    description: "Struggling to describe your activities? In the Story Builder, click 'Suggest Impact' for any extracurricular. The AI will help you phrase your accomplishments using action-oriented language that impresses admissions officers."
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-primary" />
          Your Guide to Aspire
        </h1>
        <p className="text-muted-foreground mt-1">
          Learn how to use each feature to navigate your university application journey.
        </p>
      </header>
      
      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {features.map((feature, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
                  <Card className="bg-card/50">
                    <AccordionTrigger className="p-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                            <feature.icon className="w-6 h-6 text-primary" />
                            <span className="font-semibold text-lg">{feature.title}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <p className="text-muted-foreground ml-9">{feature.description}</p>
                    </AccordionContent>
                  </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
