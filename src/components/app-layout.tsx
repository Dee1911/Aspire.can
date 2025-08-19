
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Compass,
  LayoutDashboard,
  GraduationCap,
  DollarSign,
  Lightbulb,
  Calendar,
  Sparkles,
  BookOpen,
  Target,
  FileClock,
  Calculator,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/program-finder', icon: Target, label: 'AI Program Finder' },
  {
    href: '/dashboard/admission-calculator',
    icon: Calculator,
    label: 'Admission Calculator',
  },
  { href: '/dashboard/timeline-generator', icon: FileClock, label: 'Timeline Generator' },
  { href: '/dashboard/programs', icon: GraduationCap, label: 'Program Explorer' },
  { href: '/dashboard/scholarships', icon: DollarSign, label: 'Scholarships' },
  { href: '/dashboard/extracurriculars', icon: Lightbulb, label: 'Extracurriculars' },
  { href: '/dashboard/calendar', icon: Calendar, label: 'Deadlines' },
  { href: '/dashboard/story-builder', icon: BookOpen, label: 'Story Builder' },
  { href: '/dashboard/essay-tool', icon: Sparkles, label: 'AI Essay Tool' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Compass className="text-primary size-7 shrink-0" />
            <span className="font-headline text-xl font-semibold group-data-[collapsible=icon]:hidden">
              Aspire
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2">
             <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 group-data-[collapsible=icon]:w-full"
              onClick={handleLogout}
            >
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
          <header className="mb-6 flex items-center gap-4 md:hidden">
            <SidebarTrigger />
            <Link href="/dashboard" className="flex items-center gap-2">
              <Compass className="text-primary size-6" />
              <span className="font-headline text-lg font-semibold">
                Aspire
              </span>
            </Link>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
