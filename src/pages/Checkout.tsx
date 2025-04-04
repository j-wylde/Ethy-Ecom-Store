
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useCheckout } from "@/hooks/useCheckout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

const Checkout = () => {
  const { items } = useCart();
  const navigate = useNavigate();
  const { 
    formData, 
    isLoading, 
    subtotal,
    handleChange, 
    handleSubmit 
  } = useCheckout();

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            formData={formData}
            handleChange={handleChange}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary items={items} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
