'use client';

import React from 'react';
import { RinkCard } from '@/components/admin/rinks/RinkCard';
import { RinkDialog } from '@/components/admin/rinks/RinkDialog';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Rink {
  id: string;
  name: string;
  address: string;
  timezone: string;
  _count?: {
    lessons: number;
  };
}

export default function RinksPage() {
  const [rinks, setRinks] = useState<Rink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRinks = async () => {
      try {
        const response = await fetch('/api/resources');
        const data = await response.json();
        setRinks(data.resources);
      } catch (error) {
        console.error('Error fetching rinks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRinks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

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