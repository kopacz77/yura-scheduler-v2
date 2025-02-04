import { z } from 'zod';

export const TimeSlotSchema = z.object({
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  daysOfWeek: z.array(z.number().min(0).max(6)),
  maxStudents: z.number().min(1),
  isActive: z.boolean(),
}).refine(
  data => {
    const start = new Date(`1970-01-01T${data.startTime}`);
    const end = new Date(`1970-01-01T${data.endTime}`);
    return end > start;
  },
  { message: 'End time must be after start time' }
);

export const RinkSchema = z.object({
  name: z.string().min(1, 'Rink name is required'),
  address: z.string().min(1, 'Address is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  maxCapacity: z.number().min(1, 'Maximum capacity must be at least 1'),
});

export const LessonSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  rinkId: z.string().min(1, 'Rink is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().min(15, 'Minimum lesson duration is 15 minutes'),
  notes: z.string().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  paymentMethod: z.enum(['VENMO', 'ZELLE']),
}).refine(
  data => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  },
  { message: 'End time must be after start time' }
);

// Enhanced User Schema with role validation
export const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'STUDENT']).default('STUDENT'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
});

// New schema for admin-only operations
export const AdminActionSchema = z.object({
  adminToken: z.string().min(1, 'Admin token is required')
}).refine(async data => {
  // In production, this would validate against a secure token
  return data.adminToken === process.env.ADMIN_SECRET;
}, {
  message: 'Invalid admin token'
});

export const StudentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  maxLessonsPerWeek: z.number().min(1, 'Must allow at least 1 lesson per week'),
  notes: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    relationship: z.string().min(1, 'Relationship is required'),
  }),
});

export const PaymentSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  amount: z.number().min(0, 'Amount cannot be negative'),
  method: z.enum(['VENMO', 'ZELLE']),
  referenceCode: z.string().min(1, 'Reference code is required'),
  notes: z.string().optional(),
});

// Validation functions
export function validateTimeSlot(data: unknown) {
  return TimeSlotSchema.safeParse(data);
}

export function validateRink(data: unknown) {
  return RinkSchema.safeParse(data);
}

export function validateLesson(data: unknown) {
  return LessonSchema.safeParse(data);
}

export function validateUser(data: unknown) {
  return UserSchema.safeParse(data);
}

export function validateStudent(data: unknown) {
  return StudentSchema.safeParse(data);
}

export function validatePayment(data: unknown) {
  return PaymentSchema.safeParse(data);
}

export function validateAdminAction(data: unknown) {
  return AdminActionSchema.safeParse(data);
}
