'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { format, addDays, isSameDay, isToday, parse, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserCircle2, Clock, Calendar, MapPin } from 'lucide-react';
import { Lesson, RinkTimeSlot, Rink } from '@prisma/client';
import { useMemo, useState } from 'react';
import { SlotContextMenu } from './SlotContextMenu';
import { toast } from '@/components/ui/use-toast';

interface CalendarViewProps {
  currentWeek: Date;
  lessons: Array<Lesson & {
    student: {
      user: {
        name: string | null;
      };
    };
  }>;
  timeSlots: Array<RinkTimeSlot & {
    rink: Rink;
  }>;
  onRefresh: () => void;
  onEditSlot: (slot: RinkTimeSlot) => void;
}

export function CalendarView({ 
  currentWeek,
  lessons,
  timeSlots,
  onRefresh,
  onEditSlot
}: CalendarViewProps) {
  const weekDays = useMemo(() => (
    Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))
  ), [currentWeek]);

  const getTimeSlotForCell = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay();
    return timeSlots.find(ts => {
      const slotStart = new Date(ts.startTime);
      return isSameDay(slotStart, day) && 
             format(slotStart, 'HH:mm') === timeSlot;
    });
  };

  const getLessonForSlot = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);

    return lessons.find(lesson => {
      const startTime = new Date(lesson.startTime);
      return isSameDay(startTime, day) && 
             startTime.getHours() === hours && 
             startTime.getMinutes() === minutes;
    });
  };

  const isSlotPast = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime < new Date();
  };

  const handleDeleteSlot = async (slot: RinkTimeSlot, deleteRecurring?: boolean) => {
    try {
      const response = await fetch(`/api/schedule/slots/${slot.id}${deleteRecurring ? '?recurring=true' : ''}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast({
        title: 'Success',
        description: `Slot${deleteRecurring ? 's' : ''} deleted successfully`,
      });

      onRefresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete slot',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="overflow-hidden border rounded-lg shadow-sm">
      <CardHeader className="bg-primary/5 py-3 px-4 border-b">
        <div className="flex items-center space-x-2 text-primary">
          <Calendar className="h-5 w-5" />
          <h3 className="font-semibold">Weekly Schedule</h3>
        </div>
      </CardHeader>

      {/* Calendar Header */}
      <div className="grid grid-cols-[6rem_repeat(7,_1fr)] bg-muted/50 border-b">
        <div className="p-3 font-medium text-muted-foreground border-r text-sm">
          Time
        </div>
        {weekDays.map(day => (
          <div
            key={day.toISOString()}
            className={cn(
              'p-3 text-center border-r',
              isToday(day) && 'bg-primary/10'
            )}
          >
            <div className="font-medium text-base">{format(day, 'EEE')}</div>
            <div className="text-sm text-muted-foreground font-medium">
              {format(day, 'MMM d')}
            </div>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="overflow-auto max-h-[600px] bg-background/50">
        {Array.from({ length: 32 }, (_, i) => {
          const hour = Math.floor(i / 2) + 6;
          const minutes = (i % 2) * 30;
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          return (
            <div 
              key={timeSlot} 
              className={cn(
                "grid grid-cols-[6rem_repeat(7,_1fr)] border-b",
                timeSlot.endsWith('00') && 'bg-muted/5'
              )}
            >
              <div className="p-2 border-r text-sm font-medium text-muted-foreground flex items-center justify-end pr-4 min-h-[3rem]">
                {format(parse(timeSlot, 'HH:mm', new Date()), 'h:mm a')}
              </div>
              {weekDays.map(day => {
                const slot = getTimeSlotForCell(day, timeSlot);
                const lesson = getLessonForSlot(day, timeSlot);
                const isPast = isSlotPast(day, timeSlot);

                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className={cn(
                      'border-r min-h-[3rem] relative group',
                      slot && !lesson && 'bg-blue-100 dark:bg-blue-900/20',
                      lesson && 'bg-primary/10',
                      isPast && 'opacity-50'
                    )}
                  >
                    {slot && !isPast && (
                      <SlotContextMenu
                        slot={slot}
                        isRecurring={!!slot.recurringId}
                        onEdit={onEditSlot}
                        onDelete={handleDeleteSlot}
                      />
                    )}
                    {slot && (
                      <div className="text-xs p-2 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{slot.rink.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(new Date(slot.startTime), 'h:mm a')} -
                            {format(new Date(slot.endTime), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    )}
                    {lesson && (
                      <div className="absolute inset-0 bg-primary/10 p-2">
                        <div className="flex items-center space-x-1">
                          <UserCircle2 className="h-3 w-3 text-primary" />
                          <span className="font-medium truncate">
                            {lesson.student?.user?.name || 'Unnamed Student'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
}