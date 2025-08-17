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
  FindProgramsInput,
  FindProgramsOutput,
} from '@/ai/flows/program-finder-flow';
import { useState } from 'react';
import { Loader2, Rocket, Shield, Sparkles, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        <div className="lg:col-span-2">
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
                          Enter your current academic average or GPA.
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
                          What subjects or topics are you passionate about?
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
                          What kind of career are you hoping to pursue?
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
                          What do you do outside of class?
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

        <div>
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Based on your profile, we suggest:
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
                    Your program recommendations will appear here.
                  </p>
                </div>
              )}
              {recommendations && (
                <>
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <Rocket className="w-5 h-5 mr-2 text-primary" /> Reach
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {recommendations.reach.map(program => (
                        <li key={program.programName}>
                          {program.programName} at {program.universityName}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <Target className="w-5 h-5 mr-2 text-primary" /> Target
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {recommendations.target.map(program => (
                        <li key={program.programName}>
                          {program.programName} at {program.universityName}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <Shield className="w-5 h-5 mr-2 text-primary" /> Safety
                    </h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {recommendations.safety.map(program => (
                        <li key={program.programName}>
                          {program.programName} at {program.universityName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
