import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from 'sonner';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Yura Scheduler - Ice Dance Coaching',
  description: 'Professional ice dance coaching scheduling system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
