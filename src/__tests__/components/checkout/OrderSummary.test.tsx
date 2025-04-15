import { render } from "@testing-library/react";
import OrderSummary from "@/components/checkout/OrderSummary";
import { describe, it, expect } from "vitest";

describe("OrderSummary Component", () => {
  it("testOrderSummaryRendersCorrectly", () => {
    const items = [
      { product: { id: 1, name: "Product 1", price: 100 }, quantity: 2 },
      { product: { id: 2, name: "Product 2", price: 150 }, quantity: 1 },
    ];
    const subtotal = 350;
    const shippingFee = 50;

    const { getByText } = render(
      <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} />
    );

    expect(getByText("Order Summary")).toBeInTheDocument();
    expect(getByText("Product 1")).toBeInTheDocument();
    expect(getByText("Qty: 2")).toBeInTheDocument();
    expect(getByText("₦200.00")).toBeInTheDocument();
    expect(getByText("Product 2")).toBeInTheDocument();
    expect(getByText("Qty: 1")).toBeInTheDocument();
    expect(getByText("₦150.00")).toBeInTheDocument();
    expect(getByText("Subtotal:")).toBeInTheDocument();
    expect(getByText("₦350.00")).toBeInTheDocument();
    expect(getByText("Shipping:")).toBeInTheDocument();
    expect(getByText("₦50.00")).toBeInTheDocument();
    expect(getByText("Total:")).toBeInTheDocument();
    expect(getByText("₦400.00")).toBeInTheDocument();
  });

  it("testOrderSummaryDisplaysCorrectTotalForMultipleItems", () => {
    const items = [
      { product: { id: 1, name: "Product 1", price: 100 }, quantity: 2 },
      { product: { id: 2, name: "Product 2", price: 150 }, quantity: 1 },
      { product: { id: 3, name: "Product 3", price: 200 }, quantity: 3 },
    ];
    const subtotal = 100 * 2 + 150 * 1 + 200 * 3;
    const shippingFee = 75;

    const { getByText } = render(
      <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} />
    );

    expect(getByText("Total:")).toBeInTheDocument();
    expect(getByText(`₦${(subtotal + shippingFee).toFixed(2)}`)).toBeInTheDocument();
  });

  it("testOrderSummaryHandlesInvalidProductPrice", () => {
    const items = [
      { product: { id: 1, name: "Product 1", price: NaN }, quantity: 2 },
      { product: { id: 2, name: "Product 2", price: 150 }, quantity: 1 },
    ];
    const subtotal = NaN;
    const shippingFee = 50;

    const { getByText } = render(
      <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} />
    );

    expect(getByText("Order Summary")).toBeInTheDocument();
    expect(getByText("Product 1")).toBeInTheDocument();
    expect(getByText("Qty: 2")).toBeInTheDocument();
    expect(getByText("Product 2")).toBeInTheDocument();
    expect(getByText("Qty: 1")).toBeInTheDocument();
    expect(getByText("Subtotal:")).toBeInTheDocument();
    expect(getByText("Shipping:")).toBeInTheDocument();
    expect(getByText("₦50.00")).toBeInTheDocument();
    expect(getByText("Total:")).toBeInTheDocument();
  });
});