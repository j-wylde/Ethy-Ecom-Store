import { describe, it, vi, expect, beforeEach } from "vitest";
import { useBlogPosts, useBlogPost, useAdminBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/services/blogService";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

describe("blogService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useBlogPosts", () => {
    it("fetches blog posts without limit", async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
      });

      (useQuery as any).mockImplementation(({ queryFn }) => queryFn());

      await useBlogPosts();

      expect(supabase.from).toHaveBeenCalledWith("blog_posts");
    });

    it("fetches blog posts with limit", async () => {
      (supabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
      });

      (useQuery as any).mockImplementation(({ queryFn }) => queryFn());

      await useBlogPosts(5);

      expect(supabase.from).toHaveBeenCalledWith("blog_posts");
    });
  });

  describe("useCreateBlogPost", () => {
    it("creates a blog post and invalidates queries", async () => {
      const mockInvalidateQueries = vi.fn();
      (useQueryClient as any).mockReturnValue({ invalidateQueries: mockInvalidateQueries });

      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: "123" }, error: null }),
      });

      (useMutation as any).mockImplementation(({ mutationFn, onSuccess }) => {
        return {
          mutateAsync: async (data: any) => {
            const result = await mutationFn(data);
            onSuccess(result);
          },
        };
      });

      await useCreateBlogPost().mutateAsync({
        title: "Test Post",
        content: "This is a test post content.",
        published: false,
      });

      expect(supabase.from).toHaveBeenCalledWith("blog_posts");
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["adminBlogPosts"] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["blogPosts"] });
    });
  });

  describe("useUpdateBlogPost", () => {
    it("updates a blog post and invalidates queries", async () => {
      const mockInvalidateQueries = vi.fn();
      (useQueryClient as any).mockReturnValue({ invalidateQueries: mockInvalidateQueries });

      (supabase.from as any).mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: "123" }, error: null }),
      });

      (useMutation as any).mockImplementation(({ mutationFn, onSuccess }) => {
        return {
          mutateAsync: async (data: any) => {
            const result = await mutationFn(data);
            onSuccess(result, data);
          },
        };
      });

      await useUpdateBlogPost().mutateAsync({
        id: "123",
        title: "Updated Post",
        content: "Updated content",
        published: true,
      });

      expect(supabase.from).toHaveBeenCalledWith("blog_posts");
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["adminBlogPosts"] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["blogPosts"] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["blogPost", "123"] });
    });
  });

  describe("useDeleteBlogPost", () => {
    it("deletes a blog post and invalidates queries", async () => {
      const mockInvalidateQueries = vi.fn();
      (useQueryClient as any).mockReturnValue({ invalidateQueries: mockInvalidateQueries });

      (supabase.from as any).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      });

      (useMutation as any).mockImplementation(({ mutationFn, onSuccess }) => {
        return {
          mutateAsync: async (id: string) => {
            const result = await mutationFn(id);
            onSuccess(result);
          },
        };
      });

      await useDeleteBlogPost().mutateAsync("123");

      expect(supabase.from).toHaveBeenCalledWith("blog_posts");
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["adminBlogPosts"] });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["blogPosts"] });
    });
  });
});