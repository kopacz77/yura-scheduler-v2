'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { TimeSlotForm } from './TimeSlotForm';
import { type TimeSlot } from '@/lib/actions/rinks';

interface RinkScheduleProps {
  rinkId: string;
  timeSlots: TimeSlot[];
  onAddTimeSlot: (data: Omit<TimeSlot, 'id'>) => Promise<void>;
  onDeleteTimeSlot: (id: string) => Promise<void>;
}

export function RinkSchedule({
  rinkId,
  timeSlots,
  onAddTimeSlot,
  onDeleteTimeSlot,
}: RinkScheduleProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTimeSlot = async (data: Omit<TimeSlot, 'id'>) => {
    try {
      setIsLoading(true);
      await onAddTimeSlot(data);
      setIsAddDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    try {
      setIsLoading(true);
      await onDeleteTimeSlot(id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Time Slots</CardTitle>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size="sm"
            className="h-8"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Slot
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {timeSlots.map((slot) => (
                <Card key={slot.id} className="bg-muted/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {format(new Date(`2000-01-01T${slot.startTime}`), 'h:mm a')} - 
                        {format(new Date(`2000-01-01T${slot.endTime}`), 'h:mm a')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max Students: {slot.maxStudents}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeleteTimeSlot(slot.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
          </DialogHeader>
          <TimeSlotForm 
            onSubmit={handleAddTimeSlot}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}