import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

beforeAll(() => {
  expect.extend(matchers);
});

afterEach(() => {
  cleanup();
});