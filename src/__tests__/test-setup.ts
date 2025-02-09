import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
