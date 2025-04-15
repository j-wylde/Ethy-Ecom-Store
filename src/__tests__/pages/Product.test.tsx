import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useParams } from "react-router-dom";
import Product from "../../pages/Product";
import React from "react";
import { useProduct } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock("@/services/productService", () => ({
  useProduct: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

describe("Product Page", () => {
  const mockUseParams = useParams as unknown as jest.Mock;
  const mockUseProduct = useProduct as jest.Mock;
  const mockUseToast = useToast as jest.Mock;
  const mockUseCart = useCart as jest.Mock;

  const mockToast = vi.fn();
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: "1" });
    mockUseToast.mockReturnValue({ toast: mockToast });
    mockUseCart.mockReturnValue({ addToCart: mockAddToCart });
  });

  it("should render loading state", () => {
    mockUseProduct.mockReturnValue({ data: null, isLoading: true, error: null });
  
    render(
      <MemoryRouter>
        <Product />
      </MemoryRouter>
    );
  
    // Check for skeleton loader
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  it("should render error state", () => {
    mockUseProduct.mockReturnValue({ data: null, isLoading: false, error: { message: "Error fetching product" } });

    render(
      <MemoryRouter>
        <Product />
      </MemoryRouter>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Product not found")).toBeInTheDocument();
    expect(screen.getByText("Error: Error fetching product")).toBeInTheDocument();
  });

  it("should render product details", () => {
    mockUseProduct.mockReturnValue({
      data: {
        name: "Test Product",
        price: 1000,
        description: "Test Description",
        stock: 5,
        image_url: "/test-image.jpg",
      },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Product />
      </MemoryRouter>
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("₦1000.00")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("5 in Stock")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toHaveAttribute("src", "/test-image.jpg");
  });

  it("should handle quantity change", () => {
    mockUseProduct.mockReturnValue({
      data: {
        name: "Test Product",
        price: 1000,
        description: "Test Description",
        stock: 5,
        image_url: "/test-image.jpg",
      },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Product />
      </MemoryRouter>
    );

    const quantity = screen.getByText("1");
    const increaseButton = screen.getByLabelText("Increase quantity");
    const decreaseButton = screen.getByLabelText("Decrease quantity");

    fireEvent.click(increaseButton);
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(decreaseButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle add to cart", () => {
    mockUseProduct.mockReturnValue({
      data: {
        name: "Test Product",
        price: 1000,
        description: "Test Description",
        stock: 5,
        image_url: "/test-image.jpg",
      },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <Product />
      </MemoryRouter>
    );

    const addToCartButton = screen.getByLabelText("Add to cart");
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(
      {
        name: "Test Product",
        price: 1000,
        description: "Test Description",
        stock: 5,
        image_url: "/test-image.jpg",
      },
      1
    );
    expect(mockToast).toHaveBeenCalledWith({
      title: "Added to cart",
      description: "1 item added to your cart",
    });
  });
});