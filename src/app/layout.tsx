import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yura Min Scheduler',
  description: 'Schedule management system for ice dance coaching',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}