'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Deadline {
  date: string;
  name: string;
  type: 'Program' | 'Scholarship' | 'Task';
}

const initialDeadlines: Deadline[] = [
  { date: '2025-01-15', name: 'UofT CompSci Application', type: 'Program' },
  {
    date: '2025-01-31',
    name: 'Schulich Leader Scholarship',
    type: 'Scholarship',
  },
  {
    date: '2025-02-01',
    name: 'Waterloo Engineering Application',
    type: 'Program',
  },
  { date: '2024-11-15', name: 'TD Scholarship', type: 'Scholarship' },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedDeadlines = localStorage.getItem('deadlines');
    if (savedDeadlines) {
      setDeadlines(JSON.parse(savedDeadlines));
    }
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('deadlines', JSON.stringify(deadlines));
    }
  }, [deadlines, isLoaded]);


  const deadlineDates = deadlines.map(d => new Date(d.date + 'T00:00:00'));

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">Deadline Calendar</h1>
        <p className="text-muted-foreground">
          Keep track of important dates and deadlines.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0 sm:p-2 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={{ deadlines: deadlineDates }}
              modifiersStyles={{
                deadlines: {
                  color: 'hsl(var(--accent-foreground))',
                  backgroundColor: 'hsl(var(--accent))',
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {deadlines
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map(deadline => (
                  <li
                    key={deadline.name}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">{deadline.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(deadline.date + 'T00:00:00').toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={
                        deadline.type === 'Program' ? 'default'
                        : deadline.type === 'Task' ? 'secondary'
                        : 'outline'
                      }
                    >
                      {deadline.type}
                    </Badge>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
