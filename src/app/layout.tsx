import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/components/providers';
import { auth } from '@/lib/auth';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'YM Movement - Ice Dance with Yura Min',
  description: 'Schedule your ice dance lessons with Olympic athlete Yura Min',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest'
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={GeistSans.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}