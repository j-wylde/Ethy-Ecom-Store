
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const useProducts = (categoryFilter?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchProducts = async (): Promise<Product[]> => {
    setIsLoading(true);
    
    try {
      let query = supabase.from("products").select("*");
      
      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data as Product[];
    } finally {
      setIsLoading(false);
    }
  };
  
  return useQuery({
    queryKey: ["products", categoryFilter],
    queryFn: fetchProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Product;
    },
    enabled: !!id,
  });
};
