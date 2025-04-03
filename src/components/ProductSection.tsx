
import React from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from './ProductGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductSectionProps {
  title: string;
  category?: string;
  limit?: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  category,
  limit = 4 
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center font-medium mb-8">{title}</h2>
        
        <ProductGrid category={category} limit={limit} />
        
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="coral-outline-button">
            <Link to="/shop" className="flex items-center">
              View All Products 
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
