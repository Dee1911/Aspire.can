
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
  const [status, setStatus] = useState<'loading' | 'onboarding' | 'authorized'>('loading');

  useEffect(() => {
    if (authLoading) {
      return; // Wait for firebase auth to initialize
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // If we have a user, we need to check if they have completed onboarding
    const checkProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.onboardingComplete) {
          setStatus('authorized');
        } else {
          // This will redirect them to onboarding, and we'll wait there.
          setStatus('onboarding');
          router.push('/onboarding');
        }
      } catch (error) {
        console.error("Failed to check user profile, logging out.", error);
        // If rules are bad or something else happens, push to login.
        router.push('/login');
      }
    };

    checkProfile();
  }, [user, authLoading, router]);

  if (status !== 'authorized') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
