import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@prisma/client';
import { Progress } from '@/components/ui/progress';
import { Calendar } from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  upcomingLessons: number;
  completedLessons: number;
  totalLessons: number;
}

export function StudentDashboard({
  student,
  upcomingLessons,
  completedLessons,
  totalLessons,
}: StudentDashboardProps) {
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Lessons
                </p>
                <p className="text-2xl font-bold">{completedLessons}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Progress
                </p>
                <Progress value={progressPercentage} className="w-[200px]" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{upcomingLessons}</p>
              <p className="text-sm text-muted-foreground">scheduled lessons</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
