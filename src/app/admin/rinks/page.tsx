import React from 'react';
import { RinkCard } from '@/components/admin/rinks/RinkCard';
import { RinkDialog } from '@/components/admin/rinks/RinkDialog';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { getRinks } from '@/lib/actions/rinks';

export default async function RinksPage() {
  const rinks = await getRinks();

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <Heading
          title={`Rinks (${rinks.length})`}
          description="Manage your rink locations and schedules."
        />
        <RinkDialog
          open={false}
          onOpenChange={() => {}}
          onSubmit={async () => {}}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rinks.map((rink) => (
          <RinkCard
            key={rink.id}
            rink={{
              id: rink.id,
              name: rink.name,
              address: rink.address,
              timezone: rink.timezone,
              lessonCount: rink._count?.lessons || 0,
            }}
            onEdit={(id) => console.log('Edit rink:', id)}
            onDelete={(id) => console.log('Delete rink:', id)}
            onManageSchedule={(id) => console.log('Manage schedule:', id)}
          />
        ))}      
      </div>
    </div>
  );
}
