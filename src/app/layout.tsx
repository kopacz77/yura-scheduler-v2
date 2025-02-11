import '@/styles/globals.css';
import { GeistSans } from 'geist/font/sans';
import { Providers } from '@/providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Yura Ice Dance',
    template: '%s - Yura Ice Dance',
  },
  description: 'Ice dance coaching and scheduling platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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