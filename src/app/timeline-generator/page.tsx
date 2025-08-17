'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  generateTimeline,
  GenerateTimelineOutput,
} from '@/ai/flows/timeline-generator-flow';
import { Loader2, PlusCircle, Sparkles } from 'lucide-react';

const formSchema = z.object({
  grade: z.string().min(1, 'Please select your grade.'),
  goals: z.string().min(1, 'Please enter your goals.'),
  universities: z.string().min(1, 'Please list your target universities.'),
});

export default function TimelineGeneratorPage() {
  const [timeline, setTimeline] = useState<GenerateTimelineOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: '',
      goals: '',
      universities: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTimeline(null);
    try {
      const result = await generateTimeline(values);
      setTimeline(result);
    } catch (error) {
      console.error('Error generating timeline:', error);
      toast({
        title: 'Timeline Generation Failed',
        description: 'Could not generate a timeline. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">
          AI Timeline Generator
        </h1>
        <p className="text-muted-foreground">
          Generate a personalized application timeline based on your goals.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Info</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Grade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goals</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Early admission, scholarships"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="universities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Universities</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., UofT, Waterloo, McGill"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Timeline
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Timeline</CardTitle>
              <CardDescription>
                Key dates and milestones for your application journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading && (
                  <div className="flex items-center justify-center h-full min-h-[300px]">
                    <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!isLoading && !timeline && (
                  <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <Sparkles className="mx-auto h-12 w-12" />
                    <p className="mt-4">
                      Your personalized timeline will appear here.
                    </p>
                  </div>
                )}
                {timeline &&
                  timeline.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted rounded-md"
                    >
                      <div>
                        <p className="font-semibold">{milestone.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {milestone.task}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add to Calendar
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
