import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentSystem } from '@/components/payments/PaymentSystem';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../utils/test-utils';

describe('PaymentSystem', () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    amount: 100,
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  it('renders payment options and amount', () => {
    render(<PaymentSystem {...defaultProps} />);
    
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('Amount due: $100.00')).toBeInTheDocument();
    expect(screen.getByLabelText('Venmo')).toBeInTheDocument();
    expect(screen.getByLabelText('Zelle')).toBeInTheDocument();
  });

  it('requires reference code for submission', async () => {
    render(<PaymentSystem {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    const referenceInput = screen.getByLabelText(/reference code/i);
    await userEvent.type(referenceInput, 'REF123');
    
    expect(submitButton).toBeEnabled();
  });

  it('handles payment submission', async () => {
    render(<PaymentSystem {...defaultProps} />);
    
    const referenceInput = screen.getByLabelText(/reference code/i);
    await userEvent.type(referenceInput, 'REF123');
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      method: 'VENMO',
      referenceCode: 'REF123'
    });
  });
});
