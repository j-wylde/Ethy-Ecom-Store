import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

const categories = [
  "All Products",
  "Body Care", 
  "Facial Care", 
  "Lip Care", 
  "Intimate Care",
  "Skincare Sets",
];

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [location.search]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams();
    if (category !== "All Products") {
      params.set("category", category);
    }
    navigate({ search: params.toString() });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Shop Our Products</h1>
      
      <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 bg-transparent border-none">
          <Search size={18} />
        </button>
      </form>
      
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => handleCategoryChange(category)}
            className={activeCategory === category ? "mb-2 uppercase bg-coral": "mb-2 uppercase"}
          >
            {category}
          </Button>
        ))}
      </div>
      
      <ProductGrid 
        category={activeCategory === "All Products" ? undefined : activeCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Shop;
