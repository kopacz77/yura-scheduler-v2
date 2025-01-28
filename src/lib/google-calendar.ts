import { google } from 'googleapis';
import { Appointment } from '@/models/types';

const calendar = google.calendar('v3');

// Initialize Google Calendar API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

export async function syncAppointmentToGoogle(appointment: Appointment) {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) throw new Error('Google Calendar ID not configured');

    // Format appointment for Google Calendar
    const event = {
      summary: `${appointment.title} - ${appointment.details.lessonType}`,
      description: `Student: ${appointment.title}\nType: ${appointment.details.lessonType}\nNotes: ${appointment.details.notes || 'None'}`,
      start: {
        dateTime: appointment.start.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: appointment.end.toISOString(),
        timeZone: 'America/New_York',
      },
      location: appointment.resourceId, // Rink area
      colorId: getColorForLessonType(appointment.details.lessonType),
    };

    // Create or update event
    if (appointment.googleEventId) {
      await calendar.events.update({
        auth,
        calendarId,
        eventId: appointment.googleEventId,
        requestBody: event,
      });
    } else {
      const response = await calendar.events.insert({
        auth,
        calendarId,
        requestBody: event,
      });
      return response.data.id; // Return Google Calendar event ID
    }
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error);
    throw error;
  }
}

export async function deleteGoogleCalendarEvent(googleEventId: string) {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) throw new Error('Google Calendar ID not configured');

    await calendar.events.delete({
      auth,
      calendarId,
      eventId: googleEventId,
    });
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    throw error;
  }
}

// Helper function to assign colors to different lesson types
function getColorForLessonType(lessonType: string): string {
  const colors = {
    'private': '1',     // Lavender
    'group': '2',       // Sage
    'choreography': '3', // Grape
    'competition-prep': '4', // Flamingo
  };
  return colors[lessonType as keyof typeof colors] || '1';
}
