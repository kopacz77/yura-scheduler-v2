import { isValid, parseISO, isBefore, addHours } from 'date-fns';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function validateAppointmentTime(start: string | Date, end: string | Date): boolean {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;

  return (
    isValid(startDate) &&
    isValid(endDate) &&
    isBefore(startDate, endDate)
  );
}

export function validatePaymentAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

export function validateBookingNotice(startDate: Date): boolean {
  const minimumNotice = addHours(new Date(), 24); // 24 hour minimum notice
  return isBefore(minimumNotice, startDate);
}
