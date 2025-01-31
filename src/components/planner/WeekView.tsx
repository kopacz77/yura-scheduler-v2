import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Appointment } from './Appointment';

interface WeekViewProps {
  selectedDate: Date;
  appointments: any[];
  resources: any[];
}

export function WeekView({ selectedDate, appointments, resources }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-8 gap-2">
      {/* Time slots column */}
      <div className="space-y-2 pt-16">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="h-20 text-xs text-muted-foreground">
            {format(new Date().setHours(i, 0), 'h a')}
          </div>
        ))}
      </div>

      {/* Days columns */}
      {weekDays.map((day, dayIndex) => (
        <div key={day.toString()} className="space-y-2">
          <div className="text-center">
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div className="text-xs text-muted-foreground">{format(day, 'd')}</div>
          </div>
          
          <div className="relative h-[1200px]">
            {/* Time grid */}
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-muted"
                style={{ top: `${(i * 100) / 2}%` }}
              />
            ))}

            {/* Appointments */}
            {appointments
              .filter(apt => format(new Date(apt.start), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
              .map(appointment => {
                const startHour = new Date(appointment.start).getHours();
                const startMinutes = new Date(appointment.start).getMinutes();
                const duration = (new Date(appointment.end).getTime() - new Date(appointment.start).getTime()) / (1000 * 60);
                
                return (
                  <div
                    key={appointment.id}
                    className="absolute w-full px-1"
                    style={{
                      top: `${((startHour * 60 + startMinutes) * 100) / (24 * 60)}%`,
                      height: `${(duration * 100) / (24 * 60)}%`
                    }}
                  >
                    <Appointment
                      appointment={appointment}
                      resourceId={appointment.resourceId}
                      columnIndex={dayIndex}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}