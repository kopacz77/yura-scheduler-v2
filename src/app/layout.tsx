import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ClientProviders } from '@/components/providers/ClientProviders';
import type { Session } from 'next-auth';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yura Min Scheduler',
  description: 'Schedule management system for ice dance coaching',
};

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders session={session}>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
