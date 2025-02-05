'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSchedule } from '@/hooks/useSchedule';
import { Clock, User, MapPin } from 'lucide-react';

type DaySchedule = {
  date: Date;
  lessons: Array<{
    id: string;
    startTime: Date;
    endTime: Date;
    studentName: string;
    rinkName: string;
    status: string;
  }>;
};

export function ScheduleOverview() {
  const [isLoading, setIsLoading] = useState(true);
  const [todaySchedule, setTodaySchedule] = useState<DaySchedule | null>(null);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setTodaySchedule({
        date: new Date(),
        lessons: [
          {
            id: '1',
            startTime: new Date('2024-02-03T15:00:00'),
            endTime: new Date('2024-02-03T16:00:00'),
            studentName: 'John Doe',
            rinkName: 'Main Rink',
            status: 'SCHEDULED',
          }
        ],
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!todaySchedule?.lessons.length) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center text-center">
        <p className="text-muted-foreground">No lessons scheduled for today</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Today - {format(todaySchedule.date, 'EEEE, MMMM d')}
        </h3>
      </div>

      <div className="space-y-4">
        {todaySchedule.lessons
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
          .map((lesson) => (
            <Card key={lesson.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(lesson.startTime, 'h:mm a')} -{' '}
                        {format(lesson.endTime, 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{lesson.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{lesson.rinkName}</span>
                    </div>
                  </div>
                  <Badge
                    variant={lesson.status === 'SCHEDULED' ? 'default' : 'secondary'}
                  >
                    {lesson.status.toLowerCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}