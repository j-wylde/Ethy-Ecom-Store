
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type CheckoutFormData = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
};

export const useCheckout = () => {
  const { items, subtotal, shippingFee, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create an order in the database
      if (!user) throw new Error("User is not authenticated");

      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        product_name: item.product.name,
        shipping_fee: item.product.shipping_fee || 0
      }));

      const total = subtotal + shippingFee;

      // Create the order in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{ 
          user_id: user.id, 
          total: total,
          status: "paid", // In a real application, this would be set after payment processing
          customer_name: formData.fullName
        }])
        .select()
        .single();

      if (orderError || !order) {
        console.error("Order creation error:", orderError);
        throw orderError || new Error("Failed to create order");
      }

      // Insert order items
      for (const item of orderItems) {
        const { error: itemError } = await supabase
          .from("order_items")
          .insert([{
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            shipping_fee: item.shipping_fee
          }]);

        if (itemError) {
          console.error("Order item creation error:", itemError);
          throw itemError;
        }
      }

      // Send email using Supabase Edge Function
      const emailData = {
        to_email: "yung.jeri56@gmail.com",
        from_name: formData.fullName,
        from_email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
        order_details: items.map(item => ({
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          shipping_fee: item.product.shipping_fee || 0
        })),
        total: total,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        notes: formData.notes || "No additional notes",
      };

      const { error: emailError } = await supabase.functions.invoke('send-order-email', {
        body: emailData
      });

      if (emailError) {
        console.error("Email sending error:", emailError);
        // Continue with order confirmation even if email fails
      }

      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed and email has been sent.",
      });

      // Clear the cart and redirect to a confirmation page
      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Failed to place order",
        description: error.message || "An error occurred during checkout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    subtotal,
    shippingFee,
    formData,
    isLoading,
    handleChange,
    handleSubmit
  };
};
