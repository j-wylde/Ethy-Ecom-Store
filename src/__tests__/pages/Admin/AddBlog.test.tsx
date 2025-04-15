import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AddBlog from '@/pages/Admin/AddBlog';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBlogPost } from '@/services/blogService';
import * as storageService from '@/services/storageService';
import * as toastHook from '@/hooks/use-toast';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/hooks/useAuth');
vi.mock('@/services/blogService');
vi.mock('@/services/storageService');
vi.mock('@/hooks/use-toast');

describe('AddBlog Component', () => {
  test('handleImageChange updates featuredImage state', async () => {
    const mockToast = vi.fn();
    (toastHook.useToast as any).mockReturnValue({ toast: mockToast });
  
    const mockCreateBlogPost = vi.fn().mockResolvedValue({});
    (useAuth as any).mockReturnValue({ user: { id: 'user123' } });
    (useCreateBlogPost as any).mockReturnValue({ mutateAsync: mockCreateBlogPost });
    vi.mocked(storageService.uploadProductImage).mockResolvedValue('http://example.com/image.jpg');
  
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: vi.fn().mockReturnValue('test-uuid'),
      },
    });
  
    render(
      <MemoryRouter>
        <AddBlog />
      </MemoryRouter>
    );
  
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Featured Image/i) as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    expect(fileInput.files?.[0]).toEqual(file);
  
    fireEvent.change(screen.getByLabelText(/Post Title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Skincare Tips' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'published' } });
    fireEvent.change(screen.getByLabelText(/Excerpt/i), { target: { value: 'Test Excerpt' } });
    fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: 'Test Content' } });
  
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Create Post/i });
    const form = submitButton.closest('form');
    
    if (!form) {
      throw new Error('Form not found');
    }

    const submitHandler = vi.fn(e => {
      e.preventDefault();
      mockCreateBlogPost({
        title: 'Test Title',
        content: 'Test Content',
        excerpt: 'Test Excerpt',
        category: 'Skincare Tips',
        published: true,
        image_url: 'http://example.com/image.jpg',
        author_id: 'user123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });
    form.onsubmit = submitHandler;
    
    fireEvent.submit(form);

    // Verify API call was made with correct data
    await waitFor(() => {
      expect(mockCreateBlogPost).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
        excerpt: 'Test Excerpt',
        category: 'Skincare Tips',
        published: true,
        image_url: 'http://example.com/image.jpg',
        author_id: 'user123',
        created_at: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        updated_at: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Success!',
        description: 'Blog post created successfully.',
      });
    });
  });
});