import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import UserManagement from '../../../pages/Admin/UserManagement';

const mockProfiles = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Dose',
    avatar_url: null,
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    avatar_url: null,
    created_at: '2023-02-01T00:00:00Z',
  },
];

vi.mock('integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockProfiles, error: null }))
      }))
    }))
  },
}));

vi.mock('components/ui/input', () => ({
  Input: ({ placeholder, ...props }: any) => (
    <input 
      placeholder={placeholder} 
      {...props} 
      data-testid="search-input"
    />
  ),
}));

vi.mock('components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock('components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div 
      className={className} 
      data-testid="skeleton"
      aria-label="loading"
    ></div>
  ),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const queryClient = new QueryClient();

describe('UserManagement', () => {
  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UserManagement />
        </MemoryRouter>
      </QueryClientProvider>
    );

  beforeEach(() => {
    (useQuery as unknown as jest.Mock) = vi.fn();
  });





  it('should render the component correctly', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockProfiles,
      isLoading: false,
      error: null,
    });

    renderComponent();
    
    await screen.findByTestId('search-input');

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should display loading skeletons when data is loading', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderComponent();

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('should display error message when there is an error', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load users'),
    });

    renderComponent();

    expect(await screen.findByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent(/failed to load users/i);
  });

  it('should update searchQuery state when typing in the search input', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockProfiles,
      isLoading: false,
      error: null,
    });

    renderComponent();
    
    await screen.findByTestId('search-input');

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(searchInput.value).toBe('John');
  });

  it('should filter profiles based on search query', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockProfiles,
      isLoading: false,
      error: null,
    });

    renderComponent();
    
    await screen.findByText('John Dose');

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Dose')).not.toBeInTheDocument();
  });

  it('should handle pagination correctly', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockProfiles,
      isLoading: false,
      error: null,
    });

    renderComponent();
    
    await screen.findByText('John Dose');

    const nextButton = screen.queryByTestId('pagination-next');
    const prevButton = screen.queryByTestId('pagination-prev');

    // Since only 2 profiles, totalPages = 1, so pagination controls should not be rendered
    expect(nextButton).toBeNull();
    expect(prevButton).toBeNull();
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });
});
