import { type Lesson, type Student, type User } from '@prisma/client';
import * as React from 'react';
import { format } from 'date-fns';

interface ScheduleReminderProps {
  student: Student & { user: User };
  lesson: Lesson;
  manageUrl: string;
}

export const ScheduleReminder: React.FC<ScheduleReminderProps> = ({
  student,
  lesson,
  manageUrl,
}) => (
  <div>
    <h1>Lesson Reminder</h1>
    <p>Hello {student.user.name},</p>
    <p>
      This is a friendly reminder about your upcoming lesson with Yura Min:
    </p>

    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <p><strong>Date:</strong> {format(lesson.startTime, 'MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> {format(lesson.startTime, 'h:mm a')} - {format(lesson.endTime, 'h:mm a')}</p>
      <p><strong>Type:</strong> {lesson.type}</p>
      <p><strong>Duration:</strong> {lesson.duration} minutes</p>
      {lesson.notes && <p><strong>Notes:</strong> {lesson.notes}</p>}
    </div>

    <div style={{ marginTop: '20px' }}>
      <p><strong>Please remember to bring:</strong></p>
      <ul>
        <li>Water bottle</li>
        <li>Appropriate skating attire</li>
        <li>Any required equipment</li>
      </ul>
    </div>

    <p>
      Need to make changes?
      <a 
        href={manageUrl}
        style={{
          display: 'inline-block',
          marginLeft: '10px',
          color: '#4f46e5',
          textDecoration: 'underline',
        }}
      >
        Manage Lesson
      </a>
    </p>

    <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Please arrive 10 minutes before your lesson. If you need to cancel or reschedule,
        please do so at least 24 hours in advance.
      </p>
    </div>

    <p>See you on the ice!</p>
    <p>Best regards,<br />Coach Yura Min</p>
  </div>
);