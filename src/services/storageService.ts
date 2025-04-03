
import { supabase } from "@/integrations/supabase/client";

export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${productId}/${Date.now()}.${fileExt}`;
  
  // Determine bucket based on ID prefix
  const bucket = productId.startsWith('blog_') ? 'blog_posts' : 'products';
  
  // Upload the file to Supabase storage
  const { error: uploadError } = await supabase
    .storage
    .from(bucket)
    .upload(filePath, file);
  
  if (uploadError) {
    throw uploadError;
  }
  
  // Get the public URL
  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
