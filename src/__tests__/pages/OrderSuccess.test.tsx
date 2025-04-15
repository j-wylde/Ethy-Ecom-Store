import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useParams } from "react-router-dom";
import OrderSuccess from "../../pages/OrderSuccess";
import React from "react";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe("OrderSuccess Page", () => {
  const mockUseParams = useParams as unknown as jest.Mock;

  it("should render the thank you message and order details", () => {
    mockUseParams.mockReturnValue({ orderId: "12345" });

    render(
      <MemoryRouter>
        <OrderSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText("Thank You for Your Order!")).toBeInTheDocument();
    expect(screen.getByText("Your order has been placed successfully.")).toBeInTheDocument();
    expect(screen.getByText("Order ID:")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
  });

  it("should render the 'View My Orders' and 'Continue Shopping' links", () => {
    mockUseParams.mockReturnValue({ orderId: "12345" });

    render(
      <MemoryRouter>
        <OrderSuccess />
      </MemoryRouter>
    );

    const viewOrdersLink = screen.getByText("View My Orders");
    const continueShoppingLink = screen.getByText("Continue Shopping");

    expect(viewOrdersLink).toBeInTheDocument();
    expect(viewOrdersLink.closest("a")).toHaveAttribute("href", "/account");

    expect(continueShoppingLink).toBeInTheDocument();
    expect(continueShoppingLink.closest("a")).toHaveAttribute("href", "/shop");
  });
});