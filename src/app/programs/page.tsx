import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';
import Image from 'next/image';

const programs = [
  {
    name: 'Computer Science',
    university: 'University of Toronto',
    province: 'Ontario',
    field: 'STEM',
    image: 'https://placehold.co/600x400.png',
    hint: 'university campus',
  },
  {
    name: 'Commerce',
    university: "Queen's University",
    province: 'Ontario',
    field: 'Business',
    image: 'https://placehold.co/600x400.png',
    hint: 'modern building',
  },
  {
    name: 'Fine Arts',
    university: 'Emily Carr University',
    province: 'British Columbia',
    field: 'Arts',
    image: 'https://placehold.co/600x400.png',
    hint: 'art studio',
  },
  {
    name: 'Engineering',
    university: 'University of Waterloo',
    province: 'Ontario',
    field: 'STEM',
    image: 'https://placehold.co/600x400.png',
    hint: 'engineering building',
  },
  {
    name: 'Kinesiology',
    university: 'University of British Columbia',
    province: 'British Columbia',
    field: 'Health Sciences',
    image: 'https://placehold.co/600x400.png',
    hint: 'sports facility',
  },
  {
    name: 'Political Science',
    university: 'McGill University',
    province: 'Quebec',
    field: 'Humanities',
    image: 'https://placehold.co/600x400.png',
    hint: 'historic architecture',
  },
];

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">Program Explorer</h1>
        <p className="text-muted-foreground">
          Find and save university programs that match your interests.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input placeholder="Search by program or university..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ontario">Ontario</SelectItem>
                <SelectItem value="bc">British Columbia</SelectItem>
                <SelectItem value="quebec">Quebec</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Field of Study" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stem">STEM</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="health">Health Sciences</SelectItem>
                <SelectItem value="humanities">Humanities</SelectItem>
              </SelectContent>
            </Select>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map(program => (
          <Card key={program.name + program.university}>
            <CardHeader className="p-0">
              <Image
                src={program.image}
                alt={program.name}
                width={600}
                height={400}
                className="rounded-t-lg object-cover aspect-[3/2]"
                data-ai-hint={program.hint}
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="font-headline text-xl">
                {program.name}
              </CardTitle>
              <CardDescription>{program.university}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save to Dashboard
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
