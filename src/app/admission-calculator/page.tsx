'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AdmissionCalculatorPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleLoginRedirect = () => {
        toast({
            title: 'Please log in',
            description: 'You need to be logged in to use the Admission Calculator.',
        });
        router.push('/login');
    };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">AI Admission Calculator</h1>
        <p className="text-muted-foreground">
          Get a data-driven prediction of your admission chances.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Log In to Access This Feature</CardTitle>
            <CardDescription>The AI Admission Calculator is available to all logged-in users. Please log in or create an account to get your personalized admission prediction.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleLoginRedirect}>
                <Calculator className="mr-2 h-4 w-4" />
                Log In to Use the Calculator
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
