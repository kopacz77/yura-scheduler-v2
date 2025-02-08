'use client';

import { useState, useCallback } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { LessonDetails } from '@/components/schedule/LessonDetails';
import { RinkSelector } from '@/components/schedule/RinkSelector';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { Lesson, Student, User, Rink, Level } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

type LessonWithRelations = Lesson & {
  student: Student & {
    user: {
      name: string | null;
    };
  };
  rink: Rink;
};

type ScheduleData = {
  lessons: LessonWithRelations[];
  timeSlots: any[];
};

export default function SchedulePage() {
  const router = useRouter();
  const [selectedRink, setSelectedRink] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));
  const [scheduleData, setScheduleData] = useState<ScheduleData>({ lessons: [], timeSlots: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithRelations | null>(null);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        startDate: currentWeek.toISOString(),
        endDate: endOfWeek(currentWeek).toISOString(),
      });
      
      if (selectedRink !== 'all') {
        params.append('rinkId', selectedRink);
      }
      
      const response = await fetch(`/api/schedule?${params}`);
      if (!response.ok) throw new Error('Failed to fetch schedule');
      
      const data = await response.json();
      setScheduleData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedule');
      toast({
        title: 'Error',
        description: 'Failed to load schedule',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const handleLessonSelect = async (lesson: LessonWithRelations) => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`);
      if (!response.ok) throw new Error('Failed to fetch lesson details');
      
      const lessonDetails: LessonWithRelations = await response.json();
      setSelectedLesson(lessonDetails);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load lesson details',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <PageHeader 
        title="Schedule"
        description="View and manage your lesson schedule"
      />
      
      <div className="space-y-6">
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
          </div>
        </div>

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
            lessons={scheduleData.lessons}
            timeSlots={scheduleData.timeSlots}
            onEditSlot={() => {}}
            onRefresh={fetchSchedule}
          />
        )}
      </div>

      {selectedLesson && (
        <LessonDetails
          lesson={selectedLesson as any} // Temporary type cast while we update LessonDetails component
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}