import * as React from 'react';

interface LessonConfirmationProps {
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
    price: number;
    rink: {
      name: string;
      address: string;
    };
  };
}

export function LessonConfirmation({ student, lesson }: LessonConfirmationProps) {
  return (
    <div>
      <h1>Lesson Confirmation</h1>
      <p>Hi {student.user.name},</p>
      <p>Your lesson has been scheduled successfully:</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Lesson Details</h2>
        <ul>
          <li>Date: {lesson.startTime.toLocaleDateString()}</li>
          <li>Time: {lesson.startTime.toLocaleTimeString()} - {lesson.endTime.toLocaleTimeString()}</li>
          <li>Duration: {lesson.duration} minutes</li>
          <li>Type: {lesson.type}</li>
          <li>Price: ${lesson.price.toFixed(2)}</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Location</h2>
        <p>{lesson.rink.name}</p>
        <p>{lesson.rink.address}</p>
      </div>

      <p style={{ marginTop: '20px' }}>
        Please arrive 10 minutes before your lesson. Payment is due before the lesson starts.
      </p>

      <p>Looking forward to seeing you!</p>
    </div>
  );
}
