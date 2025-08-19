
'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, Search } from 'lucide-react';
import Image from 'next/image';
import {
  activities,
} from '@/lib/extracurriculars-data';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const provinces = [
  ...new Set(activities.map(activity => activity.province)),
].sort();
const categories = [
  ...new Set(activities.map(activity => activity.category)),
].sort();

export default function ExtracurricularsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();
  const router = useRouter();


  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const searchTermMatch =
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const provinceMatch =
        provinceFilter === 'all'
          ? true
          : activity.province === provinceFilter;
      const categoryMatch =
        categoryFilter === 'all'
          ? true
          : activity.category === categoryFilter;
      return searchTermMatch && provinceMatch && categoryMatch;
    });
  }, [searchTerm, provinceFilter, categoryFilter]);
  
  const handleAddToStoryBuilder = () => {
    toast({
      title: 'Please log in',
      description: 'Log in to add activities to your Story Builder.',
    });
    router.push('/login');
  };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">
          Extracurricular Explorer
        </h1>
        <p className="text-muted-foreground">
          Find activities to build your profile and story.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="lg:col-span-2"
            />
            <Select onValueChange={setProvinceFilter} value={provinceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces.map(p => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCategoryFilter} value={categoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map(activity => (
          <Card key={activity.name}>
            <CardHeader className="p-0">
              <Image
                src={activity.image}
                alt={activity.name}
                width={600}
                height={400}
                className="rounded-t-lg object-cover aspect-[3/2]"
                data-ai-hint={activity.hint}
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{activity.category}</Badge>
                <p className="text-xs text-muted-foreground">{activity.province}</p>
              </div>
              <CardTitle className="font-headline text-xl">
                {activity.name}
              </CardTitle>
              <CardDescription>
                Gain skills in: {activity.skillsGained}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddToStoryBuilder}
                >
                <BookOpen className="mr-2 h-4 w-4" />
                Add to Story Builder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

