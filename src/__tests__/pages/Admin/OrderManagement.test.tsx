import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import OrderManagement from '@/pages/Admin/OrderManagement';

// Mock useQuery
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('OrderManagement', () => {
  const mockOrders = [
    {
      id: '1',
      created_at: '2023-01-01',
      total: 100,
      status: 'completed',
      user_id: 'user1',
      customer_name: 'John Doe',
    },
    {
      id: '2',
      created_at: '2023-01-02',
      total: 200,
      status: 'processing',
      user_id: 'user2',
      customer_name: 'Jane Smith',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({ isLoading: true });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/Order Management/i)).toBeInTheDocument();
    // Check for loading state elements
    const loadingRows = document.querySelectorAll('.animate-pulse');
    expect(loadingRows.length).toBeGreaterThan(10); // Each row has multiple animated elements
    expect(screen.getByText(/Order Management/i)).toBeInTheDocument();
  });

  it('should render error state', () => {
    (useQuery as jest.Mock).mockReturnValue({ error: new Error('Failed to load') });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/Failed to load orders/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });

  it('should render empty orders state', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: [], isLoading: false });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/No orders available yet/i)).toBeInTheDocument();
  });

  it('should filter orders based on search query', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: mockOrders, isLoading: false });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search orders/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
  });

  it('should paginate orders', () => {
    const largeOrders = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      created_at: '2023-01-01',
      total: 100,
      status: 'completed',
      user_id: `user${i + 1}`,
      customer_name: `Customer ${i + 1}`,
    }));
    (useQuery as jest.Mock).mockReturnValue({ data: largeOrders, isLoading: false });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    // First page should show first 10 customers
    // Check first page shows customers 1-10
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Customer 1');
    expect(rows[10]).toHaveTextContent('Customer 10');
    expect(screen.queryByText('Customer 11')).not.toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[1]; // First button is disabled prev, second is next
    fireEvent.click(nextButton);

    // Second page should show next 5 customers
    // Check second page shows customers 11-15
    expect(screen.getByText(/Customer 11$/i)).toBeInTheDocument();
    expect(screen.queryByText(/Customer 1$/i)).not.toBeInTheDocument();
  });

  it('should render orders correctly', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: mockOrders, isLoading: false });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  it('should navigate to order details on view button click', () => {
    (useQuery as jest.Mock).mockReturnValue({ data: mockOrders, isLoading: false });

    render(
      <MemoryRouter>
        <OrderManagement />
      </MemoryRouter>
    );

    const viewLinks = screen.getAllByRole('link');
    expect(viewLinks[0]).toHaveAttribute('href', '/admin/orders/1');
    expect(viewLinks[1]).toHaveAttribute('href', '/admin/orders/2');
  });
});