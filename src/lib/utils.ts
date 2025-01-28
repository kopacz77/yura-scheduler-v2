import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Appointment } from "@/models/types";
import { add, isWithinInterval, startOfDay, endOfDay, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateNewDates(
  viewMode: string,
  targetColumn: number,
  sourceColumn: number,
  currentDates: { from: Date; to: Date },
) {
  const daysDiff = targetColumn - sourceColumn;
  if (daysDiff === 0) return currentDates;

  return {
    start: add(currentDates.from, { days: daysDiff }),
    end: add(currentDates.to, { days: daysDiff }),
  };
}

export function filterAppointments(
  appointment: Appointment,
  columnIndex: number,
  dateRange: { start: Date; end: Date },
  viewMode: string,
) {
  const columnDate = add(startOfDay(dateRange.start), { days: columnIndex });
  const columnEnd = endOfDay(columnDate);

  return isWithinInterval(appointment.start, {
    start: columnDate,
    end: columnEnd,
  });
}

export function formatAppointmentTime(date: Date) {
  return format(date, "h:mm a");
}

export function getLessonTypeColor(lessonType: string) {
  const colors = {
    private: "bg-blue-100 text-blue-800",
    group: "bg-green-100 text-green-800",
    choreography: "bg-purple-100 text-purple-800",
    "competition-prep": "bg-red-100 text-red-800",
  };
  return colors[lessonType as keyof typeof colors] || "bg-gray-100 text-gray-800";
}

export function getSkatingLevelBadge(level: string) {
  const badges = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800",
    competitive: "bg-red-100 text-red-800",
  };
  return badges[level as keyof typeof badges] || "bg-gray-100 text-gray-800";
}
