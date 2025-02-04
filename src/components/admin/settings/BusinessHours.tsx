'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type BusinessHour = {
  day: string;
  open: string;
  close: string;
};

export function BusinessHours() {
  const [hours, setHours] = useState<BusinessHour[]>([
    { day: 'Monday', open: '09:00', close: '17:00' },
    { day: 'Tuesday', open: '09:00', close: '17:00' },
    { day: 'Wednesday', open: '09:00', close: '17:00' },
    { day: 'Thursday', open: '09:00', close: '17:00' },
    { day: 'Friday', open: '09:00', close: '17:00' },
    { day: 'Saturday', open: '10:00', close: '15:00' },
    { day: 'Sunday', open: 'Closed', close: 'Closed' },
  ]);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving business hours:', hours);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hours.map((hour, index) => (
            <div key={hour.day} className="flex items-center gap-4">
              <span className="w-24">{hour.day}</span>
              <Input
                type="time"
                value={hour.open}
                onChange={(e) => {
                  const newHours = [...hours];
                  newHours[index].open = e.target.value;
                  setHours(newHours);
                }}
                disabled={hour.day === 'Sunday'}
              />
              <span>to</span>
              <Input
                type="time"
                value={hour.close}
                onChange={(e) => {
                  const newHours = [...hours];
                  newHours[index].close = e.target.value;
                  setHours(newHours);
                }}
                disabled={hour.day === 'Sunday'}
              />
            </div>
          ))}
          <Button onClick={handleSave} className="mt-4">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}