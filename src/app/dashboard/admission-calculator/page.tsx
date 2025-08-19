
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  calculateAdmissionChance,
  CalculateAdmissionChanceOutput,
} from '@/ai/flows/admission-calculator-flow';
import { useState } from 'react';
import { Calculator, Loader2, Sparkles, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  grades: z.string().min(1, 'Please enter your grades or average.'),
  extracurriculars: z
    .string()
    .min(1, 'Please list your extracurriculars.'),
  awards: z.string().min(1, 'Please list your awards.'),
  essayQuality: z.string().min(1, 'Please select your essay quality.'),
  targetUniversity: z
    .string()
    .min(1, 'Please enter your target university.'),
  targetProgram: z.string().min(1, 'Please enter your target program.'),
});

const AnalysisSection = ({ title, content, icon, colorClass }: { title: string, content: string, icon: React.ReactNode, colorClass: string }) => (
  <div>
    <h3 className={`font-bold text-lg mb-2 flex items-center ${colorClass}`}>
      {icon}
      {title}
    </h3>
    <p className="text-muted-foreground text-sm">{content}</p>
  </div>
);

export default function AdmissionCalculatorPage() {
  const [result, setResult] = useState<CalculateAdmissionChanceOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grades: '',
      extracurriculars: '',
      awards: '',
      essayQuality: '',
      targetUniversity: '',
      targetProgram: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await calculateAdmissionChance(values);
      setResult(response);
    } catch (error) {
      console.error('Error calculating admission chance:', error);
      toast({
        title: 'Calculation Failed',
        description: 'Could not get a prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const analysisParts = result?.analysis.split('\n\n').reduce((acc, part) => {
    if (part.startsWith('Strengths:')) {
      acc.strengths = part.replace('Strengths:', '').trim();
    } else if (part.startsWith('Weaknesses:')) {
      acc.weaknesses = part.replace('Weaknesses:', '').trim();
    } else if (part.startsWith('Suggestions for Improvement:')) {
      acc.suggestions = part.replace('Suggestions for Improvement:', '').trim();
    } else if (!acc.intro) {
      acc.intro = part.trim();
    }
    return acc;
  }, { intro: '', strengths: '', weaknesses: '', suggestions: '' }) || { intro: '', strengths: '', weaknesses: '', suggestions: '' };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">
          AI Admission Calculator
        </h1>
        <p className="text-muted-foreground">
          Get a data-driven prediction of your admission chances.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Application Profile</CardTitle>
              <CardDescription>
                Provide the details for an accurate prediction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="targetUniversity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target University</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., University of Toronto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetProgram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Program</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grades"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grades / GPA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 95% average, 4.0 GPA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="extracurriculars"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extracurriculars</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., President of DECA, Varsity Soccer Captain, 100+ volunteer hours"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="awards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Awards and Honors</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., SHAD Fellow, National Science Fair 1st Place, School Honour Roll"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="essayQuality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Essay Quality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a self-assessment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Not Started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="Average">Average</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Exceptional">
                              Exceptional, professionally reviewed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Calculator className="mr-2 h-4 w-4" />
                    )}
                    Calculate My Chances
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle>AI Admission Verdict</CardTitle>
              <CardDescription>
                Your personalized admission probability and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground p-8 flex flex-col items-center justify-center min-h-[300px]">
                  <Sparkles className="mx-auto h-12 w-12" />
                  <p className="mt-4">
                    Your admission chance prediction will appear here.
                  </p>
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground">Estimated Chance</p>
                    <p className="text-6xl font-bold text-primary">
                      {result.admissionChancePercentage}%
                    </p>
                    <Progress
                      value={result.admissionChancePercentage}
                      className="mt-4 h-4"
                      aria-label={`${result.admissionChancePercentage}% admission chance`}
                    />
                  </div>
                   <Card className="bg-card/50">
                    <CardContent className="p-6 space-y-4">
                      {analysisParts.intro && <p className="text-muted-foreground">{analysisParts.intro}</p>}
                      {analysisParts.strengths && (
                        <AnalysisSection 
                          title="Strengths"
                          content={analysisParts.strengths}
                          icon={<ThumbsUp className="w-5 h-5 mr-2" />}
                          colorClass="text-green-500"
                        />
                      )}
                      {analysisParts.weaknesses && (
                        <AnalysisSection 
                          title="Weaknesses"
                          content={analysisParts.weaknesses}
                          icon={<ThumbsDown className="w-5 h-5 mr-2" />}
                          colorClass="text-red-500"
                        />
                      )}
                       {analysisParts.suggestions && (
                        <AnalysisSection 
                          title="Suggestions for Improvement"
                          content={analysisParts.suggestions}
                          icon={<TrendingUp className="w-5 h-5 mr-2" />}
                          colorClass="text-blue-500"
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
