import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, Star } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: string;
  joinedDate: string;
  totalLessons: number;
  upcomingLessons: number;
  averageRating: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

interface StudentProfileProps {
  student: Student;
}

export function StudentProfile({ student }: StudentProfileProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="h-20 w-20">
            <span className="text-2xl">{student.name.split(' ').map(n => n[0]).join('')}</span>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.email}</p>
            <div className="mt-2 flex items-center space-x-2">
              <Badge>{student.level}</Badge>
              <Badge variant="outline">{student.paymentStatus}</Badge>
            </div>
          </div>
          <Button>Schedule Lesson</Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.totalLessons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.upcomingLessons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.averageRating}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{student.paymentStatus}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}