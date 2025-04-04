
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/contexts/CartContext";

type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between">
            <div>
              <span className="font-medium">{item.product.name}</span>
              <span className="text-gray-500 block text-sm">
                Qty: {item.quantity}
              </span>
            </div>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
