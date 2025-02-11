import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'YM Movement - Ice Dance with Yura Min',
  description: 'Schedule your ice dance lessons with Olympic athlete Yura Min',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}