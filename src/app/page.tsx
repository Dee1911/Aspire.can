
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'AI Program Finder',
    description:
      'Discover university programs tailored to your academic profile and career aspirations.',
  },
  {
    title: 'Admission Chance Calculator',
    description:
      'Get a data-driven estimate of your chances of getting into your dream university.',
  },
  {
    title: 'Personalized Application Timeline',
    description:
      'Generate a custom timeline with key dates and milestones for your applications.',
  },
  {
    title: 'Story Builder & Essay Tool',
    description:
      'Craft a compelling personal narrative and get AI-powered feedback on your essays.',
  },
  {
    title: 'Comprehensive Trackers',
    description:
      'Keep tabs on applications, deadlines, and scholarships all in one place.',
  },
  {
    title: 'Resource Explorers',
    description:
      'Browse extensive databases of university programs and extracurricular activities.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <Compass className="text-primary size-7 shrink-0" />
              <span className="font-headline text-xl font-semibold">
                Aspire
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Navigate Your University Journey with Confidence
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-6">
              Aspire is your all-in-one AI-powered guide for Canadian university
              applications. From finding the perfect program to polishing your
              essays, we're with you every step of the way.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start Your Journey Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                  Your Personal AI Application Assistant
                </h2>
                <p className="text-muted-foreground">
                  Leverage the power of AI to gain an edge. Aspire's intelligent
                  tools analyze your profile to provide personalized recommendations
                  and insights that demystify the complex application process.
                </p>
              </div>
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built to empower students. All rights reserved. &copy; {new Date().getFullYear()} Aspire.
          </p>
        </div>
      </footer>
    </div>
  );
}
