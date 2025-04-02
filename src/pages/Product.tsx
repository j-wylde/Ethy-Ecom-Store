
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react";

// Mock product data
const productsData = {
  "hydrating-lip-scrub": {
    id: 1,
    name: "HYDRATING LIP SCRUB",
    price: 8250.00,
    description: "A gentle exfoliating scrub that removes dead skin cells from the lips, leaving them soft and smooth. Enriched with natural oils and butters for deep hydration.",
    features: [
      "Gently exfoliates lips",
      "Removes dry, flaky skin",
      "Hydrates and nourishes",
      "Made with natural ingredients",
      "Leaves lips soft and smooth",
    ],
    howToUse: "Apply a small amount to lips and gently massage in circular motions. Rinse off with warm water. Use 2-3 times a week for best results.",
    ingredients: "Sugar, Beeswax, Shea Butter, Coconut Oil, Jojoba Oil, Vitamin E, Natural Flavor.",
    category: "Lip Care",
    stock: 25,
    images: [
      "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
      "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    ],
    reviews: [
      { id: 1, author: "Sarah J.", rating: 5, comment: "This lip scrub is amazing! My lips have never been so soft." },
      { id: 2, author: "Michael T.", rating: 4, comment: "Works great for removing dry skin. Pleasant taste too!" },
      { id: 3, author: "Emma L.", rating: 5, comment: "I use this twice a week and my lips are no longer dry and cracked." },
    ],
  },
};

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();

  // Get product data based on slug
  const product = slug ? productsData[slug as keyof typeof productsData] : null;

  if (!product) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="coral-button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  const addToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const calculateAverageRating = () => {
    if (product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="mb-4 overflow-hidden rounded-lg">
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`border rounded-md overflow-hidden w-20 h-20 flex-shrink-0 ${
                  activeImageIndex === index ? "border-coral" : "border-gray-200"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= averageRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews.length} reviews)
            </span>
          </div>
          
          <p className="text-2xl font-semibold mb-6">₦{product.price.toLocaleString()}</p>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            <ul className="space-y-2 mb-4">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-coral mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center mb-6">
            <p className="mr-4">Quantity:</p>
            <div className="flex items-center border rounded-md">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="px-3 py-2 text-gray-600 hover:text-coral disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
                className="px-3 py-2 text-gray-600 hover:text-coral disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="ml-4 text-sm text-gray-600">
              {product.stock} available
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={addToCart}
              className="coral-button flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className="coral-outline-button flex items-center justify-center gap-2"
            >
              <Heart
                size={18}
                className={isWishlisted ? "fill-coral" : ""}
              />
              {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
            </button>
          </div>
          
          <div className="border-t border-b py-4 space-y-2">
            <div className="flex items-center">
              <Truck size={18} className="mr-2 text-coral" />
              <p>Free shipping on orders over ₦50,000</p>
            </div>
            <p className="text-sm text-gray-600">
              Category: {product.category}
            </p>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "description"
                  ? "border-b-2 border-coral text-coral"
                  : "text-gray-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("howToUse")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "howToUse"
                  ? "border-b-2 border-coral text-coral"
                  : "text-gray-600"
              }`}
            >
              How To Use
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "ingredients"
                  ? "border-b-2 border-coral text-coral"
                  : "text-gray-600"
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-b-2 border-coral text-coral"
                  : "text-gray-600"
              }`}
            >
              Reviews ({product.reviews.length})
            </button>
          </div>
        </div>
        
        <div className="py-4">
          {activeTab === "description" && (
            <div>
              <p className="mb-4">{product.description}</p>
              <ul className="space-y-2 list-disc pl-6">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === "howToUse" && (
            <div>
              <p>{product.howToUse}</p>
            </div>
          )}
          
          {activeTab === "ingredients" && (
            <div>
              <p>{product.ingredients}</p>
            </div>
          )}
          
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{review.author}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
              
              <div className="pt-4">
                <Link to="#" className="coral-outline-button inline-block">
                  Write a Review
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
