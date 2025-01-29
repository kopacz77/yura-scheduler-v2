import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameMonth, isSameDay, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment as AppointmentType } from '@prisma/client';

type ViewType = 'day' | 'week' | 'month';

interface CalendarViewProps {
  appointments: AppointmentType[];
  onDateSelect: (date: Date) => void;
  onViewAppointment: (appointment: AppointmentType) => void;
  onCreateAppointment: (date: Date) => void;
}

export function CalendarView({
  appointments,
  onDateSelect,
  onViewAppointment,
  onCreateAppointment,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');

  const getDaysInView = () => {
    switch (view) {
      case 'day':
        return [currentDate];
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case 'month':
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        return eachDayOfInterval({ start, end });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const intervals = {
      day: 1,
      week: 7,
      month: 30
    };
    const days = intervals[view];
    setCurrentDate(prevDate => 
      direction === 'prev' ? addDays(prevDate, -days) : addDays(prevDate, days)
    );
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.start), date)
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>

      <div className={cn(
        'grid gap-2',
        view === 'month' ? 'grid-cols-7' : 'grid-cols-1'
      )}>
        {getDaysInView().map((date, index) => (
          <div
            key={date.toISOString()}
            className={cn(
              'p-2 border rounded-lg',
              isSameMonth(date, currentDate) ? 'bg-white' : 'bg-gray-50',
              'min-h-[120px] cursor-pointer'
            )}
            onClick={() => onDateSelect(date)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={cn(
                'text-sm font-medium',
                isSameDay(date, new Date()) && 'text-blue-600'
              )}>
                {format(date, view === 'month' ? 'd' : 'EEE, MMM d')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateAppointment(date);
                }}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {getAppointmentsForDay(date).map((appointment) => (
                <div
                  key={appointment.id}
                  className="text-sm p-1 bg-blue-100 rounded truncate"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAppointment(appointment);
                  }}
                >
                  {format(new Date(appointment.start), 'HH:mm')} - {appointment.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
