import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import BlogManagement from '@/pages/Admin/BlogManagement';
import { useAdminBlogPosts, useDeleteBlogPost } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

// Mock hooks
vi.mock('@/services/blogService', () => ({
  useAdminBlogPosts: vi.fn(),
  useDeleteBlogPost: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('BlogManagement', () => {
  const mockToast = vi.fn();
  const mockDeleteBlogPost = { mutateAsync: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as unknown as jest.Mock).mockReturnValue({ toast: mockToast });
    (useDeleteBlogPost as unknown as jest.Mock).mockReturnValue(mockDeleteBlogPost);
  });

  it('should render loading state initially', () => {
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: [], isLoading: true });

    render(
      <MemoryRouter>
        <BlogManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading blog posts.../i)).toBeInTheDocument();
  });

  it('should render empty state when no posts are available', () => {
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: [], isLoading: false });

    render(
      <MemoryRouter>
        <BlogManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/No blog posts found/i)).toBeInTheDocument();
  });

  it('should display blog posts', () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', created_at: '2023-01-01', published: true },
      { id: '2', title: 'Post 2', created_at: '2023-01-02', published: false },
    ];
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: mockPosts, isLoading: false });

    render(
      <MemoryRouter>
        <BlogManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('should filter blog posts based on search term', () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', created_at: '2023-01-01', published: true },
      { id: '2', title: 'Another Post', created_at: '2023-01-02', published: false },
    ];
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: mockPosts, isLoading: false });

    render(
      <MemoryRouter>
        <BlogManagement />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search posts.../i);
    fireEvent.change(searchInput, { target: { value: 'Another' } });

    expect(screen.queryByText('Post 1')).not.toBeInTheDocument();
    expect(screen.getByText('Another Post')).toBeInTheDocument();
  });

  it('should delete a blog post and show success toast', async () => {
    const mockPosts = [
      { id: '1', title: 'Post 1', created_at: '2023-01-01', published: true },
    ];
    (useAdminBlogPosts as unknown as jest.Mock).mockReturnValue({ data: mockPosts, isLoading: false });

    render(
      <MemoryRouter>
        <BlogManagement />
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteBlogPost.mutateAsync).toHaveBeenCalledWith('1');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    });
  });
});