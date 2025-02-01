'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/schedule/CalendarView';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Lesson } from '@/types/schedule';

export default function SchedulePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // TODO: Replace with actual API call
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const handleSlotSelect = (date: Date) => {
    setSelectedDate(date);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Lesson Schedule</h1>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <ScheduleForm
            initialDate={selectedDate}
            onSchedule={(lesson) => {
              setLessons(prev => [...prev, lesson]);
              setIsFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <CalendarView
        lessons={lessons}
        onSlotSelect={handleSlotSelect}
      />
    </div>
  );
}
