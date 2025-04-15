
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems, shippingFee } = useCart();
  const { user } = useAuth();
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-center">Price</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product.id} className="border-t">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden mr-4">
                          <img
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          {item.product.category && (
                            <p className="text-sm text-gray-500">
                              {item.product.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                    ₦{item.product.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Minus"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Plus"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">
                    ₦{(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Remove item"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Button asChild variant="outline" className="mr-4">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({totalItems}):</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingFee > 0 ? `₦${shippingFee.toFixed(2)}` : "Free"}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-coral"
                asChild
                disabled={!user}
              >
                <Link to={user ? "/checkout" : "/login?redirect=/checkout"}>
                  {user ? (
                    <>
                      Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>Login to Checkout</>
                  )}
                </Link>
              </Button>
              {!user && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  You need to be logged in to complete your purchase
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
