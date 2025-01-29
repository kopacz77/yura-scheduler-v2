import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Scheduler } from '@/components/planner/Scheduler';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock data
const mockAppointments = [
  {
    id: '1',
    title: 'Private Lesson',
    start: new Date('2025-01-29T10:00:00'),
    end: new Date('2025-01-29T11:00:00'),
    studentId: '1',
    resourceId: '1',
    lessonType: 'PRIVATE'
  }
];

const mockResources = [
  {
    id: '1',
    name: 'Main Rink',
    type: 'MAIN_RINK',
    available: true,
    maxCapacity: 20
  }
];

describe('Scheduler Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default fetch mock responses
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointments)
        });
      }
      if (url.includes('/api/resources')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResources)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('loads and displays appointments successfully', async () => {
    render(<Scheduler />);

    // Check loading state
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Verify appointment is displayed
    expect(screen.getByText('Private Lesson')).toBeInTheDocument();
  });

  it('handles appointment creation', async () => {
    const user = userEvent.setup();
    render(<Scheduler />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock successful appointment creation
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{
        id: '2',
        title: 'New Lesson',
        start: new Date(),
        end: new Date(),
        studentId: '1',
        resourceId: '1',
        lessonType: 'PRIVATE'
      }])
    });

    // Click new appointment button
    await user.click(screen.getByText('New Appointment'));

    // Fill in appointment form
    await user.type(screen.getByLabelText(/title/i), 'New Lesson');
    // Add more form interactions as needed

    // Submit form
    await user.click(screen.getByText(/save/i));

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/appointments',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    );
  });

  it('handles appointment conflicts correctly', async () => {
    const user = userEvent.setup();
    render(<Scheduler />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock conflict response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({
        conflicts: [{
          existingAppointment: mockAppointments[0],
          conflictingTime: new Date()
        }]
      })
    });

    // Create conflicting appointment
    await user.click(screen.getByText('New Appointment'));
    await user.type(screen.getByLabelText(/title/i), 'Conflicting Lesson');
    await user.click(screen.getByText(/save/i));

    // Verify conflict message
    await waitFor(() => {
      expect(screen.getByText(/scheduling conflict/i)).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully', async () => {
    // Mock failed API response
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<Scheduler />);

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to load scheduler data/i)).toBeInTheDocument();
    });

    // Verify retry button
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it('handles appointment deletion', async () => {
    const user = userEvent.setup();
    render(<Scheduler />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock successful deletion
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 204
    });

    // Click delete button (assuming it's accessible via appointment click)
    await user.click(screen.getByText('Private Lesson'));
    await user.click(screen.getByText(/delete/i));

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/appointments?id=1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    );

    // Verify appointment removed from UI
    await waitFor(() => {
      expect(screen.queryByText('Private Lesson')).not.toBeInTheDocument();
    });
  });
});
