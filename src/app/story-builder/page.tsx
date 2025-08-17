'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function StoryBuilderPage() {
  const { toast } = useToast();
  const [personalStory, setPersonalStory] = useState('');
  const [ecs, setEcs] = useState('');
  const [achievements, setAchievements] = useState('');
  const [grades, setGrades] = useState('');
  const [struggles, setStruggles] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved data from localStorage when the component mounts
    const savedData = localStorage.getItem('storyBuilderData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPersonalStory(data.personalStory || '');
      setEcs(data.ecs || '');
      setAchievements(data.achievements || '');
      setGrades(data.grades || '');
      setStruggles(data.struggles || '');
      setSkills(data.skills || '');
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    const narrativeData = {
      personalStory,
      ecs,
      achievements,
      grades,
      struggles,
      skills,
    };
    
    // Save all fields to a single JSON object in localStorage
    localStorage.setItem('storyBuilderData', JSON.stringify(narrativeData));

    // Create a combined string for the essay tool
    const combinedNarrative = [
      `Personal Story: ${personalStory}`,
      `Extracurriculars: ${ecs}`,
      `Achievements: ${achievements}`,
      `Grades: ${grades}`,
      `Struggles & Growth: ${struggles}`,
      `Skills: ${skills}`
    ].join('\n\n');

    localStorage.setItem('storyBuilderNarrative', combinedNarrative);

    toast({
      title: 'Narrative Saved',
      description: 'Your story has been successfully saved to your browser.',
    });
  };

  if (!isLoaded) {
      return null; // or a loading spinner
  }

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
            placeholder="Tell your story..."
            rows={10}
            value={personalStory}
            onChange={(e) => setPersonalStory(e.target.value)}
          />
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-1']}>
        <AccordionItem value="item-1" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 font-semibold hover:no-underline">
            Extracurriculars & Experiences
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <Label htmlFor="ecs">
              Describe your key extracurricular activities and what you learned
              from them.
            </Label>
            <Textarea
              id="ecs"
              className="mt-2"
              placeholder="e.g., President of DECA Club, organized a charity event..."
              rows={5}
              value={ecs}
              onChange={(e) => setEcs(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 font-semibold hover:no-underline">
            Achievements & Awards
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <Label htmlFor="achievements">
              List your significant achievements and awards.
            </Label>
            <Textarea
              id="achievements"
              className="mt-2"
              placeholder="e.g., Won 1st place at the National Science Fair..."
              rows={5}
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 font-semibold hover:no-underline">
            Grades & Academic Performance
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <Label htmlFor="grades">
              Briefly mention your academic standing, favorite subjects, or any
              specific academic projects.
            </Label>
            <Textarea
              id="grades"
              className="mt-2"
              placeholder="e.g., Maintained a 95% average, excelled in Advanced Functions..."
              rows={5}
              value={grades}
              onChange={(e) => setGrades(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 font-semibold hover:no-underline">
            Struggles & Growth
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <Label htmlFor="struggles">
              Reflect on any challenges you've overcome and how they contributed
              to your growth.
            </Label>
            <Textarea
              id="struggles"
              className="mt-2"
              placeholder="e.g., Overcame public speaking anxiety through debate club..."
              rows={5}
              value={struggles}
              onChange={(e) => setStruggles(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5" className="border rounded-lg bg-card">
          <AccordionTrigger className="p-4 font-semibold hover:no-underline">
            Skills
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <Label htmlFor="skills">
              List your key skills, both technical and soft skills.
            </Label>
            <Textarea
              id="skills"
              className="mt-2"
              placeholder="e.g., Proficient in Python, strong leadership and communication skills..."
              rows={5}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
