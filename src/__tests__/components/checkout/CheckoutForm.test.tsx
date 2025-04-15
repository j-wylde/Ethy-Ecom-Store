import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
//import '@testing-library/jest-dom/extend-expect';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { vi } from 'vitest';

describe('CheckoutForm Component', () => {
  const mockHandleChange = vi.fn();
  const mockHandleSubmit = vi.fn();
  const formData = {
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  };

  it('renders correctly', () => {
    render(
      <CheckoutForm
        formData={formData}
        handleChange={mockHandleChange}
        isLoading={false}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('State')).toBeInTheDocument();
    expect(screen.getByLabelText('Zip Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Order Notes (Optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Place Order' })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    render(
      <CheckoutForm
        formData={formData}
        handleChange={mockHandleChange}
        isLoading={false}
        handleSubmit={mockHandleSubmit}
      />
    );

    const fullNameInput = screen.getByLabelText('Full Name');
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it('submits the form', () => {
    render(
      <CheckoutForm
        formData={formData}
        handleChange={mockHandleChange}
        isLoading={false}
        handleSubmit={mockHandleSubmit}
      />
    );

    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays loading state', () => {
    render(
      <CheckoutForm
        formData={formData}
        handleChange={mockHandleChange}
        isLoading={true}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByRole('button', { name: 'Processing...' })).toBeDisabled();
  });
});