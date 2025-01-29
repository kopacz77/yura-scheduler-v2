import { type Appointment, type Student } from '@prisma/client';
import * as React from 'react';
import { format } from 'date-fns';

interface LessonConfirmationProps {
  student: Student;
  appointment: Appointment;
  cancelUrl: string;
}

export const LessonConfirmation: React.FC<LessonConfirmationProps> = ({
  student,
  appointment,
  cancelUrl,
}) => (
  <div>
    <h1>Lesson Confirmation</h1>
    <p>Hello {student.name},</p>
    <p>Your lesson has been scheduled with Yura Min:</p>
    
    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <p><strong>Date:</strong> {format(appointment.start, 'MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}</p>
      <p><strong>Type:</strong> {appointment.lessonType}</p>
      {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
    </div>

    <p>
      Need to cancel or reschedule? Please click here:
      <a 
        href={cancelUrl}
        style={{
          display: 'inline-block',
          marginLeft: '10px',
          color: '#4f46e5',
          textDecoration: 'underline',
        }}
      >
        Manage Appointment
      </a>
    </p>

    <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Please arrive 10 minutes before your lesson. Don't forget to bring:
        <ul>
          <li>Water bottle</li>
          <li>Appropriate skating attire</li>
          <li>Any required equipment</li>
        </ul>
      </p>
    </div>

    <p style={{ marginTop: '20px' }}>
      Looking forward to seeing you!
    </p>
    <p>Best regards,<br />Yura Min</p>
  </div>
);