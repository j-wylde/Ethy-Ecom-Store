
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import emailjs from "emailjs-com";

type CheckoutFormData = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
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

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

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
        product_name: item.product.name
      }));

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{ 
          user_id: user.id, 
          total: subtotal,
          status: "paid" // In a real application, this would be set after payment processing
        }])
        .select()
        .single();

      if (orderError || !order) throw orderError || new Error("Failed to create order");

      // Insert order items
      for (const item of orderItems) {
        const { error: itemError } = await supabase
          .from("order_items")
          .insert([{
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }]);

        if (itemError) throw itemError;
      }

      // Send email using EmailJS
      const productsTable = items.map(item => 
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${item.product.price.toFixed(2)}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>`
      ).join("");

      const emailParams = {
        to_email: "yung.jeri56@gmail.com",
        from_name: formData.fullName,
        from_email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`,
        order_details: `
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Total</th>
            </tr>
            ${productsTable}
            <tr>
              <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">$${subtotal.toFixed(2)}</td>
            </tr>
          </table>
        `,
        notes: formData.notes || "No additional notes",
      };

      // Replace these IDs with your actual EmailJS service, template, and user IDs
      await emailjs.send(
        "service_id", // Your EmailJS service ID
        "template_id", // Your EmailJS template ID
        emailParams,
        "user_id" // Your EmailJS user ID
      );

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

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly={!!user?.email}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Special instructions for delivery, etc."
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
