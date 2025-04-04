import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { 
  useProduct, 
  useCreateProduct, 
  useUpdateProduct,
  useUploadProductImage 
} from "@/services/productService";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  "Lip Care",
  "Skincare Devices",
  "Treatment & Care",
  "Sets",
  "Gift Items",
  "EnySkin Extra",
];

const AddProduct = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    featured: false,
    image_url: null as string | null,
    shipping_fee: "",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: product, isLoading: isProductLoading } = useProduct(id || "");
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadProductImage();
  
  const isLoading = isCreating || isUpdating || isUploading || isProductLoading;

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category || "",
        featured: false,
        image_url: product.image_url || null,
        shipping_fee: product.shipping_fee || "",
      });
      
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [isEditMode, product]);

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
    if (e.target.files && e.target.files.length > 0) {
      setImages(e.target.files);
      
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image_url: formData.image_url || null,
        shipping_fee: parseFloat(formData.shipping_fee || "0"),
      };
      
      let savedProduct;
      
      if (isEditMode && id) {
        savedProduct = await updateProduct({
          id,
          ...productData,
        });
        
        toast({
          title: "Success!",
          description: "Product updated successfully.",
        });
      } else {
        savedProduct = await createProduct(productData);
        
        toast({
          title: "Success!",
          description: "Product created successfully.",
        });
      }
      
      if (images && images.length > 0 && savedProduct) {
        const imageUrl = await uploadImage({ 
          file: images[0], 
          productId: savedProduct.id 
        });
        
        await updateProduct({
          id: savedProduct.id,
          image_url: imageUrl
        });
      }
      
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product.",
        variant: "destructive",
      });
    }
  };

  const pageTitle = isEditMode ? "Edit Product" : "Add New Product";
  const submitButtonText = isEditMode 
    ? (isLoading ? "Updating Product..." : "Update Product")
    : (isLoading ? "Adding Product..." : "Add Product");

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Link to="/admin/products" className="mr-4 text-gray-500 hover:text-coral">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-semibold">{pageTitle}</h1>
      </div>

      {isEditMode && isProductLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-coral" />
        </div>
      ) : (
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
                {isEditMode ? "Product Image (leave empty to keep current)" : "Product Image *"}
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                className="w-full p-2 border rounded-md"
                onChange={handleImageChange}
                required={!isEditMode && !imagePreview}
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-md border"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload a high-quality image of your product.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="shipping_fee" className="block text-sm font-medium">
                Shipping Fee (₦)
              </label>
              <input
                type="number"
                id="shipping_fee"
                name="shipping_fee"
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md focus:ring-coral focus:border-coral"
                value={formData.shipping_fee}
                onChange={handleChange}
              />
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
                className="coral-button flex items-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitButtonText}
              </button>
              <Link to="/admin/products" className="coral-outline-button">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
