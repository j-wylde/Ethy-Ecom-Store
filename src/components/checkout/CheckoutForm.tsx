
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type CheckoutFormData = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
};

type CheckoutFormProps = {
  formData: CheckoutFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  handleChange,
  isLoading,
  handleSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
      <form onSubmit={handleSubmit} role="form">
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
              readOnly={!!formData.email}
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

        <Button type="submit" className="w-full bg-coral" disabled={isLoading}>
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
