import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Appointment as AppointmentType } from '@/models/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, CreditCard, Edit2, User2 } from 'lucide-react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { cn, formatAppointmentTime, getLessonTypeColor } from '@/lib/utils';
import { useCalendar } from '@/contexts/PlannerContext';
import { Calendar } from '@/components/ui/calendar';

interface AppointmentProps {
  appointment: AppointmentType;
  resourceId: string;
  columnIndex: number;
}

export const Appointment: React.FC<AppointmentProps> = ({
  appointment,
  resourceId,
  columnIndex,
}) => {
  const { updateAppointment } = useCalendar();
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const element = ref.current!;
    return draggable({
      element,
      getInitialData: () => ({
        appointmentId: appointment.id,
        columnIndex: columnIndex,
        resourceId: resourceId,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [appointment.id, columnIndex, resourceId]);

  return (
    <Card
      ref={ref}
      className={cn(
        'hover:cursor-grab transform transition-all',
        isDragging ? 'cursor-grabbing opacity-50' : 'hover:scale-105',
        getLessonTypeColor(appointment.details.lessonType)
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
        <Badge
          variant="outline"
          className="truncate text-xs font-normal"
        >
          {appointment.details.lessonType}
        </Badge>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
      </CardHeader>
      <CardContent className="grid gap-1 p-2 pt-0 text-xs">
        <div className="flex items-center gap-1">
          <User2 className="h-3 w-3" />
          <span className="truncate">{appointment.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            {formatAppointmentTime(appointment.start)} - {formatAppointmentTime(appointment.end)}
          </span>
        </div>
        {appointment.details.paymentStatus && (
          <div className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            <Badge
              variant={appointment.details.paymentStatus === 'paid' ? 'success' : 'warning'}
              className="text-[10px]"
            >
              {appointment.details.paymentStatus}
            </Badge>
          </div>
        )}
      </CardContent>

      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Edit Appointment</h4>
            <div className="grid gap-2">
              {/* Add your edit form fields here */}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Card>
  );
};
