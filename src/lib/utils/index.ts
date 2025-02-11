import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Common utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Re-export all utilities
export * from './date';
export * from './formatting';
export * from './validation';
export * from './schedule';
export * from './ui';