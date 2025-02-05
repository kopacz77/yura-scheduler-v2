'use client';

import { useState } from 'react';
import { format, subDays, addDays, startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/models/types';

type ViewType = 'day' | 'week' | 'month';

interface CalendarViewProps {
  appointments: Appointment[];
  onRangeChange?: (start: Date, end: Date) => void;
  onViewChange?: (view: ViewType) => void;
}

export function CalendarView({ 
  appointments, 
  onRangeChange, 
  onViewChange 
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');

  const handlePrevious = () => {
    const newDate = view === 'day' ? subDays(selectedDate, 1)
      : view === 'week' ? subDays(selectedDate, 7)
      : subDays(selectedDate, 30);

    setSelectedDate(newDate);
    updateRange(newDate);
  };

  const handleNext = () => {
    const newDate = view === 'day' ? addDays(selectedDate, 1)
      : view === 'week' ? addDays(selectedDate, 7)
      : addDays(selectedDate, 30);

    setSelectedDate(newDate);
    updateRange(newDate);
  };

  const updateRange = (date: Date) => {
    if (!onRangeChange) return;

    const start = view === 'day' ? startOfDay(date)
      : view === 'week' ? startOfWeek(date)
      : startOfMonth(date);

    const end = view === 'day' ? endOfDay(date)
      : view === 'week' ? endOfWeek(date)
      : endOfMonth(date);

    onRangeChange(start, end);
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    onViewChange?.(newView);
    updateRange(selectedDate);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex space-x-1">
          <button
            onClick={() => handleViewChange('day')}
            className={cn(
              'px-3 py-1 text-sm rounded-md',
              view === 'day' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Day
          </button>
          <button
            onClick={() => handleViewChange('week')}
            className={cn(
              'px-3 py-1 text-sm rounded-md',
              view === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Week
          </button>
          <button
            onClick={() => handleViewChange('month')}
            className={cn(
              'px-3 py-1 text-sm rounded-md',
              view === 'month' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Month
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            className="p-2 hover:bg-muted rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-1 text-sm hover:bg-muted rounded-md"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="p-2 hover:bg-muted rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}