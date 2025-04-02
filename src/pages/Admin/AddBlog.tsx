
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "draft",
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    "Skincare Tips",
    "Product Reviews",
    "Beauty Trends",
    "Tutorials",
    "Wellness",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This will be replaced with actual Supabase storage and database
      console.log("Blog post data:", formData);
      console.log("Featured image:", featuredImage);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Blog post created successfully.",
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-coral">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-semibold">Add New Blog Post</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium">
                Status *
              </label>
              <select
                id="status"
                name="status"
                required
                className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="block text-sm font-medium">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              required
              className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="A brief summary of your post"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              required
              className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
              value={formData.content}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="featuredImage" className="block text-sm font-medium">
              Featured Image *
            </label>
            <input
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              required
              className="w-full p-2 border rounded-md"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="coral-button"
            >
              {isLoading ? "Creating Post..." : "Create Post"}
            </button>
            <Link to="/admin/dashboard" className="coral-outline-button">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
