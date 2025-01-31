import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, startOfDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function getLessonTypeColor(type: string): string {
  const types: Record<string, string> = {
    "private": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "group": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "competition": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    "performance": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    "seminar": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
  };

  return types[type.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

export function calculateNewDates(
  viewMode: 'day' | 'week' | 'month',
  targetColumnIndex: number,
  sourceColumnIndex: number,
  originalDates: { from: Date; to: Date }
) {
  const daysDifference = targetColumnIndex - sourceColumnIndex;
  const start = addDays(originalDates.from, daysDifference);
  const end = addDays(originalDates.to, daysDifference);
  
  return {
    start,
    end
  };
}

export function filterAppointments(
  appointment: { start: Date; end: Date },
  columnIndex: number,
  dateRange: { start: Date; end: Date },
  viewMode: 'day' | 'week' | 'month'
): boolean {
  const appointmentDay = startOfDay(new Date(appointment.start));
  const columnDay = addDays(dateRange.start, columnIndex);

  return appointmentDay.getTime() === columnDay.getTime();
}