'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { TimeSlot, LessonWithRelations } from '@/types/schedule';
import { Button } from '@/components/ui/button';
import { StudentWithUser } from '@/types/student';

type EnhancedLesson = LessonWithRelations & { student: StudentWithUser };

interface UseScheduleData {
  lessons: EnhancedLesson[];
  timeSlots: TimeSlot[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

// Mock data hook - replace with your actual data fetching logic
function useScheduleData(): UseScheduleData {
  return {
    lessons: [],
    timeSlots: [],
    isLoading: false,
    refetch: async () => {}
  };
}

export default function SchedulePage() {
  const { lessons, timeSlots, isLoading, refetch } = useScheduleData();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const handleEditSlot = () => {
    // Implement slot editing logic
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <Button onClick={refetch} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <CalendarView
        lessons={lessons}
        timeSlots={timeSlots}
        onEditSlot={handleEditSlot}
        initialWeek={currentWeek}
      />
    </div>
  );
}