'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { LessonWithRelations } from '@/types/schedule';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingLessons() {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<LessonWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch('/api/lessons/upcoming');
        if (!response.ok) throw new Error('Failed to fetch lessons');
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching upcoming lessons:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLessons();
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {lessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming lessons</p>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson.id} className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {session?.user.role === 'ADMIN'
                        ? lesson.student.user.name
                        : format(new Date(lesson.startTime), 'EEEE, MMMM d')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(lesson.startTime), 'h:mm a')} -{' '}
                      {format(new Date(lesson.endTime), 'h:mm a')}
                    </span>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(lesson.status)}>
                    {lesson.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {lesson.rink.name} - {lesson.area.replace('_', ' ')}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
