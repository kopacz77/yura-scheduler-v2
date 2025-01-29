import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { getLessonTypeColor } from '@/lib/utils';

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
              <Badge className={getLessonTypeColor(lesson.type)}>
                {lesson.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
