import { SiteFooter } from '@/components/layout/site-footer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        {/* Sidebar content rendered here */}
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}