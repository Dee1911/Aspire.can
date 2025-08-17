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

export default function StoryBuilderPage() {
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
        <Button className="shrink-0">
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
          <Textarea placeholder="Tell your story..." rows={10} />
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4">
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
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
