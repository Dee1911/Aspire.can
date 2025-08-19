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
import { Download, ExternalLink, Loader2, Save, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { getStoryBuilderData } from '@/lib/user-data/story-builder';
import {
  findScholarships,
  FindScholarshipsOutput,
} from '@/ai/flows/scholarship-finder-flow';
import Link from 'next/link';

export default function ScholarshipsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [userProfile, setUserProfile] = useState('');
  const [recommendations, setRecommendations] =
    useState<FindScholarshipsOutput | null>(null);

  const handleLoadProfile = async () => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You must be logged in to load your narrative.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoadingProfile(true);
    try {
      const data = await getStoryBuilderData(user.uid);
      if (data) {
        const combinedNarrative = [
          `Personal Story: ${data.personalStory || 'Not provided.'}`,
          `Extracurriculars: ${(data.ecs || [])
            .map(
              (ec) =>
                `- ${ec.name} (${ec.role}): ${ec.impact} - ${ec.story}`
            )
            .join('\n') || 'Not provided.'}`,
          `Achievements: ${data.achievements || 'Not provided.'}`,
          `Grades: ${data.grades || 'Not provided.'}`,
          `Struggles & Growth: ${data.struggles || 'Not provided.'}`,
          `Skills: ${data.skills || 'Not provided.'}`,
        ].join('\n\n');
        setUserProfile(combinedNarrative);
        toast({
          title: 'Profile Loaded',
          description:
            'Your story has been loaded from the Story Builder.',
        });
      } else {
        toast({
          title: 'No Profile Found',
          description: 'Please save your story in the Story Builder first.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to load narrative:', error);
      toast({
        title: 'Load Failed',
        description: 'Could not load your story. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleFindScholarships = async () => {
    if (!userProfile) {
      toast({
        title: 'Profile Required',
        description: 'Please load your profile before finding scholarships.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoadingRecommendations(true);
    setRecommendations(null);
    try {
      const result = await findScholarships({ userProfile });
      setRecommendations(result);
    } catch (error) {
      console.error('Failed to find scholarships:', error);
      toast({
        title: 'Search Failed',
        description: 'Could not find scholarships. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-headline font-bold">
          AI Scholarship Matchmaker
        </h1>
        <p className="text-muted-foreground">
          Discover funding opportunities tailored to your unique profile.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Load your profile from the Story Builder to get the best matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleLoadProfile} disabled={isLoadingProfile}>
              {isLoadingProfile ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Load My Profile
            </Button>
            <Button
              onClick={handleFindScholarships}
              disabled={!userProfile || isLoadingRecommendations}
            >
              {isLoadingRecommendations ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Find Scholarships
            </Button>
          </div>
          {userProfile && (
            <p className="mt-4 text-sm text-muted-foreground border p-3 rounded-md bg-muted/50">
              Profile loaded successfully. You can now find scholarships.
            </p>
          )}
        </CardContent>
      </Card>

      {isLoadingRecommendations && (
        <div className="flex items-center justify-center pt-10">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoadingRecommendations && !recommendations && (
         <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg mt-6">
            <Sparkles className="mx-auto h-12 w-12" />
            <p className="mt-4">
              Your personalized scholarship recommendations will appear here.
            </p>
          </div>
      )}

      {recommendations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.topMatches.map((scholarship) => (
            <Card key={scholarship.name}>
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {scholarship.name}
                </CardTitle>
                <CardDescription className="text-primary font-bold text-lg">
                  ${scholarship.amount.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  <strong className="font-semibold">Eligibility:</strong>{' '}
                  <span className="text-muted-foreground">
                    {scholarship.eligibility}
                  </span>
                </p>
                <p className="text-sm">
                   <strong className="font-semibold">Justification:</strong>{' '}
                  <span className="text-muted-foreground">
                    {scholarship.justification}
                  </span>
                </p>
                 <p className="text-sm">
                   <strong className="font-semibold">Deadline:</strong>{' '}
                  <span className="text-muted-foreground">
                    {scholarship.deadline}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={scholarship.website} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
