import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { LessonType, RinkArea } from '@prisma/client';

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: AppointmentFormData) => void;
  initialDate?: Date;
  existingAppointment?: any; // Replace with proper type
}

export interface AppointmentFormData {
  title: string;
  start: Date;
  end: Date;
  lessonType: LessonType;
  resourceId: string;
  notes?: string;
  isRecurring: boolean;
  recurrenceEndDate?: Date;
  recurrencePattern?: 'weekly' | 'biweekly';
}

export function AppointmentDialog({
  isOpen,
  onClose,
  onSave,
  initialDate,
  existingAppointment
}: AppointmentDialogProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: existingAppointment?.title || '',
    start: existingAppointment?.start || initialDate || new Date(),
    end: existingAppointment?.end || new Date(new Date().setHours(new Date().getHours() + 1)),
    lessonType: existingAppointment?.lessonType || LessonType.PRIVATE,
    resourceId: existingAppointment?.resourceId || '',
    notes: existingAppointment?.notes || '',
    isRecurring: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingAppointment ? 'Edit Appointment' : 'Create Appointment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={format(formData.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={format(formData.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lessonType">Lesson Type</Label>
            <Select
              value={formData.lessonType}
              onValueChange={(value: LessonType) => setFormData({ ...formData, lessonType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LessonType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource">Rink Area</Label>
            <Select
              value={formData.resourceId}
              onValueChange={(value) => setFormData({ ...formData, resourceId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rink area" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RinkArea).map((area) => (
                  <SelectItem key={area} value={area}>
                    {area.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isRecurring}
              onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
            />
            <Label>Recurring Lesson</Label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                <Select
                  value={formData.recurrencePattern}
                  onValueChange={(value: 'weekly' | 'biweekly') =>
                    setFormData({ ...formData, recurrencePattern: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurrenceEnd">End Date</Label>
                <Input
                  id="recurrenceEnd"
                  type="date"
                  value={formData.recurrenceEndDate ? format(formData.recurrenceEndDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) =>
                    setFormData({ ...formData, recurrenceEndDate: new Date(e.target.value) })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit">
              {existingAppointment ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
