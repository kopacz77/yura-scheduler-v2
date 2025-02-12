import { useEffect, useState } from 'react';
import { Lesson, Student } from '@prisma/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type AppointmentWithStudent = Lesson & {
  student: Student & {
    user: {
      name: string | null;
      email: string;
    };
  };
};

export default function AppointmentsView() {
  const [appointments, setAppointments] = useState<AppointmentWithStudent[]>([]);

  useEffect(() => {
    // Fetch appointments...
  }, []);

  return (
    <div>
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <span>{appointment.student.user.name || 'Unnamed Student'}</span>
        </div>
      ))}
    </div>
  );
}