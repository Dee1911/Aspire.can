
'use client';

import {
  Accordion,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function StoryBuilderPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSave = () => {
    toast({
      title: 'Please log in',
      description: 'You need to be logged in to save your narrative.',
    });
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Story Builder</h1>
          <p className="text-muted-foreground max-w-2xl mt-1">
            Compose your personal narrative. This content will be used by the AI
            Essay Tool to help you write compelling essays.
          </p>
        </div>
        <Button className="shrink-0" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Narrative
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>My Personal Story</CardTitle>
          <CardDescription>
            This is the core of your narrative. What makes you unique? What are
            your passions and motivations?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Log in to start telling your story..."
            rows={10}
            disabled
          />
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4 opacity-50 cursor-not-allowed" defaultValue={['item-1']}>
         <Card className="p-4">
            <p className="text-center text-muted-foreground">Log in to access all Story Builder sections.</p>
         </Card>
      </Accordion>
    </div>
  );
}

