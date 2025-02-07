'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { SlotManagement } from '@/components/schedule/SlotManagement';
import { EditSlotDialog } from '@/components/schedule/EditSlotDialog';
import { RinkSelector } from '@/components/schedule/RinkSelector';
import { Button } from '@/components/ui/button';
import { CalendarDays, AlertCircle, Loader2 } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { Lesson, Rink, Student, User, RinkTimeSlot } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/use-toast';

type ScheduleData = {
  lessons: Array<Lesson & {
    student: Student & {
      user: User;
    };
  }>;
  timeSlots: Array<RinkTimeSlot & {
    rink: Rink;
  }>;
};

export default function AdminSchedulePage() {
  const [isSlotManagementOpen, setIsSlotManagementOpen] = useState(false);
  const [selectedRink, setSelectedRink] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date()));
  const [scheduleData, setScheduleData] = useState<ScheduleData>({ lessons: [], timeSlots: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<RinkTimeSlot | null>(null);

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
      console.log('Fetched schedule data:', data);
      setScheduleData(data);
    } catch (err) {
      console.error('Schedule fetch error:', err);
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

  const handleSlotSave = async (data: any) => {
    try {
      const response = await fetch('/api/schedule/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      await fetchSchedule();
      toast({
        title: 'Success',
        description: 'Time slot created successfully',
      });
      setIsSlotManagementOpen(false);
    } catch (error) {
      console.error('Slot creation error:', error);
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
            onRefresh={fetchSchedule}
            onEditSlot={setSelectedSlot}
          />
        )}
      </div>

      <SlotManagement
        isOpen={isSlotManagementOpen}
        onClose={() => setIsSlotManagementOpen(false)}
        onSave={handleSlotSave}
      />

      {selectedSlot && (
        <EditSlotDialog
          slot={selectedSlot}
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSave={fetchSchedule}
        />
      )}
    </div>
  );
}