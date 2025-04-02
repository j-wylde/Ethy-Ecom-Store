
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const categories = [
  "Lip Care",
  "Skincare Devices",
  "Treatment & Care",
  "Sets",
  "Gift Items",
  "EnySkin Extra",
];

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    featured: false,
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This will be replaced with actual Supabase storage and database
      console.log("Product data:", formData);
      console.log("Images:", images);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Product added successfully.",
      });
      
      navigate("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product.",
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
        <h1 className="text-3xl font-semibold">Add New Product</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
              <label htmlFor="price" className="block text-sm font-medium">
                Price (₦) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                required
                className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stock" className="block text-sm font-medium">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                required
                className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Product Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="images" className="block text-sm font-medium">
              Product Images *
            </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              required
              className="w-full p-2 border rounded-md"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500">
              You can select multiple images. First image will be used as the main product image.
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              className="h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded"
              checked={formData.featured as boolean}
              onChange={handleChange}
            />
            <label htmlFor="featured" className="ml-2 block text-sm">
              Feature this product on homepage
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="coral-button"
            >
              {isLoading ? "Adding Product..." : "Add Product"}
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

export default AddProduct;
