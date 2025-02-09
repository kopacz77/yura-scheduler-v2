import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { format, parseISO } from 'date-fns';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES
});

const calendar = google.calendar({ version: 'v3', auth });

interface CalendarEvent {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees?: { email: string }[];
  location?: string;
  timeZone?: string;
}

export async function createCalendarEvent({
  summary,
  description = '',
  startTime,
  endTime,
  attendees = [],
  location,
  timeZone = 'America/Los_Angeles'
}: CalendarEvent) {
  try {
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone
        },
        attendees,
        location,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 }
          ]
        }
      }
    });

    return event.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

export async function updateCalendarEvent(
  eventId: string,
  {
    summary,
    description = '',
    startTime,
    endTime,
    attendees = [],
    location,
    timeZone = 'America/Los_Angeles'
  }: CalendarEvent
) {
  try {
    const event = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone
        },
        attendees,
        location
      }
    });

    return event.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
}

export async function deleteCalendarEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
}
