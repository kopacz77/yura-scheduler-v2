'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_RINKS } from '@/types/schedule';
import { format, addDays, parse } from 'date-fns';
import { useLessons } from '@/hooks/useLessons';
import { toast } from 'sonner';

interface ScheduleFormProps {
  initialDate?: Date | null;
  onSchedule?: () => void;
}

interface ScheduleFormData {
  studentId: string;
  rinkId: string;
  date: string;
  startTime: string;
  duration: '30' | '60';
}

export function ScheduleForm({ initialDate, onSchedule }: ScheduleFormProps) {
  const [selectedRink, setSelectedRink] = useState<string>('');
  const { scheduleLesson } = useLessons();
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ScheduleFormData>({
    defaultValues: {
      duration: '60' // Default to 1-hour lessons
    }
  });

  useEffect(() => {
    if (initialDate) {
      setValue('date', format(initialDate, 'yyyy-MM-dd'));
      setValue('startTime', format(initialDate, 'HH:mm'));
    }
  }, [initialDate, setValue]);

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      const startTime = parse(
        `${data.date} ${data.startTime}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );

      await scheduleLesson({
        studentId: data.studentId,
        rinkId: data.rinkId,
        startTime,
        duration: parseInt(data.duration) as 30 | 60
      });

      toast.success('Lesson scheduled successfully');
      onSchedule?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to schedule lesson';
      toast.error(message);
    }
  };

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="studentId">Student</Label>
        <Select
          {...register('studentId', { required: true })}
          onValueChange={(value) => setValue('studentId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a student" />
          </SelectTrigger>
          <SelectContent>
            {/* TODO: Replace with actual student data */}
            <SelectItem value="student1">John Doe</SelectItem>
            <SelectItem value="student2">Jane Smith</SelectItem>
          </SelectContent>
        </Select>
        {errors.studentId && (
          <span className="text-sm text-red-500">Student is required</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rinkId">Rink</Label>
        <Select
          {...register('rinkId', { required: true })}
          onValueChange={(value) => {
            setValue('rinkId', value);
            setSelectedRink(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a rink" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DEFAULT_RINKS).map(([name, details]) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.rinkId && (
          <span className="text-sm text-red-500">Rink is required</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            {...register('date', { required: true })}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          {errors.date && (
            <span className="text-sm text-red-500">Date is required</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            type="time"
            {...register('startTime', { required: true })}
            step="1800" // 30-minute intervals
          />
          {errors.startTime && (
            <span className="text-sm text-red-500">Start time is required</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Select
          {...register('duration', { required: true })}
          onValueChange={(value) => setValue('duration', value as '30' | '60')}
          defaultValue="60"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Scheduling...' : 'Schedule Lesson'}
      </Button>
    </form>
  );
}
