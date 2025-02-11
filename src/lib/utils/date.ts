import { format as fnsFormat, parseISO } from 'date-fns';

export function formatDate(date: Date | string, formatStr: string = 'PPP') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return fnsFormat(dateObj, formatStr);
}

export function formatTime(date: Date | string, formatStr: string = 'p') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return fnsFormat(dateObj, formatStr);
}

export function formatDateTime(date: Date | string, formatStr: string = 'PPp') {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return fnsFormat(dateObj, formatStr);
}

// Helper for handling timezone offsets
export function getLocalDateTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const offset = new Date().getTimezoneOffset();
  return new Date(dateObj.getTime() - (offset * 60 * 1000));
}
