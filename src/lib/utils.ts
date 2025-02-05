import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addMinutes, setMinutes, setHours, addDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getSkatingLevelBadge(level: string) {
  const badges = {
    'Beginner': 'bg-blue-100 text-blue-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-green-100 text-green-800',
  };
  return badges[level] || 'bg-gray-100 text-gray-800';
}

export function formatAppointmentTime(date: Date | string) {
  return format(new Date(date), 'h:mm a');
}

export function getLessonTypeColor(type: string) {
  const colors = {
    'PRIVATE': 'bg-blue-50 border-blue-200',
    'GROUP': 'bg-green-50 border-green-200',
    'CHOREOGRAPHY': 'bg-purple-50 border-purple-200',
    'COMPETITION_PREP': 'bg-orange-50 border-orange-200',
  };
  return colors[type] || 'bg-gray-50 border-gray-200';
}

export function calculateNewDates(date: Date, time: string, duration: number) {
  const [hours, minutes] = time.split(':').map(Number);
  const start = setMinutes(setHours(date, hours), minutes);
  const end = addMinutes(start, duration);
  return { start, end };
}

export function filterAppointments(appointments: any[], startDate: Date, days: number) {
  const endDate = addDays(startDate, days);
  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.start);
    return appointmentDate >= startDate && appointmentDate <= endDate;
  });
}