import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppointmentsView } from '@/components/appointments/AppointmentsView';
import { createMockResponse } from '../utils/test-utils';

describe('AppointmentsView', () => {
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

  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve(createMockResponse(mockAppointments))
    );
  });

  it('renders calendar and timeline', () => {
    render(<AppointmentsView />);
    
    expect(screen.getByText('Appointments Calendar')).toBeInTheDocument();
    expect(screen.getByText(/Schedule for/)).toBeInTheDocument();
  });

  // Add more test cases as needed
});
