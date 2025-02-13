import { SiteFooter } from '@/components/layout/site-footer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1 container py-6">{children}</main>
      <SiteFooter />
    </div>
  );
}