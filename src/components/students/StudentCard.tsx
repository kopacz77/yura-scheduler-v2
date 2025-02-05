import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, CalendarPlus } from 'lucide-react';
import { Student, User } from '@prisma/client';

type StudentWithUser = Student & {
  user: Pick<User, 'name' | 'email'>;
};

interface StudentCardProps {
  student: StudentWithUser;
  onEdit?: (student: StudentWithUser) => void;
  onSchedule?: (student: StudentWithUser) => void;
}

const getSkatingLevelBadge = (level: string) => {
  switch (level) {
    case 'PRE_PRELIMINARY':
      return 'bg-blue-100 text-blue-800';
    case 'PRELIMINARY':
      return 'bg-green-100 text-green-800';
    case 'PRE_JUVENILE':
      return 'bg-yellow-100 text-yellow-800';
    case 'JUVENILE':
      return 'bg-orange-100 text-orange-800';
    case 'INTERMEDIATE':
      return 'bg-red-100 text-red-800';
    case 'NOVICE':
      return 'bg-purple-100 text-purple-800';
    case 'JUNIOR':
      return 'bg-pink-100 text-pink-800';
    case 'SENIOR':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return '';
  }
};

export function StudentCard({ student, onEdit, onSchedule }: StudentCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="absolute right-4 top-4 flex gap-2">
          {onSchedule && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onSchedule(student)}
            >
              <CalendarPlus className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(student)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">
            {student.user.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {student.user.email}
          </p>
          <Badge className={getSkatingLevelBadge(student.level)}>
            {student.level.replace('_', ' ').toLowerCase()}
          </Badge>
          {student.phone && (
            <p className="text-sm text-muted-foreground">
              {student.phone}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}