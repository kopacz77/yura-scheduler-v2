import React from 'react';
import { RinkSchedule } from '@/components/admin/rinks/RinkSchedule';
import { getRink, getRinkSchedule, addTimeSlot, deleteTimeSlot } from '@/lib/actions/rinks';
import { Heading } from '@/components/ui/heading';
import { notFound } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { type TimeSlot } from '@/types';

export default async function RinkSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const [rink, timeSlots] = await Promise.all([
    getRink(params.id),
    getRinkSchedule(params.id),
  ]);

  if (!rink) {
    notFound();
  }

  async function handleAddTimeSlot(data: Omit<TimeSlot, 'id'>) {
    try {
      await addTimeSlot(rink.id, data);
      toast({
        title: 'Success',
        description: 'Time slot added successfully',
      });
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add time slot',
        variant: 'destructive',
      });
    }
  }

  async function handleDeleteTimeSlot(timeSlotId: string) {
    try {
      await deleteTimeSlot(timeSlotId);
      toast({
        title: 'Success',
        description: 'Time slot deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete time slot',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="p-8 space-y-8">
      <Heading
        title={`${rink.name} Schedule`}
        description="Manage available time slots and lesson schedule"
      />

      <RinkSchedule
        rinkId={rink.id}
        timeSlots={timeSlots}
        onAddTimeSlot={handleAddTimeSlot}
        onDeleteTimeSlot={handleDeleteTimeSlot}
      />
    </div>
  );
}
