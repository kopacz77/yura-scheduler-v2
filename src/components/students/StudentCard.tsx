import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Student } from '@prisma/client';

interface StudentCardProps {
  student: Student & {
    user: {
      name: string;
    };
  };
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

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">
            {student.user.name}
          </h3>
          <Badge className={getSkatingLevelBadge(student.level)}>
            {student.level.toLowerCase()}
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