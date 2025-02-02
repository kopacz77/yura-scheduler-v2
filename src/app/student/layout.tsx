import { PageHeader } from '@/components/layout/PageHeader';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      {children}
    </div>
  );
}