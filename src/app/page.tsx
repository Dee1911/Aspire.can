import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PlusCircle,
  GraduationCap,
  DollarSign,
  Lightbulb,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight,
  Target,
  Rocket,
  Shield,
} from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { badgeVariants } from '@/components/ui/badge';
import Link from 'next/link';

const applications = [
  {
    name: 'University of Toronto - Commerce (Rotman)',
    deadline: '2025-11-03',
    type: 'Target',
    progress: 'Not Started',
  },
  {
    name: 'McGill University - Commerce',
    deadline: '2025-11-03',
    type: 'Target',
    progress: 'Not Started',
  },
  {
    name: 'University of Waterloo - Accounting and Financial Management',
    deadline: '2025-11-03',
    type: 'Target',
    progress: 'In Progress',
  },
  {
    name: "Queen's University - Commerce",
    deadline: '2025-11-03',
    type: 'Safety',
    progress: 'Applied',
  },
  {
    name: 'Stanford University - Computer Science',
    deadline: '2025-10-15',
    type: 'Reach',
    progress: 'Completed',
  },
];

type Application = (typeof applications)[0];

const progressVariantMap: Record<
  string,
  VariantProps<typeof badgeVariants>['variant']
> = {
  'Not Started': 'destructive',
  'In Progress': 'secondary',
  Applied: 'default',
  Completed: 'outline',
};

const shortcutCards = [
  {
    title: 'Program Explorer',
    description: 'Find your best-fit universities.',
    href: '/programs',
    icon: GraduationCap,
  },
  {
    title: 'Scholarship Tracker',
    description: 'Discover funding opportunities.',
    href: '/scholarships',
    icon: DollarSign,
  },
  {
    title: 'Extracurriculars',
    description: 'Showcase your passions.',
    href: '/extracurriculars',
    icon: Lightbulb,
  },
  {
    title: 'Deadline Calendar',
    description: 'Never miss an important date.',
    href: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Story Builder',
    description: 'Craft your unique narrative.',
    href: '/story-builder',
    icon: BookOpen,
  },
  {
    title: 'AI Essay Tool',
    description: 'Enhance your writing.',
    href: '/essay-tool',
    icon: Sparkles,
  },
];

function ApplicationRow({ application }: { application: Application }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{application.name}</TableCell>
      <TableCell>
        <Input
          type="date"
          defaultValue={application.deadline}
          className="max-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Select defaultValue={application.type}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Safety">Safety</SelectItem>
            <SelectItem value="Target">Target</SelectItem>
            <SelectItem value="Reach">Reach</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select defaultValue={application.progress}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Progress" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          My Application Tracker
        </h1>
        <p className="text-muted-foreground">
          Manage your university applications from a single dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcutCards.map(card => (
          <Card
            key={card.title}
            className="hover:bg-card/90 transition-colors"
          >
            <Link href={card.href} className="block h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {card.title}
                </CardTitle>
                <card.icon className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <CardTitle>Your Applications</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a new college name..."
                className="w-full sm:w-auto"
              />
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add College
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">College Name</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map(app => (
                <ApplicationRow key={app.name} application={app} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
