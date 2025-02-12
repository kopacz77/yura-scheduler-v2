'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parse, addMinutes } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const weekDays = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' },
];

const recurringSlotSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  duration: z.string().transform(Number).pipe(
    z.number().min(15, 'Duration must be at least 15 minutes')
  ),
  maxStudents: z.string().transform(Number).pipe(
    z.number().min(1, 'Must allow at least 1 student')
  ),
  daysOfWeek: z.array(z.number()).min(1, 'Select at least one day'),
});

type RecurringSlotFormData = z.infer<typeof recurringSlotSchema>;

interface RecurringSlotFormProps {
  rinkId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RecurringSlotForm({ rinkId, onSuccess, onCancel }: RecurringSlotFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RecurringSlotFormData>({
    resolver: zodResolver(recurringSlotSchema),
    defaultValues: {
      daysOfWeek: [],
      duration: '30',
      maxStudents: '1',
    },
  });

  const handleDayToggle = (dayId: number) => {
    setSelectedDays(current => {
      const updated = current.includes(dayId)
        ? current.filter(id => id !== dayId)
        : [...current, dayId];
      setValue('daysOfWeek', updated);
      return updated;
    });
  };

  const onSubmit = async (data: RecurringSlotFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const startTime = parse(data.startTime, 'HH:mm', new Date());
      const endTime = addMinutes(startTime, data.duration);

      const response = await fetch('/api/schedule/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          rinkId,
          endTime: format(endTime, 'HH:mm'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create recurring slots');
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error creating recurring slots:', err);
      setError(err instanceof Error ? err.message : 'Failed to create recurring slots');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Create Recurring Time Slots</CardTitle>
          <CardDescription>
            Set up recurring time slots for lessons
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              min={format(new Date(), 'yyyy-MM-dd')}
              {...register('startDate')}
            />
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              min={format(new Date(), 'yyyy-MM-dd')}
              {...register('endDate')}
            />
            {errors.endDate && (
              <p className="text-sm text-red-500">{errors.endDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              type="time"
              id="startTime"
              {...register('startTime')}
            />
            {errors.startTime && (
              <p className="text-sm text-red-500">{errors.startTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              type="number"
              id="duration"
              min="15"
              step="15"
              {...register('duration')}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxStudents">Maximum Students</Label>
            <Input
              type="number"
              id="maxStudents"
              min="1"
              {...register('maxStudents')}
            />
            {errors.maxStudents && (
              <p className="text-sm text-red-500">{errors.maxStudents.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Days of Week</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {weekDays.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.id}`}
                    checked={selectedDays.includes(day.id)}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
                </div>
              ))}
            </div>
            {errors.daysOfWeek && (
              <p className="text-sm text-red-500">{errors.daysOfWeek.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Slots'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
