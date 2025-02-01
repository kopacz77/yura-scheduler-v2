'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_RINKS, Lesson } from '@/types/schedule';
import { format, addDays, startOfWeek, addWeeks, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  lessons: Lesson[];
  onSlotSelect?: (date: Date) => void;
}

export function CalendarView({ lessons, onSlotSelect }: CalendarViewProps) {
  const [selectedRink, setSelectedRink] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));

  // Generate week days
  const weekDays = eachDayOfInterval({
    start: currentWeek,
    end: addDays(currentWeek, 6)
  });

  // Time slots from 6 AM to 10 PM
  const timeSlots = Array.from({ length: 32 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6;
    const minutes = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  const getLessonForSlot = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);

    return lessons.find(lesson => {
      const startTime = new Date(lesson.startTime);
      return (
        startTime.getTime() === slotTime.getTime() &&
        lesson.rinkId === selectedRink
      );
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="space-y-4 p-6">
        <CardTitle className="text-2xl font-bold">Schedule Calendar</CardTitle>
        
        <div className="flex justify-between items-center">
          <Select
            value={selectedRink}
            onValueChange={setSelectedRink}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a rink" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DEFAULT_RINKS).map(([name]) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(prev => addWeeks(prev, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {format(currentWeek, 'MMMM d')} - {format(addDays(currentWeek, 6), 'MMMM d, yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeek(prev => addWeeks(prev, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r bg-muted">Time</div>
          {weekDays.map(day => (
            <div
              key={day.toISOString()}
              className="p-2 text-center border-r bg-muted font-medium"
            >
              {format(day, 'EEE d')}
            </div>
          ))}
        </div>

        <div className="overflow-auto max-h-[600px]">
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 border-b">
              <div className="p-2 border-r text-sm">{timeSlot}</div>
              {weekDays.map(day => {
                const lesson = getLessonForSlot(day, timeSlot);
                return (
                  <div
                    key={day.toISOString()}
                    className={`p-2 border-r min-h-[40px] cursor-pointer hover:bg-muted/50 transition-colors ${lesson ? 'bg-primary/10' : ''}`}
                    onClick={() => {
                      if (!lesson && onSlotSelect) {
                        const [hours, minutes] = timeSlot.split(':').map(Number);
                        const selectedDate = new Date(day);
                        selectedDate.setHours(hours, minutes, 0, 0);
                        onSlotSelect(selectedDate);
                      }
                    }}
                  >
                    {lesson && (
                      <div className="text-xs">
                        <div className="font-medium">{lesson.studentId}</div>
                        <div>{format(new Date(lesson.startTime), 'h:mm a')} - {format(new Date(lesson.endTime), 'h:mm a')}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
