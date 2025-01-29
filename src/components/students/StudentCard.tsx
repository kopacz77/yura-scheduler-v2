import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { Student } from '@prisma/client';
import { getSkatingLevelBadge } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onSchedule: (student: Student) => void;
}

export function StudentCard({ student, onEdit, onSchedule }: StudentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">
            {student.name}
          </h3>
          <Badge className={getSkatingLevelBadge(student.level)}>
            {student.level.toLowerCase()}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onSchedule(student)}>
            <Clock className="mr-1 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
            Edit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{student.email}</span>
        </div>
        {student.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{student.phone}</span>
          </div>
        )}
        {student.emergencyName && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <span>
              Emergency: {student.emergencyName} ({student.emergencyPhone})
            </span>
          </div>
        )}
        {student.notes && (
          <p className="text-muted-foreground mt-2 text-sm">
            {student.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
