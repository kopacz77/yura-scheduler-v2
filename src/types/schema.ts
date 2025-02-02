import { z } from 'zod';

// Auth Schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include uppercase, lowercase, number and special character'
    ),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['STUDENT', 'ADMIN', 'COACH']).optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Student Schemas
export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  relationship: z.string().min(1, 'Relationship is required'),
});

export const createStudentSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  maxLessonsPerWeek: z.number().min(1).default(3),
  notes: z.string().optional(),
  emergencyContact: emergencyContactSchema.optional(),
});

// Lesson Schemas
export const createLessonSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  rinkId: z.string().min(1, 'Rink ID is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().min(15, 'Minimum lesson duration is 15 minutes'),
  notes: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  paymentMethod: z.enum(['VENMO', 'ZELLE']),
  timeSlotId: z.string().optional(),
}).refine(
  (data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  },
  { message: 'End time must be after start time' }
);

// Payment Schemas
export const createPaymentSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  method: z.enum(['VENMO', 'ZELLE']),
  notes: z.string().optional(),
});

// Rink Schemas
export const createRinkSchema = z.object({
  name: z.string().min(1, 'Rink name is required'),
  address: z.string().min(1, 'Address is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  maxCapacity: z.number().min(1).optional(),
});

export const createTimeSlotSchema = z.object({
  rinkId: z.string().min(1, 'Rink ID is required'),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  daysOfWeek: z.array(z.number().min(0).max(6)),
  maxStudents: z.number().min(1),
  isActive: z.boolean().default(true),
}).refine(
  (data) => {
    const start = new Date(`1970-01-01T${data.startTime}`);
    const end = new Date(`1970-01-01T${data.endTime}`);
    return end > start;
  },
  { message: 'End time must be after start time' }
);