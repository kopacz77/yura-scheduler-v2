import { SiteFooter } from '@/components/layout/site-footer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Your sidebar component here */}
      <div className="flex-1">
        <main className="h-full p-4">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}