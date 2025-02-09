import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a wrapper with providers for testing
export function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Mock Response helper
export function createMockResponse<T>(data: T, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
    headers: new Headers(),
    redirected: false,
    statusText: ok ? 'OK' : 'Error',
    type: 'default' as ResponseType,
    url: '',
    clone: function() { return this; },
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
    text: async () => JSON.stringify(data),
  } as Response;
}

// Common test data
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

// Type for mock functions
type MockFn = jest.Mock;

// Mock fetch for appointments
export function mockAppointmentsFetch(data: any[]): MockFn {
  return jest.fn((url: string) => {
    return Promise.resolve(createMockResponse(data));
  });
}

// Mock fetch for payments
export function mockPaymentsFetch(data: any[]): MockFn {
  return jest.fn((url: string) => {
    return Promise.resolve(createMockResponse(data));
  });
}
