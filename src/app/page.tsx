
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Compass, Target, Calculator, FileClock, GraduationCap, DollarSign, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const features = [
  {
    icon: Target,
    title: 'AI Program Finder',
    description:
      'Discover university programs tailored to your academic profile and career aspirations.',
    hint: 'students studying',
  },
  {
    icon: Calculator,
    title: 'Admission Chance Calculator',
    description:
      'Get a data-driven estimate of your chances of getting into your dream university.',
      hint: 'university campus',
  },
  {
    icon: FileClock,
    title: 'Personalized Application Timeline',
    description:
      'Generate a custom timeline with key dates and milestones for your applications.',
      hint: 'calendar planning',
  },
  {
    icon: GraduationCap,
    title: 'Comprehensive Trackers',
    description:
      'Keep tabs on applications, deadlines, and scholarships all in one place.',
      hint: 'dashboard interface',
  },
  {
    icon: DollarSign,
    title: 'Story Builder & Essay Tool',
    description:
      'Craft a compelling personal narrative and get AI-powered feedback on your essays.',
      hint: 'creative writing',
  },
  {
    icon: Lightbulb,
    title: 'Resource Explorers',
    description:
      'Browse extensive databases of university programs and extracurricular activities.',
      hint: 'library books',
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
        <section className="relative py-24 md:py-32 lg:py-40">
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
           <Image
            src="https://placehold.co/1920x1080.png"
            alt="Students celebrating graduation"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
            data-ai-hint="students graduation"
          />
          <div className="container text-center relative z-20">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Navigate Your University Journey with Confidence
            </h1>
            <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-6">
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
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our comprehensive suite of tools is designed to give you an unfair advantage in the competitive world of university admissions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

         <section className="py-12 md:py-24 lg:py-32">
            <div className="container grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                 <Image
                    src="https://placehold.co/600x600.png"
                    alt="Map of Canada with university icons"
                    width={600}
                    height={600}
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                    data-ai-hint="Canada map"
                  />
                <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                            Built for Canada, by Canadians
                        </h2>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                          If you&apos;ve ever tried figuring out the Canadian university process, you know how frustrating it is. Everything online talks about SATs and Common Apps, but when it comes to Ontario or BC or anywhere else in Canada, you&apos;re left piecing it all together yourself.
                        </p>
                         <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                           That&apos;s why Aspire exists. It&apos;s built by Canadian students, for Canadian students. It's your personalized companion through the university application process. Thoughtfully made for Canada. Designed to make the path clearer. Inspired by students like you.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 border-t">
          <div className="container text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Ready to Find Your Future?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                Don&apos;t leave your future to chance. Sign up for Aspire today and take the first step towards your dream university.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started for Free <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t bg-muted/50">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built to empower students. All rights reserved. &copy; {new Date().getFullYear()} Aspire.
          </p>
        </div>
      </footer>
    </div>
  );
}
