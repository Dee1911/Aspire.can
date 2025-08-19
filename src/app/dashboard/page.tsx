
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
  Loader2,
  ChevronDown,
  Trash2,
  ListTodo,
  StickyNote,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import {
  getApplications,
  addApplication,
  updateApplication,
  Application,
  ApplicationData,
  ApplicationTask,
  addTaskToApplication,
  updateApplicationTask,
  deleteApplicationTask,
} from '@/lib/user-data/applications';
import { addDeadline } from '@/lib/user-data/deadlines';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useDebouncedCallback } from 'use-debounce';

export type ApplicationType = 'Reach' | 'Target' | 'Safety';
export type ApplicationProgress =
  | 'Not Started'
  | 'In Progress'
  | 'Applied'
  | 'Completed';

const shortcutCards = [
  {
    title: 'AI Program Finder',
    description: 'Discover your best-fit universities.',
    href: '/dashboard/program-finder',
    icon: Target,
  },
  {
    title: 'AI Admission Calculator',
    description: 'Estimate your admission chances.',
    href: '/dashboard/admission-calculator',
    icon: Calculator,
  },
  {
    title: 'AI Timeline Generator',
    description: 'Generate your application plan.',
    href: '/dashboard/timeline-generator',
    icon: FileClock,
  },
  {
    title: 'Program Explorer',
    description: 'Browse university programs.',
    href: '/dashboard/programs',
    icon: GraduationCap,
  },
  {
    title: 'Scholarship Tracker',
    description: 'Discover funding opportunities.',
    href: '/dashboard/scholarships',
    icon: DollarSign,
  },
  {
    title: 'Extracurriculars',
    description: 'Showcase your passions.',
    href: '/dashboard/extracurriculars',
    icon: Lightbulb,
  },
  {
    title: 'Deadline Calendar',
    description: 'Never miss an important date.',
    href: '/dashboard/calendar',
    icon: Calendar,
  },
  {
    title: 'Story Builder',
    description: 'Craft your unique narrative.',
    href: '/dashboard/story-builder',
    icon: BookOpen,
  },
  {
    title: 'AI Essay Tool',
    description: 'Enhance your writing.',
    href: '/dashboard/essay-tool',
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
  onTaskUpdate,
  onTaskAdd,
  onTaskDelete,
}: {
  application: Application;
  onUpdate: (id: string, data: Partial<ApplicationData>) => void;
  onTaskUpdate: (appId: string, taskId: string, data: Partial<ApplicationTask>) => void;
  onTaskAdd: (appId: string, task: Omit<ApplicationTask, 'id'>) => void;
  onTaskDelete: (appId: string, taskId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = typeIcons[application.type];
  const color = typeColors[application.type];
  const { user } = useAuth();
  const { toast } = useToast();
  const [newTaskText, setNewTaskText] = useState('');

  const debouncedNotesUpdate = useDebouncedCallback((value) => {
    if (user) {
      onUpdate(application.id, { notes: value });
    }
  }, 1000);

  const handleAddTask = async () => {
    if (!user || !newTaskText.trim()) return;
    try {
      const newTask = { text: newTaskText, completed: false };
      const newTaskId = await addTaskToApplication(user.uid, application.id, newTask);
      onTaskAdd(application.id, { id: newTaskId, ...newTask }); // Update parent state
      setNewTaskText('');
    } catch (error) {
      console.error("Failed to add task:", error);
      toast({
        title: "Add Task Failed",
        description: "Could not add the new task. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    try {
      await deleteApplicationTask(user.uid, application.id, taskId);
      onTaskDelete(application.id, taskId); // Update parent state
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTaskCheckedChange = async (taskId: string, completed: boolean) => {
     if (!user) return;
     try {
       await updateApplicationTask(user.uid, application.id, taskId, { completed });
       onTaskUpdate(application.id, taskId, { completed });
     } catch (error) {
        console.error("Failed to update task:", error);
        toast({
            title: "Update Failed",
            description: "Could not update the task. Please try again.",
            variant: "destructive",
        });
     }
  }


  return (
    <Fragment>
      <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <TableCell className="font-medium">{application.name}</TableCell>
        <TableCell>
          <Input
            type="date"
            value={application.deadline}
            onClick={e => e.stopPropagation()}
            onChange={e =>
              onUpdate(application.id, { deadline: e.target.value })
            }
            className="max-w-[150px]"
          />
        </TableCell>
        <TableCell>
          <Select
            value={application.type}
            onValueChange={(value: ApplicationType) =>
              onUpdate(application.id, { type: value })
            }
          >
            <SelectTrigger onClick={e => e.stopPropagation()} className="w-[120px]">
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
              onUpdate(application.id, { progress: value })
            }
          >
            <SelectTrigger onClick={e => e.stopPropagation()} className="w-[150px]">
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
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" className="transition-transform" data-state={isOpen ? 'open' : 'closed'}>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow className="p-0">
        <TableCell colSpan={5} className="p-0 border-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              <div className="bg-muted/50 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><ListTodo className="w-5 h-5"/>To-Do List</h4>
                  <div className="space-y-2">
                    {application.tasks?.map(task => (
                      <div key={task.id} className="flex items-center gap-2 group">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={(checked) => handleTaskCheckedChange(task.id, !!checked)}
                        />
                        <label htmlFor={`task-${task.id}`} className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.text}
                        </label>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                       <Input 
                          placeholder="Add a new task..."
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                       />
                       <Button onClick={handleAddTask}>Add</Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><StickyNote className="w-5 h-5"/>Notes</h4>
                  <Textarea
                    placeholder="Add notes for this application..."
                    rows={8}
                    defaultValue={application.notes}
                    onChange={(e) => debouncedNotesUpdate(e.target.value)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}


export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addApplicationSchema>>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
      name: '',
      deadline: new Date().toISOString().split('T')[0],
      type: 'Target',
    },
  });

  useEffect(() => {
    if (user) {
      const fetchApps = async () => {
        setIsLoading(true);
        const userApps = await getApplications(user.uid);
        setApplications(userApps);
        setIsLoading(false);
      };
      fetchApps();
    }
  }, [user]);

  const handleUpdate = async (
    id: string,
    data: Partial<ApplicationData>
  ) => {
    if (!user) return;
    const optimisticApps = applications.map(app =>
      app.id === id ? { ...app, ...data } : app
    );
    setApplications(optimisticApps);

    try {
      await updateApplication(user.uid, id, data);
    } catch (error) {
      console.error("Failed to update application:", error);
      toast({
        title: "Update Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      });
      // Revert optimistic update
      const userApps = await getApplications(user.uid);
      setApplications(userApps);
    }
  };

  const handleTaskAdd = (appId: string, newTask: ApplicationTask) => {
    setApplications(prevApps => prevApps.map(app => {
      if (app.id !== appId) return app;
      const updatedTasks = [...(app.tasks || []), newTask];
      return { ...app, tasks: updatedTasks };
    }));
  };

  const handleTaskUpdate = (appId: string, taskId: string, data: Partial<ApplicationTask>) => {
    setApplications(prevApps => prevApps.map(app => {
      if (app.id !== appId) return app;
      const updatedTasks = app.tasks?.map(t => t.id === taskId ? { ...t, ...data } : t);
      return { ...app, tasks: updatedTasks };
    }));
  };

  const handleTaskDelete = (appId: string, taskId: string) => {
    setApplications(prevApps => prevApps.map(app => {
        if (app.id !== appId) return app;
        const updatedTasks = app.tasks?.filter(t => t.id !== taskId);
        return { ...app, tasks: updatedTasks };
    }));
  };


  const handleAddCollege = async (values: z.infer<typeof addApplicationSchema>) => {
    if (!user) return;

    const newAppData: ApplicationData = {
      name: values.name,
      deadline: values.deadline,
      type: values.type as ApplicationType,
      progress: 'Not Started',
    };

    try {
      const newAppId = await addApplication(user.uid, newAppData);
      
      // Fetch fresh list to include new app with its default tasks
      const userApps = await getApplications(user.uid);
      setApplications(userApps);

      // Add corresponding deadline to calendar
      await addDeadline(user.uid, {
        name: values.name,
        date: values.deadline,
        type: 'Program',
        sourceId: newAppId
      });

      setAddDialogOpen(false);
      form.reset();
      toast({
        title: "Application Added",
        description: `${values.name} has been added to your tracker.`,
      });
    } catch (error) {
      console.error("Failed to add application:", error);
      toast({
        title: "Add Failed",
        description: "Could not add the application. Please try again.",
        variant: "destructive",
      });
    }
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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">College Name</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map(app => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
                    onUpdate={handleUpdate}
                    onTaskAdd={handleTaskAdd}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
