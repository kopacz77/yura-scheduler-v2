import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

interface TopStudent {
  id: string;
  name: string;
  email: string;
  lessonsCount: number;
}

interface TopStudentsCardProps {
  students: TopStudent[];
}

export function TopStudentsCard({ students }: TopStudentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Students This Month
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {students.map((student, index) => {
            const initial = student.name.charAt(0).toUpperCase();
            const ranking = index + 1;
            const medalColor = ranking === 1 
              ? 'text-yellow-500' 
              : ranking === 2 
              ? 'text-gray-400' 
              : ranking === 3 
              ? 'text-amber-600'
              : 'text-muted-foreground';

            return (
              <div key={student.id} className="flex items-center gap-4">
                <div className={`font-bold ${medalColor}`}>#{ranking}</div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
                <div className="text-sm font-medium">
                  {student.lessonsCount} lessons
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
