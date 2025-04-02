
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/components/ProductGrid";

interface ProductSectionProps {
  title: string;
  category?: string;
  showViewMore?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  category,
  showViewMore = true,
}) => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        {showViewMore && (
          <Button asChild variant="outline">
            <Link to="/shop">View All</Link>
          </Button>
        )}
      </div>
      <ProductGrid category={category} limit={8} />
    </section>
  );
};

export default ProductSection;
