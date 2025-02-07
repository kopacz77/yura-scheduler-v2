import { google } from 'googleapis';
import { format, parseISO } from 'date-fns';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

type EventDetails = {
  studentName: string;
  studentEmail: string;
  startTime: string;
  endTime: string;
  rinkName: string;
  rinkAddress: string;
  notes?: string;
};

export async function createCalendarEvent(details: EventDetails) {
  try {
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Skating Lesson - ${details.studentName}`,
        description: `Location: ${details.rinkName}\nNotes: ${details.notes || 'None'}`,
        start: {
          dateTime: details.startTime,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: details.endTime,
          timeZone: 'America/Los_Angeles',
        },
        location: details.rinkAddress,
        attendees: [
          { email: details.studentEmail },
          { email: process.env.ADMIN_EMAIL }
        ],
        sendUpdates: 'all',
      },
    });

    return event.data.id;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

export async function updateCalendarEvent(eventId: string, details: Partial<EventDetails>) {
  try {
    const event = await calendar.events.get({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
    });

    const updatedEvent = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      requestBody: {
        ...event.data,
        summary: details.studentName ? `Skating Lesson - ${details.studentName}` : undefined,
        start: details.startTime ? {
          dateTime: details.startTime,
          timeZone: 'America/Los_Angeles',
        } : undefined,
        end: details.endTime ? {
          dateTime: details.endTime,
          timeZone: 'America/Los_Angeles',
        } : undefined,
        location: details.rinkAddress,
      },
      sendUpdates: 'all',
    });

    return updatedEvent.data.id;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
}

export async function deleteCalendarEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      sendUpdates: 'all',
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
}