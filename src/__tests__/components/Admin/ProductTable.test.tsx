import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ProductTable from '@/components/Admin/ProductTable';
import { useProducts, useDeleteProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/services/productService');
vi.mock('@/hooks/use-toast');

describe('ProductTable', () => {
  it('testProductDeletion', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', description: 'Description 1', category: 'Category 1', price: 100, stock: 20, image_url: '' },
    ];

    const deleteProductMock = vi.fn().mockResolvedValue('1');
    const toastMock = vi.fn();

    (useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useDeleteProduct as jest.Mock).mockReturnValue({
      mutateAsync: deleteProductMock,
      isPending: false,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: toastMock,
    });

    render(
      <MemoryRouter>
        <ProductTable />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Delete Product 1'));

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Delete' }));

    await waitFor(() => {
      expect(deleteProductMock).toHaveBeenCalledWith('1');
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Product deleted',
        description: 'The product has been successfully deleted',
      });
    });
  });

  it('testProductDeletionError', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', description: 'Description 1', category: 'Category 1', price: 100, stock: 20, image_url: '' },
    ];

    const error = new Error('Deletion failed');
    const toastMock = vi.fn();

    (useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useDeleteProduct as jest.Mock).mockReturnValue({
      mutateAsync: vi.fn().mockRejectedValue(error),
      isPending: false,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: toastMock,
    });

    render(
      <MemoryRouter>
        <ProductTable />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Delete Product 1'));

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Delete' }));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Error',
        description: `Failed to delete product: ${error.message}`,
        variant: 'destructive',
      });
    });
  });

  it('testProductListPagination', () => {
    const mockProducts = Array.from({ length: 15 }, (_, index) => ({
      id: `${index + 1}`,
      name: `Product ${index + 1}`,
      description: `Description ${index + 1}`,
      category: `Category ${index + 1}`,
      price: 100,
      stock: 20,
      image_url: '',
    }));

    (useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductTable />
      </MemoryRouter>
    );

    // Check if the pagination controls are present
    const previousButton = screen.getByRole('button', { name: 'Previous Page' });
    const nextButton = screen.getByRole('button', { name: 'Next Page' });

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Check if the initial page is displayed
    const pageInfo = screen.getByText(/Page 1 of \d+/);
    expect(pageInfo).toBeInTheDocument();

    // Simulate clicking the next page button
    fireEvent.click(nextButton);

    // Check if the page number updates
    const updatedPageInfo = screen.getByText(/Page 2 of \d+/);
    expect(updatedPageInfo).toBeInTheDocument();
  });
  
  it('testProductLoadingState', () => {
    // Mock the loading state
    (useProducts as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });
    
    render(
      <MemoryRouter>
        <ProductTable />
      </MemoryRouter>
    );

    // Check if the loading skeletons are displayed
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('testProductSearchFilter', () => {
    const mockProducts = [
      { id: '1', name: 'Apple', description: 'Fresh apple', category: 'Fruits', price: 1.5, stock: 50, image_url: '' },
      { id: '2', name: 'Banana', description: 'Ripe banana', category: 'Fruits', price: 0.5, stock: 100, image_url: '' },
      { id: '3', name: 'Carrot', description: 'Organic carrot', category: 'Vegetables', price: 0.8, stock: 30, image_url: '' },
    ];

    (useProducts as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(
      <MemoryRouter>
        <ProductTable searchQuery="apple" />
      </MemoryRouter>
    );

    const productName = screen.getByText('Apple');
    expect(productName).toBeInTheDocument();

    const nonMatchingProductName = screen.queryByText('Banana');
    expect(nonMatchingProductName).not.toBeInTheDocument();
  });
});