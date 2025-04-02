
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

// Sample product data
const products = [
  {
    id: 1,
    name: "HYDRATING LIP SCRUB",
    price: 8250.00,
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/hydrating-lip-scrub",
  },
  {
    id: 2,
    name: "HYDRATING LIP MASK",
    price: 8250.00,
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/hydrating-lip-mask",
  },
  {
    id: 3,
    name: "ENY SKIN GIFT CARD",
    priceRange: { min: 50000.00, max: 200000.00 },
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/eny-skin-gift-card",
  },
  {
    id: 4,
    name: "LIP BUTTER SET 1",
    price: 40400.00,
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/lip-butter-set-1",
  },
  {
    id: 5,
    name: "SONIC JADE ROLLER",
    price: 18800.00,
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/sonic-jade-roller",
  },
  {
    id: 6,
    name: "LIP BUTTER",
    price: 8800.00,
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    link: "/products/lip-butter",
  },
  {
    id: 7,
    name: "ES HAIR SCRUNCHIES",
    price: 7150.00,
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/es-hair-scrunchies",
  },
  {
    id: 8,
    name: "COMPRESSED FACIAL SPONGE",
    price: 12400.00,
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    link: "/products/compressed-facial-sponge",
  },
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

const ProductSection = ({ title = "Latest Products" }: { title?: string }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">{title}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Link to="/shop" className="coral-button flex items-center">
            ALL PRODUCTS <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
