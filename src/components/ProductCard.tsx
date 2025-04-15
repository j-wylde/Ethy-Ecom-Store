
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, image_url, description, shipping_fee } = product;
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image_url || "/placeholder.svg"}
          alt={name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <h3 className="font-semibold truncate text-lg">{name}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {description || "No description available"}
        </p>
        <p className="font-bold text-lg">₦{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/products/${id}`}>View Details</Link>
        </Button>
        <Button className="shrink-0 bg-coral" aria-label="Add to cart" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
