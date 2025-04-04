
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Define and export the Product type
export type Product = Tables<"products">;

// Fetch all products
export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (category && category !== "All Products") {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      return data as Product[];
    },
  });
};

// Fetch a single product by ID
export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Partial<Product> }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", data.id] });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Featured products
export const useFeaturedProducts = (limit = 4) => {
  return useQuery({
    queryKey: ["featuredProducts", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .limit(limit);

      if (error) throw error;
      return data as Product[];
    },
  });
};

// Upload product image - this function is needed for the AddProduct component
export const useUploadProductImage = () => {
  return useMutation({
    mutationFn: async ({ productId, imageFile }: { productId: string; imageFile: File }) => {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${productId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('products')
        .upload(filePath, imageFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase
        .storage
        .from('products')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    }
  });
};
