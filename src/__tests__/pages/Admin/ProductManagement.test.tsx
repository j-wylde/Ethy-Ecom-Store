import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ProductManagement from '../../../pages/Admin/ProductManagement';

// Mock child components
vi.mock('../../../components/Admin/ProductTable', () => ({
  default: ({ searchQuery }: { searchQuery: string }) => (
    <div data-testid="product-table">{searchQuery}</div>
  )
}));

vi.mock('../../../components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      return <div {...props}>{children}</div>;
    }
    return <button {...props}>{children}</button>;
  }
}));

vi.mock('../../../components/ui/input', () => ({
  Input: (props: any) => <input {...props} />
}));

describe('ProductManagement', () => {
  it('should render the component correctly', () => {
    render(
      <MemoryRouter>
        <ProductManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('Product Management')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  it('should update searchQuery state when typing in the search input', () => {
    render(
      <MemoryRouter>
        <ProductManagement />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Test Product' } });

    expect(searchInput.value).toBe('Test Product');
  });

  it('should navigate to "Add New Product" page when the button is clicked', () => {
    render(
      <MemoryRouter>
        <ProductManagement />
      </MemoryRouter>
    );

    const link = screen.getByText('Add New Product').closest('a');
    expect(link).toHaveAttribute('href', '/admin/products/add');
  });

  it('should pass searchQuery to ProductTable', () => {
    render(
      <MemoryRouter>
        <ProductManagement />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search products...');
    fireEvent.change(searchInput, { target: { value: 'Test Query' } });

    const productTable = screen.getByTestId('product-table');
    expect(productTable).toHaveTextContent('Test Query');
  });
});
