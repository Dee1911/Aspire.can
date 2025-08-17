'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/program-finder', icon: Target, label: 'AI Program Finder' },
  { href: '/timeline-generator', icon: FileClock, label: 'Timeline Generator' },
  { href: '/programs', icon: GraduationCap, label: 'Program Explorer' },
  { href: '/scholarships', icon: DollarSign, label: 'Scholarships' },
  { href: '/extracurriculars', icon: Lightbulb, label: 'Extracurriculars' },
  { href: '/calendar', icon: Calendar, label: 'Deadlines' },
  { href: '/story-builder', icon: BookOpen, label: 'Story Builder' },
  { href: '/essay-tool', icon: Sparkles, label: 'AI Essay Tool' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <Compass className="text-primary size-7 shrink-0" />
            <span className="font-headline text-xl font-semibold group-data-[collapsible=icon]:hidden">
              Aspire Compass
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
          <header className="mb-6 flex items-center gap-4 md:hidden">
            <SidebarTrigger />
            <Link href="/" className="flex items-center gap-2">
              <Compass className="text-primary size-6" />
              <span className="font-headline text-lg font-semibold">
                Aspire Compass
              </span>
            </Link>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
