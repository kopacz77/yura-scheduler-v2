'use client';

import * as React from 'react';
import { useCalendar } from '@/contexts/PlannerContext';
import { format } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export function PlannerToolbar() {
  const { 
    viewMode, 
    setViewMode,
    selectedDate,
    setSelectedDate,
    dateRange
  } = useCalendar();

  const handlePrevious = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const formatDateRange = () => {
    if (!dateRange?.start || !dateRange?.end) return '';
    
    if (viewMode === 'day') {
      return format(dateRange.start, 'MMMM d, yyyy');
    }
    
    if (viewMode === 'week') {
      return `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
    }
    
    return format(dateRange.start, 'MMMM yyyy');
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
        >
          Today
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {formatDateRange()}
          </span>
        </div>
      </div>

      <Select
        value={viewMode}
        onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}