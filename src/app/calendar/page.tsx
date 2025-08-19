
'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';


export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">Deadline Calendar</h1>
        <p className="text-muted-foreground">
          This page is a public placeholder. Log in to see your personalized calendar.
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
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">Log in to track your deadlines here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

