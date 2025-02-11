'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TimeSlot } from '@/types/schedule';
import { format, parseISO } from 'date-fns';
import * as z from 'zod';

const editSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  maxStudents: z.number().min(1),
  isActive: z.boolean(),
  updateRecurring: z.boolean().optional(),
});

type FormData = z.infer<typeof editSlotSchema>;

interface EditSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
  onSubmit: (data: FormData) => Promise<void>;
}

export function EditSlotDialog({ isOpen, onClose, slot, onSubmit }: EditSlotDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateRecurring, setUpdateRecurring] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(editSlotSchema),
    defaultValues: {
      startTime: format(parseISO(slot.startTime), 'HH:mm'),
      endTime: format(parseISO(slot.endTime), 'HH:mm'),
      maxStudents: slot.maxStudents,
      isActive: slot.isActive,
      updateRecurring: false,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Failed to update time slot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time Slot</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxStudents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Students</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field: { value, onChange } }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch checked={value} onCheckedChange={onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="updateRecurring"
              render={({ field: { value, onChange } }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Update Recurring Slots</FormLabel>
                  <FormControl>
                    <Switch checked={value} onCheckedChange={onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}