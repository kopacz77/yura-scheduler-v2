'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RinkTimeSlot } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

interface EditSlotDialogProps {
  slot: RinkTimeSlot;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditSlotDialog({ slot, isOpen, onClose, onSave }: EditSlotDialogProps) {
  const [startTime, setStartTime] = useState(format(new Date(slot.startTime), 'HH:mm'));
  const [endTime, setEndTime] = useState(format(new Date(slot.endTime), 'HH:mm'));
  const [maxStudents, setMaxStudents] = useState(slot.maxStudents.toString());
  const [updateRecurring, setUpdateRecurring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStartTime(format(new Date(slot.startTime), 'HH:mm'));
      setEndTime(format(new Date(slot.endTime), 'HH:mm'));
      setMaxStudents(slot.maxStudents.toString());
      setUpdateRecurring(false);
    }
  }, [isOpen, slot]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const startDate = new Date(slot.startTime);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date(slot.endTime);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);

      const response = await fetch(`/api/schedule/slots/${slot.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          maxStudents: parseInt(maxStudents),
          updateRecurring,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast({
        title: 'Success',
        description: 'Slot updated successfully',
      });

      onSave();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update slot',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time Slot</DialogTitle>
          <DialogDescription>
            Make changes to this time slot. This will not affect any existing bookings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxStudents">Maximum Students</Label>
            <Input
              id="maxStudents"
              type="number"
              min="1"
              max="10"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
            />
          </div>

          {slot.recurringId && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="updateRecurring"
                checked={updateRecurring}
                onCheckedChange={(checked) => setUpdateRecurring(checked as boolean)}
              />
              <Label
                htmlFor="updateRecurring"
                className="text-sm font-normal">
                Update all future recurring slots
              </Label>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}