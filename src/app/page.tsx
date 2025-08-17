import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { badgeVariants } from '@/components/ui/badge';

const dashboardItems = [
  {
    name: 'Computer Science - UofT',
    type: 'Program',
    deadline: '2025-01-15',
    status: 'In Progress',
  },
  {
    name: 'Schulich Leader Scholarship',
    type: 'Scholarship',
    deadline: '2025-01-31',
    status: 'Not Started',
  },
  {
    name: 'DECA Club President',
    type: 'Extracurricular',
    deadline: 'N/A',
    status: 'Completed',
  },
  {
    name: 'Waterloo Engineering',
    type: 'Program',
    deadline: '2025-02-01',
    status: 'Applied',
  },
  {
    name: 'TD Scholarship for Community Leadership',
    type: 'Scholarship',
    deadline: '2024-11-15',
    status: 'Not Started',
  },
];

type DashboardItem = (typeof dashboardItems)[0];

function DataTable({ items }: { items: DashboardItem[] }) {
  const statusVariantMap: Record<
    string,
    VariantProps<typeof badgeVariants>['variant']
  > = {
    'In Progress': 'default',
    Applied: 'default',
    'Not Started': 'secondary',
    Completed: 'outline',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="hidden md:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell">Deadline</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.name}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="hidden md:table-cell">{item.type}</TableCell>
            <TableCell className="hidden md:table-cell">
              {item.deadline}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[item.status]}>
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <p className="text-muted-foreground">
        A central hub for your programs, scholarships, and extracurriculars.
      </p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="extracurriculars">Extracurriculars</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Items</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable items={dashboardItems} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="programs">
          <Card>
            <CardHeader>
              <CardTitle>Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                items={dashboardItems.filter(i => i.type === 'Program')}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scholarships">
          <Card>
            <CardHeader>
              <CardTitle>Scholarships</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                items={dashboardItems.filter(i => i.type === 'Scholarship')}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="extracurriculars">
          <Card>
            <CardHeader>
              <CardTitle>Extracurriculars</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                items={dashboardItems.filter(
                  i => i.type === 'Extracurricular'
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
