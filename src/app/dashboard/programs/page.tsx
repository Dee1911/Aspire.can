

'use client';

import { useMemo, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';
import Image from 'next/image';
import { programs } from '@/lib/programs-data';

const allProvinces = [...new Set(programs.map(p => p.province))].sort();
const allFaculties = [...new Set(programs.map(p => p.faculty))].sort();

export default function ProgramsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('all-provinces');
  const [facultyFilter, setFacultyFilter] = useState('all-faculties');

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const searchLower = searchTerm.toLowerCase();
      const termMatch =
        program.programName.toLowerCase().includes(searchLower) ||
        program.universityName.toLowerCase().includes(searchLower);

      const provinceMatch =
        provinceFilter === 'all-provinces'
          ? true
          : program.province === provinceFilter;
      const facultyMatch =
        facultyFilter === 'all-faculties'
          ? true
          : program.faculty === facultyFilter;

      return termMatch && provinceMatch && facultyMatch;
    });
  }, [searchTerm, provinceFilter, facultyFilter]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">Program Explorer</h1>
        <p className="text-muted-foreground">
          Find and save university programs that match your interests.
        </p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Search by program or university..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="md:col-span-2 lg:col-span-1"
            />
            <Select onValueChange={setProvinceFilter} value={provinceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-provinces">All Provinces</SelectItem>
                {allProvinces.map(p => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setFacultyFilter} value={facultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-faculties">All Faculties</SelectItem>
                {allFaculties.map(f => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map(program => (
          <Card key={program.programName + program.universityName}>
            <CardHeader className="p-0">
              <Image
                src={program.image}
                alt={program.programName}
                width={600}
                height={400}
                className="rounded-t-lg object-cover aspect-[3/2]"
                data-ai-hint={program.hint}
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="font-headline text-xl">
                {program.programName}
              </CardTitle>
              <CardDescription>{program.universityName}</CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
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
