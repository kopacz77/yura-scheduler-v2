import { PaymentMethod, PaymentStatus } from '@prisma/client';

// Ice Dance specific types
export type LessonType = 'private' | 'group' | 'choreography' | 'competition-prep';
export type SkatingLevel = 'beginner' | 'intermediate' | 'advanced' | 'competitive';
export type RinkArea = 'main-rink' | 'practice-rink' | 'dance-studio';

export interface Payment {
    id: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    referenceCode: string;
    verifiedBy?: string;
    verifiedAt?: Date;
    notes?: string;
}

// Base appointment type from planner with our customizations
export interface Appointment {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resourceId: string;  // This will be the rinkAreaId
    order: number;
    payment?: Payment;
    details: {
        studentId: string;
        lessonType: LessonType;
        notes?: string;
        skill?: string;
        focus?: string;
    };
}

// Base resource type from planner customized for ice rinks
export interface Resource {
    id: string;
    name: string;
    type: RinkArea;
    details: {
        maxCapacity?: number;
        description?: string;
        available: boolean;
        maintenanceSchedule?: {
            start: Date;
            end: Date;
        }[];
    };
}

// Student model
export interface Student {
    id: string;
    name: string;
    email: string;
    phone?: string;
    level: SkatingLevel;
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    notes?: string;
    startDate: Date;
    packageCredits?: number;
    preferredDays?: string[];
    preferredTimes?: {
        start: string;
        end: string;
    }[];
}