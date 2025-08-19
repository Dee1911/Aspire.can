
'use client';

import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/lib/user-data/profile';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for firebase auth to finish initializing
    }

    if (!user) {
      // If auth is done and there's no user, redirect to login
      router.push('/login');
      return;
    }

    // If there is a user, check their onboarding status
    const checkOnboardingStatus = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.onboardingComplete) {
          setIsAuthorized(true);
        } else {
          // User exists but hasn't completed onboarding
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Failed to get user profile, redirecting to login.', error);
        router.push('/login');
      }
    };

    checkOnboardingStatus();
  }, [user, authLoading, router]);

  if (!isAuthorized) {
    // Show a loading spinner while we're verifying auth and onboarding status
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
