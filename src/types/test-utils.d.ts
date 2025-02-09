declare namespace Vi {
  interface Assertion {
    toBeInTheDocument(): void;
    toBeEnabled(): void;
    toBeDisabled(): void;
  }
}

declare module '@testing-library/jest-dom' {
  export function toBeInTheDocument(): void;
  export function toBeEnabled(): void;
  export function toBeDisabled(): void;
}

declare module '@testing-library/user-event' {
  const userEvent: {
    type(element: Element | null, text: string): Promise<void>;
    click(element: Element | null): Promise<void>;
    // Add other user event methods as needed
  };
  export default userEvent;
}
