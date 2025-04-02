
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-lg mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-gray-500 mb-6">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
        <p className="mb-8">
          We've sent a confirmation email with the order details.
          You can also track your order in your account dashboard.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/account">
              View My Orders
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/shop">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
