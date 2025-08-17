'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Rocket, Shield, Target } from 'lucide-react';

export default function ProgramFinderPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">AI Program Finder</h1>
        <p className="text-muted-foreground">
          Complete the quiz to get personalized program recommendations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Tell us about yourself to find the right fit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                [Multi-step quiz will go here]
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Based on your profile, we suggest:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="flex items-center font-semibold mb-2">
                  <Rocket className="w-5 h-5 mr-2 text-primary" /> Reach
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Program A at University X</li>
                  <li>Program B at University Y</li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center font-semibold mb-2">
                  <Target className="w-5 h-5 mr-2 text-primary" /> Target
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Program C at University Z</li>
                  <li>Program D at University W</li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center font-semibold mb-2">
                  <Shield className="w-5 h-5 mr-2 text-primary" /> Safety
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Program E at University V</li>
                  <li>Program F at University U</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
