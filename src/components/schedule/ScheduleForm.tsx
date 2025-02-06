'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_RINKS } from '@/types/schedule';
import { format, addDays, parse } from 'date-fns';
import { useLessons } from '@/hooks/useLessons';
import { useStudents } from '@/hooks/useStudents';
import { toast } from 'sonner';
import { Loader2, Clock, MapPin, User } from 'lucide-react';

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
  const { students, isLoading: isLoadingStudents, fetchStudents } = useStudents();
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ScheduleFormData>({
    defaultValues: {
      duration: '60', // Default to 1-hour lessons
      rinkId: '', // Initialize rinkId
      studentId: '' // Initialize studentId
    }
  });

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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

  const formValues = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <h2 className="text-lg font-semibold text-foreground">Student Information</h2>
        </div>

        {isLoadingStudents ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading students...</span>
          </div>
        ) : (
          <Select
            value={formValues.studentId}
            onValueChange={(value) => setValue('studentId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.user?.name || 'Unnamed Student'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.studentId && (
          <span className="text-sm text-destructive">Student is required</span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <h2 className="text-lg font-semibold text-foreground">Location</h2>
        </div>

        <Select
          value={formValues.rinkId}
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
                <span className="text-sm text-muted-foreground ml-2">
                  {details.address}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.rinkId && (
          <span className="text-sm text-destructive">Rink is required</span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <h2 className="text-lg font-semibold text-foreground">Time & Duration</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              {...register('date', { required: true })}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full"
            />
            {errors.date && (
              <span className="text-sm text-destructive">Date is required</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              type="time"
              {...register('startTime', { required: true })}
              step="1800" // 30-minute intervals
              className="w-full"
            />
            {errors.startTime && (
              <span className="text-sm text-destructive">Start time is required</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select
            value={formValues.duration}
            onValueChange={(value) => setValue('duration', value as '30' | '60')}
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
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scheduling...
          </>
        ) : (
          'Schedule Lesson'
        )}
      </Button>
    </form>
  );
}
