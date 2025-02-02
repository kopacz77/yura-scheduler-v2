'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { ListSkeleton } from '@/components/ui/loading-states';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

type Lesson = {
  id: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  coach: string;
  focus: string;
};

export function UpcomingLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API call later
        const mockData = [
          {
            id: '1',
            date: '2024-02-05',
            time: '10:00',
            duration: 60,
            location: 'Main Rink',
            coach: 'Yura Min',
            focus: 'Spins and Jumps',
          },
          {
            id: '2',
            date: '2024-02-07',
            time: '14:00',
            duration: 45,
            location: 'Practice Rink',
            coach: 'Yura Min',
            focus: 'Footwork Sequence',
          },
        ];
        setLessons(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ListSkeleton />;

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(parseISO(lesson.date), 'MMMM d, yyyy')}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{lesson.time} ({lesson.duration} mins)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{lesson.location}</span>
              </div>
              <div>
                <h4 className="font-medium">Focus Areas</h4>
                <p className="text-sm text-muted-foreground">{lesson.focus}</p>
              </div>
            </div>
            <Button variant="outline" className="ml-4">
              View Details
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
