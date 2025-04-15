import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BlogEditor from '@/pages/Admin/BlogEditor';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock implementations
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: mockToast })),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        title: 'Existing Title',
        content: 'Existing Content',
        published: true,
        image_url: 'http://example.com/image.jpg',
      },
      error: null,
    }),
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({ error: null }),
      getPublicUrl: vi.fn().mockReturnValue({
        data: { publicUrl: 'http://example.com/new-image.jpg' },
      }),
    },
  },
}));

const mockMutateAsync = vi.fn().mockResolvedValue({});
vi.mock('@/services/blogService', () => ({
  useCreateBlogPost: () => ({ mutateAsync: mockMutateAsync }),
  useUpdateBlogPost: () => ({ mutateAsync: mockMutateAsync }),
}));

describe('BlogEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully update blog post and show success toast', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/blog/edit/1']}>
          <Routes>
            <Route path="/admin/blog/edit/:id" element={<BlogEditor />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Title')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Post Title/i), {
      target: { value: 'Updated Title' },
    });

    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Updated Content' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Post/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated Title',
        content: 'Updated Content',
        published: true,
        image_url: 'http://example.com/image.jpg'
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Blog post updated successfully.',
      });
    });
  });
});
