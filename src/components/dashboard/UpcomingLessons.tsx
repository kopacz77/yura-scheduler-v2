'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { getLessonTypeStyle } from '@/lib/styles';

async function fetchUpcomingLessons() {
  const response = await fetch('/api/lessons/upcoming');
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming lessons');
  }
  return response.json();
}

export function UpcomingLessons() {
  const { data: lessons, isLoading, error } = useQuery({
    queryKey: ['upcomingLessons'],
    queryFn: fetchUpcomingLessons,
  });

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Failed to load upcoming lessons
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons?.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No upcoming lessons
            </div>
          ) : (
            lessons?.map((lesson: any) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{lesson.student.user.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{format(new Date(lesson.startTime), 'h:mm a')}</span>
                    <span>•</span>
                    <span>{lesson.rink.name}</span>
                  </div>
                </div>
                <Badge className={getLessonTypeStyle(lesson.type)}>
                  {lesson.type.toLowerCase()}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}