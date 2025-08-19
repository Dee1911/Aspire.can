
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
  Target,
  Rocket,
  Shield,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FilePenLine,
  CalendarClock,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import {
  getApplication,
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  Application,
  ApplicationData,
} from '@/lib/user-data/applications';
import { addDeadline, deleteDeadline } from '@/lib/user-data/deadlines';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedCallback } from 'use-debounce';

export type ApplicationType = 'Reach' | 'Target' | 'Safety';
export type ItemCategory = 'Application' | 'Standardized Test' | 'Personal';

const typeIcons: Record<ApplicationType, React.ElementType> = {
  Reach: Rocket,
  Target: Target,
  Safety: Shield,
};

const categoryIcons: Record<ItemCategory, React.ElementType> = {
    Application: GraduationCap,
    'Standardized Test': FilePenLine,
    Personal: ClipboardCheck,
}

const addItemSchema = z.object({
  name: z.string().min(1, 'Item name is required.'),
  deadline: z.string().min(1, 'Deadline is required.'),
  type: z.enum(['Reach', 'Target', 'Safety']).optional(),
  category: z.enum(['Application', 'Standardized Test', 'Personal']),
});

function ApplicationRow({ application }: { application: Application }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState(application.tasks || []);
  const [notes, setNotes] = useState(application.notes || '');
  const { user } = useAuth();
  const { toast } = useToast();

  const debouncedUpdateNotes = useDebouncedCallback(async (newNotes: string) => {
    if (!user) return;
    try {
      await updateApplication(user.uid, application.id, { notes: newNotes });
      toast({ title: 'Notes saved!', duration: 2000 });
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast({ title: 'Failed to save notes', variant: 'destructive' });
    }
  }, 1000);

  const handleTaskChange = async (taskId: string, completed: boolean) => {
    if (!user) return;
    const optimisticTasks = tasks.map(t => t.id === taskId ? { ...t, completed } : t);
    setTasks(optimisticTasks);

    try {
      await updateApplication(user.uid, application.id, { tasks: optimisticTasks });
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(tasks); // Revert
      toast({ title: "Failed to update task", variant: "destructive" });
    }
  };

  const handleAddTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const taskName = e.currentTarget.value;
      if (!taskName.trim() || !user) return;

      const newTask = { id: `task-${Date.now()}`, name: taskName, completed: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      e.currentTarget.value = '';

      try {
        await updateApplication(user.uid, application.id, { tasks: updatedTasks });
      } catch (error) {
        console.error("Failed to add task:", error);
        setTasks(tasks); // Revert
        toast({ title: "Failed to add task", variant: "destructive" });
      }
    }
  };

  const CategoryIcon = categoryIcons[application.category as ItemCategory] || ClipboardCheck;
  const TypeIcon = application.type ? typeIcons[application.type] : null;

  return (
    <>
      <TableRow onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
        <TableCell className="w-8">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </TableCell>
        <TableCell className="font-medium flex items-center gap-3">
          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
          {application.name}
        </TableCell>
        <TableCell>
          {application.deadline}
        </TableCell>
        <TableCell>
            {TypeIcon && <TypeIcon className="h-5 w-5" />}
        </TableCell>
      </TableRow>
      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TableCell colSpan={4} className="p-0">
                <div className="p-4 bg-muted/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2">Checklist</h4>
                        <div className="space-y-2">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-2">
                                    <Checkbox 
                                        id={task.id} 
                                        checked={task.completed}
                                        onCheckedChange={(checked) => handleTaskChange(task.id, !!checked)}
                                    />
                                    <label htmlFor={task.id} className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.name}</label>
                                </div>
                            ))}
                            <Input placeholder="Add a new task and press Enter..." onKeyDown={handleAddTask} className="mt-2" />
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Notes</h4>
                        <Textarea 
                            placeholder="Jot down your thoughts, research, or links here..." 
                            rows={8}
                            value={notes}
                            onChange={(e) => {
                                setNotes(e.target.value);
                                debouncedUpdateNotes(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </TableCell>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addItemSchema>>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: '',
      deadline: new Date().toISOString().split('T')[0],
      category: 'Application',
    },
  });

  const category = form.watch('category');

  useEffect(() => {
    if (user) {
      const fetchApps = async () => {
        setIsLoading(true);
        const userApps = await getApplications(user.uid);
        const appsWithDetails = await Promise.all(userApps.map(app => getApplication(user.uid, app.id)));
        setApplications(appsWithDetails.filter((app): app is Application => app !== null));
        setIsLoading(false);
      };
      fetchApps();
    }
  }, [user]);

  const handleAddApplication = async (values: z.infer<typeof addItemSchema>) => {
    if (!user) return;

    const newAppData: ApplicationData = {
      name: values.name,
      deadline: values.deadline,
      category: values.category as ItemCategory,
      type: values.category === 'Application' ? (values.type as ApplicationType) : undefined,
      tasks: [],
      notes: ''
    };

    try {
      const newAppId = await addApplication(user.uid, newAppData);
      const newApp = await getApplication(user.uid, newAppId);
      if (newApp) {
          setApplications(prev => [...prev, newApp].sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
      }
      
      await addDeadline(user.uid, {
        name: `${values.name}`,
        date: values.deadline,
        type: 'Task',
        sourceId: newAppId
      });

      setAddDialogOpen(false);
      form.reset({
        name: '',
        deadline: new Date().toISOString().split('T')[0],
        category: 'Application',
      });
      toast({
        title: "Item Added",
        description: `${values.name} has been added to your tracker.`,
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast({
        title: "Add Failed",
        description: "Could not add the item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingDeadlines = applications
    .filter(app => new Date(app.deadline) >= new Date())
    .slice(0, 3);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          My Journey Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your command center for university applications, tests, and tasks.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>
            Your next three most important deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : upcomingDeadlines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingDeadlines.map(app => (
                <Card key={app.id} className="bg-card/50 p-4">
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(app.deadline + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines found. Add some items to your tracker!</p>
          )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <CardTitle>Journey Tracker</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to Your Journey</DialogTitle>
                  <DialogDescription>
                    Track a new university application, test, or personal task.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddApplication)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Application">Application</SelectItem>
                              <SelectItem value="Standardized Test">Standardized Test</SelectItem>
                              <SelectItem value="Personal">Personal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder={
                                category === 'Application' ? 'e.g., University of Toronto' :
                                category === 'Standardized Test' ? 'e.g., SAT Exam' :
                                'e.g., Request Reference Letter'
                            } {...field} />
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
                          <FormLabel>Deadline</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     {category === 'Application' && <FormField
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
                    />}
                    <DialogFooter>
                      <Button type="submit">Add Item</Button>
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
          ) : applications.length === 0 ? (
              <Card className="bg-primary/5 text-center p-8 border-dashed">
                  <CardTitle className="font-headline text-2xl">Welcome to Your Journey Tracker!</CardTitle>
                  <CardDescription className="max-w-md mx-auto mt-2">
                      This is your new command center. Click "Add Item" to start tracking your university applications, tests, and personal to-do's.
                  </CardDescription>
                  <div className="mt-6">
                      <Button onClick={() => setAddDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Item
                      </Button>
                  </div>
              </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map(app => (
                  <ApplicationRow
                    key={app.id}
                    application={app}
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
