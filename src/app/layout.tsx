import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/components/providers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'YM Movement - Ice Dance with Yura Min',
  description: 'Schedule your ice dance lessons with Olympic athlete Yura Min',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}