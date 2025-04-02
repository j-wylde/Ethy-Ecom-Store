
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // This will be implemented when we build cart functionality
    toast({
      title: "Added to cart",
      description: `${quantity} ${product?.name} added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="overflow-hidden rounded-lg">
          <img 
            src={product.image_url || "/placeholder.svg"} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-coral mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{product.description || "No description available."}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleQuantityChange(-1)} 
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleQuantityChange(1)} 
                disabled={quantity >= (product.stock || 10)}
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Stock Status */}
          <p className="mb-6">
            Status: {' '}
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>
          
          {/* Add to Cart Button */}
          <Button 
            className="w-full mb-4" 
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
