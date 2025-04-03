
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BlogPostType } from "@/components/BlogPost";

export const useBlogPosts = (limit?: number) => {
  return useQuery({
    queryKey: ["blogPosts", limit],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as BlogPostType[];
    }
  });
};

export const useBlogPost = (id: string) => {
  return useQuery({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as BlogPostType;
    },
    enabled: !!id
  });
};

export const useAdminBlogPosts = () => {
  return useQuery({
    queryKey: ["adminBlogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as BlogPostType[];
    }
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: Omit<BlogPostType, "id">) => {
      // Remove any Promise values (like author_id) and replace with null
      const sanitizedPost = { ...post };
      
      // Convert any Promise values to their resolved values or null
      if (sanitizedPost.author_id instanceof Promise) {
        try {
          sanitizedPost.author_id = await sanitizedPost.author_id;
        } catch {
          sanitizedPost.author_id = null;
        }
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([sanitizedPost])
        .select()
        .single();

      if (error) {
        console.error("Error creating blog post:", error);
        throw new Error(error.message);
      }

      return data as BlogPostType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    }
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...post }: Partial<BlogPostType> & { id: string }) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(post)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as BlogPostType;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", variables.id] });
    }
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    }
  });
};
