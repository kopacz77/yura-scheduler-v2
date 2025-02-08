'use client';

import { format } from 'date-fns';
import { Lesson, Student, User, Rink } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type LessonWithRelations = Lesson & {
  student: Student & {
    user: {
      name: string | null;
    };
  };
  rink: Rink;
};

interface LessonDetailsProps {
  lesson: LessonWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonDetails({ lesson, isOpen, onClose }: LessonDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lesson Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Student</h3>
            <p>{lesson.student.user.name || 'Unnamed Student'}</p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Time</h3>
            <p>
              {format(new Date(lesson.startTime), 'MMMM d, yyyy h:mm a')} -
              {format(new Date(lesson.endTime), ' h:mm a')}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Location</h3>
            <p>{lesson.rink.name}</p>
            <p className="text-sm text-muted-foreground">{lesson.rink.address}</p>
          </div>
          {lesson.notes && (
            <div>
              <h3 className="font-medium mb-1">Notes</h3>
              <p>{lesson.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}