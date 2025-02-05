import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Appointment as AppointmentType } from '@/models/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit2, User2 } from 'lucide-react';
import { cn, formatAppointmentTime, getLessonTypeColor } from '@/lib/utils';
import { useCalendar } from '@/contexts/PlannerContext';
import { PaymentDialog } from '../payments/PaymentDialog';
import { PaymentStatusBadge } from '../payments/PaymentStatusBadge';
import { PaymentHistory } from '../payments/PaymentHistory';
import { usePayments } from '@/hooks/usePayments';

interface AppointmentProps {
  appointment: AppointmentType;
  resourceId: string;
  columnIndex: number;
}

export function Appointment({ appointment, resourceId, columnIndex }: AppointmentProps) {
  const { updateAppointment } = useCalendar();
  const { recordPayment, isLoading } = usePayments();
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const handlePaymentSubmit = async (data: any) => {
    try {
      await recordPayment(appointment.id, data);
      // Optionally refresh the appointment data here
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
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
        <div className="flex gap-1">
          {appointment.payment && (
            <PaymentStatusBadge status={appointment.payment.status} />
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Edit2 className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Lesson Details</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      <span>{appointment.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}
                      </span>
                    </div>
                    {appointment.details.notes && (
                      <div className="text-sm text-muted-foreground">
                        {appointment.details.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Payment</h4>
                  {!appointment.payment ? (
                    <PaymentDialog
                      appointmentId={appointment.id}
                      studentName={appointment.title}
                      amount={75} // Make this dynamic based on lesson type
                      onPaymentUpdate={handlePaymentSubmit}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentHistory(true)}
                    >
                      View Payment History
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
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
      </CardContent>
    </Card>
  );
}