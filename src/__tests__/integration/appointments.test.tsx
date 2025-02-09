import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppointmentsView } from '@/components/appointments/AppointmentsView';
import { createMockResponse } from '../utils/test-utils';

describe('AppointmentsView', () => {
  beforeEach(() => {
    const mockAppointments = [
      {
        id: '1',
        title: 'Test Appointment',
        start: new Date(),
        end: new Date(),
        studentId: '1',
        resourceId: '1',
        lessonType: 'PRIVATE'
      }
    ];

    global.fetch = vi.fn(async () => createMockResponse(mockAppointments));
  });

  // Your test cases...
});
