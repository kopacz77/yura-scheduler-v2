export interface EmailTemplate {
  subject: string;
  content: string;
}

export interface LessonEmailData {
  studentName: string;
  lessonDate: string;
  lessonTime: string;
  lessonType: string;
  duration: number;
  price?: number;
  location?: {
    name: string;
    address: string;
  };
}

export interface PaymentEmailData {
  studentName: string;
  amount: number;
  method: string;
  referenceCode: string;
  date: string;
  lesson: {
    date: string;
    time: string;
    duration: number;
    type: string;
  };
}