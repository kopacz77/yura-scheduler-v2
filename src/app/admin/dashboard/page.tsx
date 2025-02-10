'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats/overview');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const { data: upcomingLessons } = useQuery({
    queryKey: ['upcoming-lessons'],
    queryFn: async () => {
      const response = await fetch('/api/lessons/upcoming');
      if (!response.ok) throw new Error('Failed to fetch upcoming lessons');
      return response.json();
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your skating school</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newStudents || 0} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.activeStudentsChange || 0} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.revenue?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +${stats?.revenueChange?.toFixed(2) || '0.00'} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <Icons.check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedLessons || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.completedLessonsChange || 0} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Student Level Distribution Chart */}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLessons?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming lessons scheduled
                </p>
              ) : (
                upcomingLessons?.map((lesson: any) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium">
                          {lesson.student.user.name}
                        </p>
                        <div className="flex items-center pt-1">
                          <Icons.clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(lesson.startTime), 'h:mm a')}
                          </span>
                          <span className="px-1 text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {lesson.rink.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs ${getLessonTypeColor(lesson.type)}`}
                    >
                      {formatLessonType(lesson.type)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getLessonTypeColor(type: string) {
  switch (type) {
    case 'PRIVATE':
      return 'text-blue-600';
    case 'GROUP':
      return 'text-green-600';
    case 'CHOREOGRAPHY':
      return 'text-purple-600';
    case 'COMPETITION_PREP':
      return 'text-amber-600';
    default:
      return 'text-muted-foreground';
  }
}

function formatLessonType(type: string) {
  return type.toLowerCase().replace('_', ' ');
}
