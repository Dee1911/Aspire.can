import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';

const activities = [
  {
    name: 'DECA Club',
    category: 'Business',
    description: 'Participate in business case competitions.',
    image: 'https://placehold.co/600x400.png',
    hint: 'business competition',
  },
  {
    name: 'Varsity Soccer',
    category: 'Athletics',
    description: "Join the school's competitive soccer team.",
    image: 'https://placehold.co/600x400.png',
    hint: 'soccer game',
  },
  {
    name: 'Model UN',
    category: 'Academics',
    description: 'Debate global issues and practice diplomacy.',
    image: 'https://placehold.co/600x400.png',
    hint: 'public speaking',
  },
  {
    name: 'School Band',
    category: 'Arts',
    description: 'Play an instrument in concerts and events.',
    image: 'https://placehold.co/600x400.png',
    hint: 'concert band',
  },
];

export default function ExtracurricularsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">
          Extracurricular Explorer
        </h1>
        <p className="text-muted-foreground">
          Find activities to build your profile and story.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <Card key={activity.name}>
            <CardHeader className="p-0">
              <Image
                src={activity.image}
                alt={activity.name}
                width={600}
                height={400}
                className="rounded-t-lg object-cover aspect-[3/2]"
                data-ai-hint={activity.hint}
              />
            </CardHeader>
            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">
                {activity.category}
              </Badge>
              <CardTitle className="font-headline text-xl">
                {activity.name}
              </CardTitle>
              <CardDescription>{activity.description}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Add to Story Builder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
