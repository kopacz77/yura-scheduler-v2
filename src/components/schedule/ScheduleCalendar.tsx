'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addDays, format } from 'date-fns';

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

export function ScheduleCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // This would come from your API
  const timeSlots: TimeSlot[] = [
    { id: '1', startTime: '09:00', endTime: '10:00', available: true },
    { id: '2', startTime: '10:00', endTime: '11:00', available: false },
    { id: '3', startTime: '11:00', endTime: '12:00', available: true },
    // Add more time slots
  ];

  const handleBookLesson = async () => {
    // Implement booking logic
    setIsBookingOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
            />
            
            <div className="space-y-4">
              <h4 className="font-medium">Available Time Slots</h4>
              {date && timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <span>
                    {slot.startTime} - {slot.endTime}
                  </span>
                  <Button
                    onClick={() => {
                      setSelectedTimeSlot(slot.id);
                      setIsBookingOpen(true);
                    }}
                    disabled={!slot.available}
                  >
                    {slot.available ? 'Book' : 'Unavailable'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Lesson</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                value={date ? format(date, 'PPP') : ''}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rink" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Rink</SelectItem>
                  <SelectItem value="practice">Practice Rink</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Focus Areas</Label>
              <Input placeholder="e.g., Spins, Jumps, Footwork" />
            </div>
            <Button onClick={handleBookLesson} className="w-full">
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}