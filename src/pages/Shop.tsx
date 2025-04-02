
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Filter, ChevronDown } from "lucide-react";

// Sample product data
const allProducts = [
  {
    id: 1,
    name: "HYDRATING LIP SCRUB",
    price: 8250.00,
    category: "Lip Care",
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/hydrating-lip-scrub",
  },
  {
    id: 2,
    name: "HYDRATING LIP MASK",
    price: 8250.00,
    category: "Lip Care",
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/hydrating-lip-mask",
  },
  {
    id: 3,
    name: "ENY SKIN GIFT CARD",
    priceRange: { min: 50000.00, max: 200000.00 },
    category: "Gift Items",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/eny-skin-gift-card",
  },
  {
    id: 4,
    name: "LIP BUTTER SET 1",
    price: 40400.00,
    category: "Sets",
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/lip-butter-set-1",
  },
  {
    id: 5,
    name: "SONIC JADE ROLLER",
    price: 18800.00,
    category: "Skincare Devices",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/sonic-jade-roller",
  },
  {
    id: 6,
    name: "LIP BUTTER",
    price: 8800.00,
    category: "Lip Care",
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/lip-butter",
  },
  {
    id: 7,
    name: "ES HAIR SCRUNCHIES",
    price: 7150.00,
    category: "EnySkin Extra",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/es-hair-scrunchies",
  },
  {
    id: 8,
    name: "COMPRESSED FACIAL SPONGE",
    price: 12400.00,
    category: "Treatment & Care",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/compressed-facial-sponge",
  },
];

const categories = [
  "All",
  "Lip Care",
  "Skincare Devices",
  "Treatment & Care",
  "Sets",
  "Gift Items",
  "EnySkin Extra",
];

const sortOptions = [
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Name: A to Z",
  "Name: Z to A",
];

const formatPrice = (price: number) => {
  return `₦${price.toLocaleString()}`;
};

const ProductCard = ({ product }: { product: any }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="product-card group">
      <Link to={product.link} className="block relative">
        <div className="relative overflow-hidden rounded-lg h-64 mb-2">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <button 
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
          >
            <Heart 
              size={20} 
              className={isWishlisted ? "fill-coral text-coral" : "text-gray-600"} 
            />
          </button>
        </div>
        <h3 className="font-medium text-center">{product.name}</h3>
        <p className="text-center text-gray-800">
          {product.priceRange ? 
            `${formatPrice(product.priceRange.min)} – ${formatPrice(product.priceRange.max)}` : 
            formatPrice(product.price)}
        </p>
      </Link>
    </div>
  );
};

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });

  // Filter and sort products
  const filteredProducts = allProducts.filter(product => 
    selectedCategory === "All" || product.category === selectedCategory
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10">Shop All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="w-full md:w-1/4 lg:w-1/5 hidden md:block">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="radio"
                    id={category}
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="mr-2"
                  />
                  <label htmlFor={category}>{category}</label>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium text-lg mb-4">Price Range</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button className="coral-button w-full">Apply Filters</button>
            </div>
          </div>
        </div>
        
        {/* Mobile filters button */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg w-full"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown size={18} className={`ml-auto transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border mt-2">
              <h3 className="font-medium text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-${category}`}
                      name="mobile-category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="mr-2"
                    />
                    <label htmlFor={`mobile-${category}`}>{category}</label>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full p-2 border rounded"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button className="coral-button w-full">Apply Filters</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Products section */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex justify-end mb-6">
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-coral focus:border-coral"
              >
                <option disabled>Sort By</option>
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
