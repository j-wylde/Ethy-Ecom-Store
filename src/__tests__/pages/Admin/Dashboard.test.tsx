import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AdminDashboard from '@/pages/Admin/Dashboard';
import { useProducts, useDeleteProduct } from '@/services/productService';
import { useAdminBlogPosts, useDeleteBlogPost } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

// Mock hooks
vi.mock('@/services/productService', () => ({
  useProducts: vi.fn(),
  useDeleteProduct: vi.fn(),
}));

vi.mock('@/services/blogService', () => ({
  useAdminBlogPosts: vi.fn(),
  useDeleteBlogPost: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('AdminDashboard', () => {
  const mockToast = vi.fn();
  const mockDeleteProduct = { mutateAsync: vi.fn() };
  const mockDeleteBlogPost = { mutateAsync: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as unknown as jest.Mock).mockReturnValue({ toast: mockToast });
    (useDeleteProduct as unknown as jest.Mock).mockReturnValue(mockDeleteProduct);
    (useDeleteBlogPost as unknown as jest.Mock).mockReturnValue(mockDeleteBlogPost);
  });

  it('should render loading states for products and blog posts', () => {
    (useProducts as unknown as jest.Mock).mockReturnValue({ data: [], isLoading: true });
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: [], isLoading: true });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Check for loading indicators
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show empty states with 0 counts', () => {
    (useProducts as unknown as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: [], isLoading: false });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Check for 0 counts in the stats cards
    const counts = screen.getAllByText('0');
    expect(counts.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Total products')).toBeInTheDocument();
    expect(screen.getByText('Published posts')).toBeInTheDocument();
  });

  it('should display the correct number of products and blog posts', () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', category: 'Category 1', price: 100, stock: 10 },
      { id: '2', name: 'Product 2', category: 'Category 2', price: 200, stock: 20 },
    ];
    const mockBlogPosts = [
      { id: '1', title: 'Post 1', created_at: '2023-01-01', published: true },
      { id: '2', title: 'Post 2', created_at: '2023-01-02', published: false },
    ];
    (useProducts as unknown as jest.Mock).mockReturnValue({ data: mockProducts, isLoading: false });
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: mockBlogPosts, isLoading: false });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Get all elements with class 'text-2xl font-bold' and check their values
    const statValues = screen.getAllByText('2', { selector: '.text-2xl.font-bold' });
    expect(statValues.length).toBe(2);
    expect(screen.getByText('Total products')).toBeInTheDocument();
    expect(screen.getByText('Published posts')).toBeInTheDocument();
  });

  it('should delete a product and show success toast', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', category: 'Category 1', price: 100, stock: 10 },
    ];
    (useProducts as unknown as jest.Mock).mockReturnValue({ data: mockProducts, isLoading: false });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]); // Click first delete button (for product)

    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteProduct.mutateAsync).toHaveBeenCalledWith('1');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    });
  });

  it('should show blog post management link', () => {
    const mockBlogPosts = [
      { id: '1', title: 'Post 1', created_at: '2023-01-01', published: true },
    ];
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: mockBlogPosts, isLoading: false });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Verify the blog post management link exists
    const blogLink = screen.getByRole('link', { name: /view all posts/i });
    expect(blogLink).toBeInTheDocument();
    expect(blogLink).toHaveAttribute('href', '/admin/blog');
  });
});