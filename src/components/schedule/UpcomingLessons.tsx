'use client';

import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  startTime: string;
  endTime: string;
  rink: {
    name: string;
    address: string;
  };
}

async function fetchUpcomingLessons(studentId: string) {
  const response = await fetch(`/api/students/${studentId}/lessons/upcoming`);
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming lessons');
  }
  return response.json();
}

export function UpcomingLessons() {
  const { data: session } = useSession();

  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ['upcomingLessons', session?.user?.id],
    queryFn: () => fetchUpcomingLessons(session?.user?.id as string),
    enabled: !!session?.user?.id,
    onError: (error) => {
      toast.error('Failed to load upcoming lessons');
      console.error('Lessons fetch error:', error);
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (!lessons?.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No upcoming lessons scheduled
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(lesson.startTime), 'EEEE, MMMM do')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(lesson.startTime), 'h:mm a')} - 
                    {format(new Date(lesson.endTime), 'h:mm a')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{lesson.rink.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {lesson.rink.address}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
