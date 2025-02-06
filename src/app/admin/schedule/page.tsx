'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { LessonDetails } from '@/components/schedule/LessonDetails';
import { RinkSelector } from '@/components/schedule/RinkSelector';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { Lesson, Rink, Student, User } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';

type LessonWithRelations = Lesson & {
  student: Student & {
    user: User;
  };
  rink: Rink;
};

export default function AdminSchedulePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithRelations | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRink, setSelectedRink] = useState('');
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [lessons, setLessons] = useState<Array<Lesson & { 
    student: { 
      user: { 
        name: string | null 
      } 
    } 
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/lessons?${new URLSearchParams({
        startDate: currentWeek.toISOString(),
        endDate: endOfWeek(currentWeek).toISOString(),
        ...(selectedRink ? { rinkId: selectedRink } : {})
      })}`);
      
      if (!response.ok) throw new Error('Failed to fetch lessons');
      
      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessonDetails = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) throw new Error('Failed to fetch lesson details');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching lesson details:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [currentWeek, selectedRink]);

  const handleSlotSelect = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  const handleLessonSelect = async (lesson: Lesson) => {
    const details = await fetchLessonDetails(lesson.id);
    if (details) {
      setSelectedLesson(details);
    }
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  return (
    <div className="space-y-8 p-8">
      <PageHeader 
        title="Schedule Management"
        description="View and manage lesson schedules"
      />
      
      <div className="space-y-6">
        {/* Control Bar */}
        <div className="flex justify-between items-center">
          <RinkSelector
            selectedRink={selectedRink}
            onRinkChange={setSelectedRink}
          />
          <div className="flex items-center space-x-4">
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
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Lesson
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error loading schedule</h3>
                <div className="mt-2 text-sm text-destructive/90">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
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
            lessons={lessons}
            onSlotSelect={handleSlotSelect}
            onLessonSelect={handleLessonSelect}
          />
        )}
      </div>

      {/* Modals */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <ScheduleForm
            initialDate={selectedDate}
            onSchedule={() => {
              setIsFormOpen(false);
              setSelectedDate(null);
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
            fetchLessons();
          }}
        />
      )}
    </div>
  );
}