'use client';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Save } from 'lucide-react';
import { useState } from 'react';

const scholarships = [
  {
    name: 'Schulich Leader Scholarships',
    amount: 100000,
    eligibility: 'STEM',
  },
  {
    name: 'TD Scholarship for Community Leadership',
    amount: 70000,
    eligibility: 'Community Service',
  },
  { name: 'Loran Award', amount: 100000, eligibility: 'Leadership' },
  {
    name: 'CIBC Future Heroes Bursary',
    amount: 2500,
    eligibility: 'All',
  },
];

export default function ScholarshipsPage() {
  const [sliderValue, setSliderValue] = useState(10000);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">Scholarship Tracker</h1>
        <p className="text-muted-foreground">
          Discover and track scholarship opportunities.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <Input placeholder="Search by scholarship name..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stem">STEM</SelectItem>
                <SelectItem value="community">Community Service</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2">
              <Label htmlFor="amount-slider">
                Min. Award: ${sliderValue.toLocaleString()}
              </Label>
              <Slider
                id="amount-slider"
                defaultValue={[10000]}
                max={100000}
                step={1000}
                onValueChange={value => setSliderValue(value[0])}
              />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.map(scholarship => (
          <Card key={scholarship.name}>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                {scholarship.name}
              </CardTitle>
              <CardDescription className="text-primary font-bold text-lg">
                ${scholarship.amount.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Eligibility:{' '}
                <span className="font-semibold">{scholarship.eligibility}</span>
              </p>
            </CardContent>
            <CardFooter>
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
