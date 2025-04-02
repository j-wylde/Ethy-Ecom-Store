
import React from "react";
import { useProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  category?: string;
  limit?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, limit }) => {
  const { data: products, isLoading, error } = useProducts(category);
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }
  
  const displayProducts = limit && products ? products.slice(0, limit) : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading ? (
        // Skeleton loading state
        Array.from({ length: limit || 8 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))
      ) : displayProducts && displayProducts.length > 0 ? (
        displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
