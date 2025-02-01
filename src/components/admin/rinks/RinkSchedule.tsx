import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  daysOfWeek: number[];
}

interface RinkScheduleProps {
  rinkId: string;
  timeSlots: TimeSlot[];
  onAddTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => Promise<void>;
  onDeleteTimeSlot: (timeSlotId: string) => Promise<void>;
}

export function RinkSchedule({
  rinkId,
  timeSlots,
  onAddTimeSlot,
  onDeleteTimeSlot,
}: RinkScheduleProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [newTimeSlot, setNewTimeSlot] = React.useState({
    startTime: '09:00',
    endTime: '10:00',
    maxStudents: 1,
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddTimeSlot = async () => {
    await onAddTimeSlot(newTimeSlot);
    // Reset form
    setNewTimeSlot({
      startTime: '09:00',
      endTime: '10:00',
      maxStudents: 1,
      daysOfWeek: [1, 2, 3, 4, 5],
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="availability">Add Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {slot.daysOfWeek
                          .map((day) => daysOfWeek[day])
                          .join(', ')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Max {slot.maxStudents} student{slot.maxStudents > 1 ? 's' : ''}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTimeSlot(slot.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Time Slot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newTimeSlot.startTime}
                      onChange={(e) =>
                        setNewTimeSlot((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newTimeSlot.endTime}
                      onChange={(e) =>
                        setNewTimeSlot((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Students</Label>
                  <Select
                    value={String(newTimeSlot.maxStudents)}
                    onValueChange={(value) =>
                      setNewTimeSlot((prev) => ({
                        ...prev,
                        maxStudents: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num} student{num > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day, index) => (
                      <Button
                        key={index}
                        variant={newTimeSlot.daysOfWeek.includes(index) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setNewTimeSlot((prev) => ({
                            ...prev,
                            daysOfWeek: prev.daysOfWeek.includes(index)
                              ? prev.daysOfWeek.filter((d) => d !== index)
                              : [...prev.daysOfWeek, index].sort(),
                          }))
                        }
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddTimeSlot} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
