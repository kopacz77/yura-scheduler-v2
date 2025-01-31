'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Define lesson type colors locally for now
const getLessonTypeStyle = (type: string): string => {
  const styles: Record<string, string> = {
    'private': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'choreography': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'competition-prep': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'group': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'seminar': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return styles[type.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

export function UpcomingLessons() {
  // This will be replaced with real data from the API
  const upcomingLessons = [
    {
      id: 1,
      student: 'Sarah Chen',
      time: new Date(2025, 0, 29, 14, 0), // 2pm
      type: 'private',
      rinkArea: 'Main Rink',
    },
    {
      id: 2,
      student: 'Michael Kim',
      time: new Date(2025, 0, 29, 15, 30), // 3:30pm
      type: 'choreography',
      rinkArea: 'Practice Rink',
    },
    {
      id: 3,
      student: 'Emily Taylor',
      time: new Date(2025, 0, 29, 16, 45), // 4:45pm
      type: 'competition-prep',
      rinkArea: 'Main Rink',
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="font-medium">{lesson.student}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{format(lesson.time, 'h:mm a')}</span>
                  <span>•</span>
                  <span>{lesson.rinkArea}</span>
                </div>
              </div>
              <Badge className={getLessonTypeStyle(lesson.type)}>
                {lesson.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}