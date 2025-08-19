
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  FileClock,
  Calculator,
} from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


export type ApplicationType = 'Reach' | 'Target' | 'Safety';
export type ApplicationProgress =
  | 'Not Started'
  | 'In Progress'
  | 'Applied'
  | 'Completed';

export interface Application {
  id: number;
  name: string;
  deadline: string;
  type: ApplicationType;
  progress: ApplicationProgress;
}

const initialApplications: Application[] = [
  {
    id: 1,
    name: 'University of Toronto - Commerce (Rotman)',
    deadline: '2025-01-15',
    type: 'Target',
    progress: 'Not Started',
  },
  {
    id: 2,
    name: 'University of Waterloo - Software Engineering',
    deadline: '2025-02-01',
    type: 'Reach',
    progress: 'In Progress',
  },
  {
    id: 3,
    name: "Queen's University - Commerce",
    deadline: '2025-02-15',
    type: 'Target',
    progress: 'Applied',
  },
  {
    id: 4,
    name: 'Western University - Business (Ivey AEO)',
    deadline: '2025-01-15',
    type: 'Target',
    progress: 'Completed',
  },
  {
    id: 5,
    name: 'York University - Business Administration',
    deadline: '2025-03-01',
    type: 'Safety',
    progress: 'Not Started',
  },
];

const shortcutCards = [
  {
    title: 'AI Program Finder',
    description: 'Discover your best-fit universities.',
    href: '/program-finder',
    icon: Target,
  },
  {
    title: 'AI Admission Calculator',
    description: 'Estimate your admission chances.',
    href: '/admission-calculator',
    icon: Calculator,
  },
  {
    title: 'AI Timeline Generator',
    description: 'Generate your application plan.',
    href: '/timeline-generator',
    icon: FileClock,
  },
  {
    title: 'Program Explorer',
    description: 'Browse university programs.',
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

const typeIcons: Record<ApplicationType, React.ElementType> = {
  Reach: Rocket,
  Target: Target,
  Safety: Shield,
};

const typeColors: Record<ApplicationType, string> = {
  Reach: 'text-red-500',
  Target: 'text-blue-500',
  Safety: 'text-green-500',
};

const addApplicationSchema = z.object({
  name: z.string().min(1, 'College name is required.'),
  deadline: z.string().min(1, 'Deadline is required.'),
  type: z.enum(['Reach', 'Target', 'Safety']),
});

function ApplicationRow({
  application,
  onUpdate,
}: {
  application: Application;
  onUpdate: (id: number, field: keyof Application, value: any) => void;
}) {
  const Icon = typeIcons[application.type];
  const color = typeColors[application.type];

  return (
    <TableRow>
      <TableCell className="font-medium">{application.name}</TableCell>
      <TableCell>
        <Input
          type="date"
          value={application.deadline}
          onChange={e =>
            onUpdate(application.id, 'deadline', e.target.value)
          }
          className="max-w-[150px]"
        />
      </TableCell>
      <TableCell>
        <Select
          value={application.type}
          onValueChange={(value: ApplicationType) =>
            onUpdate(application.id, 'type', value)
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <span className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                {application.type}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Safety">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Safety
              </span>
            </SelectItem>
            <SelectItem value="Target">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" /> Target
              </span>
            </SelectItem>
            <SelectItem value="Reach">
              <span className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-red-500" /> Reach
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={application.progress}
          onValueChange={(value: ApplicationProgress) =>
            onUpdate(application.id, 'progress', value)
          }
        >
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
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof addApplicationSchema>>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
      name: '',
      deadline: new Date().toISOString().split('T')[0],
      type: 'Target',
    },
  });

  const handleUpdate = (
    id: number,
    field: keyof Application,
    value: any
  ) => {
    setApplications(
      applications.map(app =>
        app.id === id ? { ...app, [field]: value } : app
      )
    );
  };

  const handleAddCollege = (values: z.infer<typeof addApplicationSchema>) => {
    const newApp: Application = {
      id: Date.now(),
      name: values.name,
      deadline: values.deadline,
      type: values.type,
      progress: 'Not Started',
    };
    setApplications([newApp, ...applications]);
    setAddDialogOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          My Application Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your university applications from a single command center.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcutCards.map(card => (
          <Card
            key={card.title}
            className="hover:border-primary/50 transition-colors bg-card"
          >
            <Link href={card.href} className="block h-full p-6">
              <div className="flex items-center justify-between">
                <card.icon className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mt-4">{card.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {card.description}
              </p>
            </Link>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <CardTitle>Your Application Tracker</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new application you want to track.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddCollege)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College/University Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., University of Example" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Type</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an application type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Safety">Safety</SelectItem>
                              <SelectItem value="Target">Target</SelectItem>
                              <SelectItem value="Reach">Reach</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Add Application</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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
                <ApplicationRow
                  key={app.id}
                  application={app}
                  onUpdate={handleUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
