'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { SlotManagement } from '@/components/schedule/SlotManagement';
import { LessonDetails } from '@/components/schedule/LessonDetails';
import { RinkSelector } from '@/components/schedule/RinkSelector';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, AlertCircle, Loader2 } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { Lesson, Rink, Student, User } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/use-toast';

type LessonWithRelations = Lesson & {
  student: Student & {
    user: User;
  };
  rink: Rink;
};

export default function AdminSchedulePage() {
  const [isSlotManagementOpen, setIsSlotManagementOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<LessonWithRelations | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRink, setSelectedRink] = useState('all');
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

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
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
      setLessons(data.lessons);
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

  useEffect(() => {
    fetchSchedule();
  }, [currentWeek, selectedRink]);

  const handleSlotSelect = (date: Date) => {
    setSelectedDate(date);
    setIsSlotManagementOpen(true);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
    );
  };

  const handleSaveSlot = async (data: any) => {
    try {
      const response = await fetch('/api/schedule/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create slot');
      }

      toast({
        title: 'Success',
        description: 'Time slot(s) created successfully',
      });

      setIsSlotManagementOpen(false);
      await fetchSchedule();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create slot',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <PageHeader 
        title="Schedule Management"
        description="Manage time slots and lesson schedules"
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
            <Button 
              onClick={() => setIsSlotManagementOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Manage Slots
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
          />
        )}
      </div>

      {/* Slot Management Modal */}
      <SlotManagement
        isOpen={isSlotManagementOpen}
        onClose={() => setIsSlotManagementOpen(false)}
        onSave={handleSaveSlot}
        initialDate={selectedDate}
      />

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <LessonDetails
          lesson={selectedLesson}
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}