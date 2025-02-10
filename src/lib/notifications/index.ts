import { format } from 'date-fns';
import { utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import { Appointment } from '@/types/domain';

// Notification formatting
export function formatNotificationDate(date: Date, timeZone: string): string {
  const zonedDate = utcToZonedTime(date, timeZone);
  return formatInTimeZone(zonedDate, timeZone, 'PPpp');
}

// Notification scheduling
export interface NotificationSchedule {
  userId: string;
  appointmentId: string;
  type: 'reminder' | 'confirmation' | 'cancellation';
  sendAt: Date;
}

export interface NotificationSettings {
  reminderHours: number;
  confirmationDays: number;
  timezone: string;
}

export function scheduleAppointmentNotifications(
  appointment: Appointment,
  settings: NotificationSettings
): NotificationSchedule[] {
  const notifications: NotificationSchedule[] = [];
  const appointmentDate = new Date(appointment.start);

  // Reminder notification
  if (settings.reminderHours > 0) {
    const reminderTime = new Date(appointmentDate);
    reminderTime.setHours(reminderTime.getHours() - settings.reminderHours);

    if (reminderTime > new Date()) {
      notifications.push({
        userId: appointment.studentId,
        appointmentId: appointment.id,
        type: 'reminder',
        sendAt: reminderTime
      });
    }
  }

  // Confirmation notification
  if (settings.confirmationDays > 0) {
    const confirmationTime = new Date(appointmentDate);
    confirmationTime.setDate(confirmationTime.getDate() - settings.confirmationDays);

    if (confirmationTime > new Date()) {
      notifications.push({
        userId: appointment.studentId,
        appointmentId: appointment.id,
        type: 'confirmation',
        sendAt: confirmationTime
      });
    }
  }

  return notifications;
}

export function rescheduleNotifications(
  appointment: Appointment,
  existingNotifications: NotificationSchedule[],
  settings: NotificationSettings
): {
  toDelete: string[];
  toCreate: NotificationSchedule[];
} {
  const currentNotifications = existingNotifications.filter(
    n => n.appointmentId === appointment.id
  );
  const newNotifications = scheduleAppointmentNotifications(appointment, settings);

  return {
    toDelete: currentNotifications.map(n => n.appointmentId),
    toCreate: newNotifications
  };
}

export function cancelNotifications(
  appointmentId: string,
  cancelReason?: string
): NotificationSchedule {
  return {
    userId: 'admin', // Admin will be notified of cancellations
    appointmentId,
    type: 'cancellation',
    sendAt: new Date(), // Send immediately
  };
}
