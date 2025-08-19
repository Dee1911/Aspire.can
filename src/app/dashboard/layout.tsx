
'use client';

import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '@/lib/user-data/profile';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isProfileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const checkProfile = async () => {
        const profile = await getUserProfile(user.uid);
        if (!profile || !profile.onboardingComplete) {
          router.push('/onboarding');
        } else {
          setProfileLoading(false);
        }
      };
      checkProfile();
    }
  }, [user, loading, router]);

  if (loading || !user || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
