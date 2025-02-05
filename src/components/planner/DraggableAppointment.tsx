'use client';

import { useDraggable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLessonTypeColor, cn } from '@/lib/utils';
import type { Appointment } from '@/models/types';

interface DraggableAppointmentProps {
  appointment: Appointment;
}

export function DraggableAppointment({
  appointment
}: DraggableAppointmentProps) {
  const {attributes, listeners, setNodeRef, isDragging} = useDraggable({
    id: appointment.id,
    data: appointment
  });

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab transition-all',
        isDragging && 'opacity-50 scale-105 cursor-grabbing',
        getLessonTypeColor(appointment.details.lessonType)
      )}
    >
      <CardHeader className="p-2">
        <Badge variant="outline" className="w-fit">
          {appointment.details.lessonType}
        </Badge>
      </CardHeader>
      <CardContent className="p-2 pt-0 text-sm">
        <div>{appointment.title}</div>
        <div className="text-xs text-muted-foreground">
          {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}
        </div>
      </CardContent>
    </Card>
  );
}