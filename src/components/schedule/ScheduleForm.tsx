'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_RINKS } from '@/types/schedule';
import { format, addDays } from 'date-fns';

interface ScheduleFormData {
  studentId: string;
  rinkId: string;
  date: string;
  startTime: string;
  duration: '30' | '60';
}

export function ScheduleForm() {
  const [selectedRink, setSelectedRink] = useState<string>('');
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleFormData>();

  const onSubmit = (data: ScheduleFormData) => {
    // TODO: Implement lesson scheduling
    console.log(data);
  };

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Schedule a Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rink Selection */}
          <div className="space-y-2">
            <Label htmlFor="rinkId">Select Rink</Label>
            <Select
              onValueChange={(value) => setSelectedRink(value)}
              defaultValue={selectedRink}
            >
              <SelectTrigger className="w-full">
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
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              type="time"
              {...register('startTime', { required: true })}
              className="w-full"
            />
          </div>

          {/* Duration Selection */}
          <div className="space-y-2">
            <Label htmlFor="duration">Lesson Duration</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Schedule Lesson
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
