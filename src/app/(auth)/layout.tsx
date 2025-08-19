
import { Compass } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
       <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
            <Compass className="text-primary size-7 shrink-0" />
            <span className="font-headline text-xl font-semibold">
              Aspire
            </span>
          </Link>
        </div>
      {children}
    </div>
  );
}
