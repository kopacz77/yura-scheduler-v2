'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { format, addDays, isSameDay, isToday, parse, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserCircle2, Clock, Calendar, MapPin, MoreVertical } from 'lucide-react';
import { Lesson, RinkTimeSlot, Rink } from '@prisma/client';
import { useMemo, useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  onSlotSelect?: (date: Date) => void;
  onLessonSelect?: (lesson: Lesson) => void;
  onRefresh?: () => void;
}

export function CalendarView({ 
  currentWeek,
  lessons,
  timeSlots,
  onSlotSelect,
  onLessonSelect,
  onRefresh
}: CalendarViewProps) {
  const weekDays = useMemo(() => (
    Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))
  ), [currentWeek]);

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const response = await fetch(`/api/schedule/slots/${slotId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast({
        title: 'Success',
        description: 'Slot deleted successfully',
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete slot',
        variant: 'destructive',
      });
    }
  };

  // ... rest of the component code ...

  return (
    <Card className="overflow-hidden border rounded-lg shadow-sm">
      {/* ... header code ... */}
      <div className="overflow-auto max-h-[600px] bg-background/50">
        {TIME_SLOTS.map((timeSlot, index) => (
          <div key={timeSlot} className={cn(
            "grid grid-cols-[6rem_repeat(7,_1fr)] border-b",
            timeSlot.endsWith('00') && 'bg-muted/5'
          )}>
            {/* ... time column code ... */}
            {weekDays.map(day => {
              const availableSlot = getTimeSlotForCell(day, timeSlot);
              const isPast = isSlotPast(day, timeSlot);

              return (
                <div key={`${day.toISOString()}-${timeSlot}`}
                  className={cn(
                    'border-r min-h-[3rem] relative group',
                    !isPast && availableSlot && 'cursor-pointer hover:bg-primary/5',
                    availableSlot && 'bg-blue-100'
                  )}>
                  {availableSlot && (
                    <>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:bg-primary/10 p-1 rounded">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleDeleteSlot(availableSlot.id)}
                              className="text-destructive">
                              Delete Slot
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-xs p-2 text-muted-foreground">
                        {/* ... slot content ... */}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}