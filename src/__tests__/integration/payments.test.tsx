import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentSystem } from '@/components/payments/PaymentSystem';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock data
const mockPayments = [
  {
    id: '1',
    amount: 100.00,
    method: 'VENMO',
    status: 'PENDING',
    appointmentId: '1',
    studentId: '1',
    createdAt: new Date('2025-01-29').toISOString(),
    paidAt: null
  }
];

const mockAppointment = {
  id: '1',
  title: 'Private Lesson',
  start: new Date('2025-01-29T10:00:00').toISOString(),
  end: new Date('2025-01-29T11:00:00').toISOString(),
  studentId: '1',
  resourceId: '1',
  lessonType: 'PRIVATE'
};

describe('Payment System Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/payments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPayments)
        });
      }
      if (url.includes('/api/appointments')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAppointment)
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('displays payment history correctly', async () => {
    render(<PaymentSystem />);

    // Check loading state
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Verify payment details are displayed
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('Venmo')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('handles payment status updates', async () => {
    const user = userEvent.setup();
    render(<PaymentSystem />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock successful status update
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        ...mockPayments[0],
        status: 'PAID',
        paidAt: new Date().toISOString()
      })
    });

    // Click on payment status update button
    await user.click(screen.getByText('Mark as Paid'));

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/payments',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
    );

    // Verify updated status
    await waitFor(() => {
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });
  });

  it('handles payment confirmation', async () => {
    const user = userEvent.setup();
    render(<PaymentSystem />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock successful confirmation
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        ...mockPayments[0],
        status: 'CONFIRMED',
        confirmationId: 'VENMO123'
      })
    });

    // Enter confirmation ID and confirm
    await user.click(screen.getByText('Confirm Payment'));
    await user.type(screen.getByLabelText(/confirmation id/i), 'VENMO123');
    await user.click(screen.getByText('Submit'));

    // Verify API call
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/payments',
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('VENMO123')
      })
    );

    // Verify confirmed status
    await waitFor(() => {
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('VENMO123')).toBeInTheDocument();
    });
  });

  it('handles payment validation errors', async () => {
    const user = userEvent.setup();
    render(<PaymentSystem />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock validation error
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({
        error: 'Invalid confirmation ID format'
      })
    });

    // Attempt confirmation with invalid ID
    await user.click(screen.getByText('Confirm Payment'));
    await user.type(screen.getByLabelText(/confirmation id/i), 'invalid');
    await user.click(screen.getByText('Submit'));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Invalid confirmation ID format')).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully', async () => {
    // Mock network error
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<PaymentSystem />);

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/failed to load payment data/i)).toBeInTheDocument();
    });

    // Verify retry functionality
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });
});
