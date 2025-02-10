import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// General utilities
export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Re-export all utilities
export * from './date';
export * from './formatting';
export * from './validation';
export * from './schedule';
export * from './ui';
