
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

const categories = [
  "All Products",
  "Face Care", 
  "Body Care", 
  "Hair Care", 
  "Best Sellers"
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Shop Our Products</h1>
      
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="mb-2"
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Products Grid */}
      <ProductGrid 
        category={activeCategory === "All Products" ? undefined : activeCategory} 
      />
    </div>
  );
};

export default Shop;
