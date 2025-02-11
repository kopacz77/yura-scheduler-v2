import { Appointment } from '@/types/schedule';

// Update the Appointment access to use studentId directly
// since we know it exists in our Schedule type
export function processNotification(appointment: Appointment) {
  return {
    userId: appointment.studentId, // Now valid because we've updated the type
    // Rest of the function...
  };
}