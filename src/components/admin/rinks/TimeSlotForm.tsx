'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimeSlot } from '@/lib/actions/rinks';

const timeSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  maxStudents: z.number().min(1).max(10),
});

type TimeSlotFormData = z.infer<typeof timeSlotSchema>;

interface TimeSlotFormProps {
  onSubmit: (data: Omit<TimeSlot, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export function TimeSlotForm({ onSubmit, isLoading }: TimeSlotFormProps) {
  const form = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      startTime: '',
      endTime: '',
      maxStudents: 1,
    },
  });

  const handleSubmit = async (data: TimeSlotFormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            step="1800"
            {...form.register('startTime')}
          />
          {form.formState.errors.startTime && (
            <p className="text-sm text-red-500">
              {form.formState.errors.startTime.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            step="1800"
            {...form.register('endTime')}
          />
          {form.formState.errors.endTime && (
            <p className="text-sm text-red-500">
              {form.formState.errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxStudents">Maximum Students</Label>
        <Input
          id="maxStudents"
          type="number"
          min="1"
          max="10"
          {...form.register('maxStudents', { valueAsNumber: true })}
        />
        {form.formState.errors.maxStudents && (
          <p className="text-sm text-red-500">
            {form.formState.errors.maxStudents.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Time Slot'}
      </Button>
    </form>
  );
}
