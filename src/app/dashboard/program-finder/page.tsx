
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  findPrograms,
  FindProgramsOutput,
  ProgramSuggestion,
} from '@/ai/flows/program-finder-flow';
import { useState } from 'react';
import { Loader2, Rocket, Shield, Sparkles, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formSchema = z.object({
  grades: z.string().min(1, 'Please enter your grades or average.'),
  interests: z.string().min(1, 'Please list your interests.'),
  careerAspirations: z
    .string()
    .min(1, 'Please describe your career aspirations.'),
  extracurriculars: z
    .string()
    .min(1, 'Please list your extracurriculars.'),
});

function ProgramCard({
  program,
  index,
  type,
}: {
  program: ProgramSuggestion;
  index: number;
  type: 'reach' | 'target' | 'safety';
}) {
  return (
    <AccordionItem
      value={`${type}-${index}`}
      className="border-none"
    >
      <Card className="bg-card/50">
        <AccordionTrigger className="p-4 font-semibold hover:no-underline text-left">
          {program.programName} - {program.universityName}
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 space-y-3">
          <p className="text-muted-foreground">{program.justification}</p>
          <p>
            <strong className="text-foreground">Requirements:</strong>{' '}
            {program.admissionRequirements}
          </p>
          <p>
            <strong className="text-foreground">Career Paths:</strong>{' '}
            {program.careerPaths}
          </p>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}

export default function ProgramFinderPage() {
  const [recommendations, setRecommendations] =
    useState<FindProgramsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grades: '',
      interests: '',
      careerAspirations: '',
      extracurriculars: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await findPrograms(values);
      setRecommendations(result);
    } catch (error) {
      console.error('Error finding programs:', error);
      toast({
        title: 'Recommendation Failed',
        description: 'Could not get recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">AI Program Finder</h1>
        <p className="text-muted-foreground">
          Complete the quiz to get personalized program recommendations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Tell us about yourself to find the right fit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="grades"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grades / GPA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 90% average, 3.8 GPA"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your academic standing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests & Subjects</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Math, physics, coding, art"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your passions and favorite subjects.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="careerAspirations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Career Aspirations</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Software Engineer, Doctor, Entrepreneur"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your future career goals.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="extracurriculars"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extracurriculars & Hobbies</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., DECA, Soccer team, Volunteering"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your activities outside of class.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Get Recommendations
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Based on your profile, we suggest these programs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && !recommendations && (
                <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <Sparkles className="mx-auto h-12 w-12" />
                  <p className="mt-4">
                    Your detailed program recommendations will appear here.
                  </p>
                </div>
              )}
              {recommendations && (
                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center font-bold text-xl mb-3">
                      <Rocket className="w-6 h-6 mr-2 text-red-500" /> Reach
                    </h3>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full space-y-2"
                    >
                      {recommendations.reach.map((program, i) => (
                        <ProgramCard
                          program={program}
                          index={i}
                          key={`reach-${i}`}
                          type="reach"
                        />
                      ))}
                    </Accordion>
                  </div>
                  <div>
                    <h3 className="flex items-center font-bold text-xl mb-3">
                      <Target className="w-6 h-6 mr-2 text-blue-500" /> Target
                    </h3>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full space-y-2"
                    >
                      {recommendations.target.map((program, i) => (
                        <ProgramCard
                          program={program}
                          index={i}
                          key={`target-${i}`}
                          type="target"
                        />
                      ))}
                    </Accordion>
                  </div>
                  <div>
                    <h3 className="flex items-center font-bold text-xl mb-3">
                      <Shield className="w-6 h-6 mr-2 text-green-500" /> Safety
                    </h3>
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full space-y-2"
                    >
                      {recommendations.safety.map((program, i) => (
                        <ProgramCard
                          program={program}
                          index={i}
                          key={`safety-${i}`}
                          type="safety"
                        />
                      ))}
                    </Accordion>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
