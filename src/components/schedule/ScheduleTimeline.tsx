'use client';

import { useMemo } from 'react';
import { format, addMinutes, parseISO } from 'date-fns';
import { getLocalDateTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

interface TimelineProps {
  start: Date | string;
  end: Date | string;
  interval?: number;
  className?: string;
}

export function ScheduleTimeline({ 
  start, 
  end, 
  interval = 30,
  className 
}: TimelineProps) {
  const timeSlots = useMemo(() => {
    const slots = [];
    const startTime = typeof start === 'string' ? parseISO(start) : start;
    const endTime = typeof end === 'string' ? parseISO(end) : end;
    
    let current = getLocalDateTime(startTime);
    const endLocal = getLocalDateTime(endTime);

    while (current <= endLocal) {
      slots.push(format(current, 'h:mm a'));
      current = addMinutes(current, interval);
    }

    return slots;
  }, [start, end, interval]);

  return (
    <div className={cn('space-y-1', className)}>
      {timeSlots.map((time) => (
        <div
          key={time}
          className="flex items-center text-xs text-muted-foreground"
        >
          <div className="w-12">{time}</div>
          <div className="flex-1 border-t border-dashed" />
        </div>
      ))}
    </div>
  );
}