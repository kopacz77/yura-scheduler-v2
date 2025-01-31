import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  selectedDate: Date;
  appointments: any[];
  onDateSelect: (date: Date) => void;
}

export function MonthView({ selectedDate, appointments, onDateSelect }: MonthViewProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-center text-sm font-medium">
          {day}
        </div>
      ))}

      {/* Calendar grid */}
      {monthDays.map(date => {
        const dayAppointments = appointments.filter(
          apt => format(new Date(apt.start), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );

        return (
          <div
            key={date.toString()}
            className={cn(
              'min-h-32 p-2 hover:bg-muted/50',
              'border border-muted cursor-pointer transition-colors',
              !isSameMonth(date, selectedDate) && 'text-muted-foreground',
              isToday(date) && 'bg-muted'
            )}
            onClick={() => onDateSelect(date)}
          >
            <div className="text-right text-sm">{format(date, 'd')}</div>
            
            <div className="mt-2 space-y-1">
              {dayAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="truncate rounded bg-primary/10 px-1 py-0.5 text-xs"
                  title={apt.title}
                >
                  {format(new Date(apt.start), 'h:mm a')} - {apt.title}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}