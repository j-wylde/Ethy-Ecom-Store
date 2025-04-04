
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category: string | null;
  shipping_fee: number | null;
  featured?: boolean;
};

// Fetch products
export const useProducts = (category?: string, limit?: number, featured?: boolean) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", category, limit, featured],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      if (category) {
        query = query.eq("category", category);
      }

      if (featured) {
        query = query.eq("featured", true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return data as Product[];
    },
  });
};

// Fetch a single product
export const useProduct = (id: string) => {
  return useQuery<Product | null, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      return data as Product;
    },
    enabled: !!id,
  });
};

// Create a product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Product, 
    Error, 
    Omit<Product, "id" | "created_at" | "updated_at">
  >({
    mutationFn: async (product) => {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error("Error creating product:", error);
        throw error;
      }

      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Update a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Product,
    Error,
    { id: string; product: Partial<Product> }
  >({
    mutationFn: async ({ id, product }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating product:", error);
        throw error;
      }

      return data as Product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("Error deleting product:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Upload product image
export const useUploadProductImage = () => {
  return useMutation<
    string, 
    Error, 
    { productId: string; imageFile: File }
  >({
    mutationFn: async ({ productId, imageFile }) => {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${productId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);

      return data.publicUrl;
    },
  });
};
