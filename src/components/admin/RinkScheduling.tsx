'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, PlusCircle, Settings2, Clock } from 'lucide-react';

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  rinkId: string;
  maxStudents: number;
  daysOfWeek: number[];
  isActive: boolean;
};

export function RinkScheduling() {
  const [selectedRink, setSelectedRink] = useState<string>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    startTime: '',
    endTime: '',
    maxStudents: 1,
    daysOfWeek: [],
    isActive: true,
  });

  const weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const handleAddTimeSlot = async () => {
    // Implement time slot addition logic
    setIsAddingSlot(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rink Schedule Management</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedRink} onValueChange={setSelectedRink}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Rink" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Rink</SelectItem>
                <SelectItem value="practice">Practice Rink</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAddingSlot(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {timeSlots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium mb-2">
                        {slot.startTime} - {slot.endTime}
                      </h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Max Students: {slot.maxStudents}</p>
                        <p>
                          Days: {slot.daysOfWeek.map(day => weekDays[day].label).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Switch
                        checked={slot.isActive}
                        onCheckedChange={() => {}}
                      />
                      <Button variant="ghost" size="sm">
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Time Slot</DialogTitle>
            <DialogDescription>
              Create a new recurring time slot for lessons.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStudents">Maximum Students</Label>
              <Input
                id="maxStudents"
                type="number"
                min={1}
                value={newSlot.maxStudents}
                onChange={(e) => setNewSlot({ ...newSlot, maxStudents: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="grid grid-cols-2 gap-2">
                {weekDays.map((day) => (
                  <Button
                    key={day.value}
                    variant={newSlot.daysOfWeek?.includes(day.value) ? 'default' : 'outline'}
                    onClick={() => {
                      const days = newSlot.daysOfWeek || [];
                      const updatedDays = days.includes(day.value)
                        ? days.filter(d => d !== day.value)
                        : [...days, day.value];
                      setNewSlot({ ...newSlot, daysOfWeek: updatedDays });
                    }}
                    className="w-full justify-start"
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newSlot.isActive}
                onCheckedChange={(checked) => setNewSlot({ ...newSlot, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddingSlot(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeSlot}>
              Add Time Slot
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}