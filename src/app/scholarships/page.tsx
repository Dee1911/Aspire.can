'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function ScholarshipsPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSave = () => {
        toast({
            title: 'Please log in',
            description: 'Log in to find personalized scholarships.',
        });
        router.push('/login');
    };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">Scholarship Tracker</h1>
        <p className="text-muted-foreground">
          Log in to discover and track scholarship opportunities.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>AI Scholarship Matchmaker</CardTitle>
            <CardDescription>Log in and use your Story Builder profile to find scholarships tailored just for you.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleSave}>Log In to Find Scholarships</Button>
        </CardContent>
      </Card>
    </div>
  );
}
