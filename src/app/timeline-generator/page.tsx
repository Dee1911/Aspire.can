'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, PlusCircle } from 'lucide-react';

export default function TimelineGeneratorPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">
          AI Timeline Generator
        </h1>
        <p className="text-muted-foreground">
          Generate a personalized application timeline based on your goals.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="grade">Current Grade</Label>
                <Select>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goals">Goals</Label>
                <Input
                  id="goals"
                  placeholder="e.g., Early admission, specific scholarships"
                />
              </div>
              <div>
                <Label htmlFor="universities">Target Universities</Label>
                <Input id="universities" placeholder="e.g., UofT, Waterloo" />
              </div>
              <Button className="w-full">Generate Timeline</Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Personalized Timeline</CardTitle>
              <CardDescription>
                Key dates and milestones for your application journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-semibold">September 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Finalize university list
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-semibold">October 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Draft personal statements
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-semibold">November 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Submit early applications
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
