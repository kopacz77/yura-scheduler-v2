import * as React from 'react';

interface ScheduleReminderProps {
  student: {
    user: {
      name: string;
      email: string;
    };
  };
  lesson: {
    startTime: Date;
    endTime: Date;
    duration: number;
    type: string;
    rink: {
      name: string;
      address: string;
    };
  };
}

export function ScheduleReminder({ student, lesson }: ScheduleReminderProps) {
  return (
    <div>
      <h1>Lesson Reminder</h1>
      <p>Hi {student.user.name},</p>
      <p>This is a reminder about your upcoming lesson:</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Lesson Details</h2>
        <ul>
          <li>Date: {lesson.startTime.toLocaleDateString()}</li>
          <li>Time: {lesson.startTime.toLocaleTimeString()} - {lesson.endTime.toLocaleTimeString()}</li>
          <li>Duration: {lesson.duration} minutes</li>
          <li>Type: {lesson.type}</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Location</h2>
        <p>{lesson.rink.name}</p>
        <p>{lesson.rink.address}</p>
      </div>

      <p style={{ marginTop: '20px' }}>
        Please arrive 10 minutes before your lesson time. If you need to cancel or reschedule,
        please do so at least 24 hours in advance.
      </p>
    </div>
  );
}
