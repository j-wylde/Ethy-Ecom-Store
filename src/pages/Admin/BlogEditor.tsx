
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { BlogPostType } from "@/components/BlogPost";
import { useCreateBlogPost, useUpdateBlogPost } from "@/services/blogService";

const BlogEditor = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: false,
    image_url: null as string | null
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();

  // Fetch post data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchBlogPost = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title || "",
              content: data.content || "",
              published: data.published || false,
              image_url: data.image_url || null
            });
            
            if (data.image_url) {
              setImagePreview(data.image_url);
            }
          }
        } catch (error: any) {
          console.error("Error fetching blog post:", error);
          toast({
            title: "Error",
            description: "Failed to load blog post data.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchBlogPost();
    }
  }, [id, isEditMode, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return formData.image_url;
    
    const fileExt = image.name.split(".").pop();
    const fileName = `${id || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog/${fileName}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from("blog")
        .upload(filePath, image);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from("blog")
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let imageUrl = formData.image_url;
      
      if (image) {
        imageUrl = await uploadImage();
      }
      
      const blogData = {
        title: formData.title,
        content: formData.content,
        published: formData.published,
        image_url: imageUrl,
      };
      
      if (isEditMode && id) {
        await updateBlogPost.mutateAsync({
          id,
          ...blogData
        });
        
        toast({
          title: "Success",
          description: "Blog post updated successfully."
        });
      } else {
        await createBlogPost.mutateAsync(blogData);
        
        toast({
          title: "Success",
          description: "Blog post created successfully."
        });
      }
      
      navigate("/admin/blog");
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-6">
          <Link to="/admin/blog" className="mr-4 text-gray-500 hover:text-coral">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-semibold">
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-coral" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link to="/admin/blog" className="mr-4 text-gray-500 hover:text-coral">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-semibold">
          {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
        </h1>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter post title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              placeholder="Write your blog post content here..."
              className="resize-y"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-40 h-40 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="published">Publish this post</Label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="coral-button flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? "Update Post" : "Create Post"}
            </Button>
            <Link to="/admin/blog" className="coral-outline-button">
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BlogEditor;
