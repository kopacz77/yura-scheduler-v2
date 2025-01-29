import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock providers
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Add providers here as needed */}
      {children}
    </div>
  );
}

function render(ui: React.ReactElement, options = {}) {
  return {
    ...rtlRender(ui, { wrapper: Providers, ...options }),
    user: userEvent.setup(),
  };
}

// Common test data
export const testData = {
  appointments: [
    {
      id: '1',
      title: 'Test Lesson',
      start: new Date('2025-01-29T10:00:00'),
      end: new Date('2025-01-29T11:00:00'),
      studentId: '1',
      resourceId: '1',
      lessonType: 'PRIVATE'
    }
  ],
  resources: [
    {
      id: '1',
      name: 'Main Rink',
      type: 'MAIN_RINK',
      available: true,
      maxCapacity: 20
    }
  ],
  students: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      level: 'INTERMEDIATE',
      preferredPayment: 'VENMO'
    }
  ],
  payments: [
    {
      id: '1',
      amount: 100.00,
      method: 'VENMO',
      status: 'PENDING',
      appointmentId: '1',
      studentId: '1'
    }
  ]
};

// Common test utilities
export function mockFetch(data: any) {
  return vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data)
    })
  );
}

export function mockFetchError(status = 500, message = 'Internal Server Error') {
  return vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ error: message })
    })
  );
}

// Common assertions
export function expectLoading(container: HTMLElement) {
  expect(container.querySelector('[role="status"]')).toBeInTheDocument();
}

export function expectNotLoading(container: HTMLElement) {
  expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
}

export function expectErrorMessage(container: HTMLElement, message: string) {
  expect(container.querySelector('.error-message')).toHaveTextContent(message);
}

export {
  render,
  userEvent,
};
