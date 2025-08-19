
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveUserProfile } from '@/lib/user-data/profile';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

const formSchema = z.object({
  grade: z.string().min(1, 'Please select your current grade.'),
  average: z.string().min(1, 'Please enter your current average.'),
  courses: z.string().min(1, 'Please list some of your courses.'),
  dreamPrograms: z.string().min(1, 'Please list your dream programs.'),
});

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: '',
      average: '',
      courses: '',
      dreamPrograms: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to complete onboarding.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await saveUserProfile(user.uid, {
        ...values,
        onboardingComplete: true,
      });
      toast({
        title: 'Profile Saved',
        description: 'Welcome to Aspire! Redirecting you to the dashboard.',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save your profile. Please try again.',
        variant: 'destructive',
      });
    }
  }
  
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to Aspire!</CardTitle>
          <CardDescription>
            Let&apos;s get some basic information to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What grade are you in?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
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
                name="average"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your current academic average?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 92% or 3.8 GPA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are some courses you are taking?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Advanced Functions, Chemistry, English, Computer Science"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dreamPrograms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What are some of your dream programs or universities?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Waterloo Engineering, UofT Rotman Commerce, McGill Arts"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Continue to Dashboard'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
