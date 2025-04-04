
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
        <h2 className="section-title text-center font-medium mb-8 text-base md:text-lg w-full mx-auto">{title}</h2>
        
        <ProductGrid category={category} limit={limit} />
        
        <div className="mt-12 text-center">
          <Button asChild variant="default" className="bg-coral text-white hover:bg-black hover:text-white">
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
