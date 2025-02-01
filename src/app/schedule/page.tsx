'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { LessonDetails } from '@/components/schedule/LessonDetails';
import { RinkSelector } from '@/components/schedule/RinkSelector';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';
import { Lesson } from '@/types/schedule';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

export default function SchedulePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRink, setSelectedRink] = useState('');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  
  const {
    lessons,
    isLoading,
    error,
    fetchLessons
  } = useLessons();

  useEffect(() => {
    fetchLessons({
      rinkId: selectedRink || undefined,
      startDate: currentWeek,
      endDate: endOfWeek(currentWeek)
    });
  }, [fetchLessons, selectedRink, currentWeek]);

  const handleSlotSelect = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const filteredLessons = selectedRink
    ? lessons.filter(lesson => lesson.rinkId === selectedRink)
    : lessons;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Lesson Schedule</h1>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lesson
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <RinkSelector
          selectedRink={selectedRink}
          onRinkChange={setSelectedRink}
        />
        <div className="flex justify-end items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => handleWeekChange('prev')}
          >
            Previous Week
          </Button>
          <Button
            variant="outline"
            onClick={() => handleWeekChange('next')}
          >
            Next Week
          </Button>
        </div>
      </div>
      
      {/* Modals */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <ScheduleForm
            initialDate={selectedDate}
            onSchedule={() => {
              setIsFormOpen(false);
              setSelectedDate(null);
              fetchLessons({
                rinkId: selectedRink || undefined,
                startDate: currentWeek,
                endDate: endOfWeek(currentWeek)
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {selectedLesson && (
        <LessonDetails
          lesson={selectedLesson}
          isOpen={!!selectedLesson}
          onClose={() => {
            setSelectedLesson(null);
            fetchLessons({
              rinkId: selectedRink || undefined,
              startDate: currentWeek,
              endDate: endOfWeek(currentWeek)
            });
          }}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Error loading schedule</h3>
              <div className="mt-2 text-sm text-destructive/90">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[600px] bg-background/50 backdrop-blur-sm rounded-lg border">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading schedule...</p>
          </div>
        </div>
      ) : (
        <CalendarView
          currentWeek={currentWeek}
          lessons={filteredLessons}
          onSlotSelect={handleSlotSelect}
          onLessonSelect={handleLessonSelect}
        />
      )}
    </div>
  );
}
