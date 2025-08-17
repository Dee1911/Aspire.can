'use client'; // Calendar is a client component

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const deadlines = [
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

  const deadlineDates = deadlines.map(d => new Date(d.date + 'T00:00:00'));

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
                        deadline.type === 'Program' ? 'default' : 'secondary'
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
