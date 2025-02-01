'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { LessonDetails } from '@/components/schedule/LessonDetails';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';
import { Lesson } from '@/types/schedule';
import { startOfWeek, endOfWeek } from 'date-fns';

export default function SchedulePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const {
    lessons,
    isLoading,
    error,
    fetchLessons
  } = useLessons();

  useEffect(() => {
    const currentWeek = startOfWeek(new Date());
    fetchLessons({
      startDate: currentWeek,
      endDate: endOfWeek(currentWeek)
    });
  }, [fetchLessons]);

  const handleSlotSelect = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Lesson Schedule</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Lesson
        </Button>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <ScheduleForm
            initialDate={selectedDate}
            onSchedule={() => {
              setIsFormOpen(false);
              setSelectedDate(null);
              // Refresh lessons
              fetchLessons();
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
            // Refresh lessons
            fetchLessons();
          }}
        />
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading schedule</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CalendarView
          lessons={lessons}
          onSlotSelect={handleSlotSelect}
          onLessonSelect={handleLessonSelect}
        />
      )}
    </div>
  );
}
