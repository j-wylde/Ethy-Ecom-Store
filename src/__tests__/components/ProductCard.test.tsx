import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { Product } from "../../services/productService";

// Mock the useCart hook
const mockAddToCart = vi.fn();
vi.mock("../../contexts/CartContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useCart: () => ({
      addToCart: mockAddToCart,
    }),
  };
});
  
describe("ProductCard", () => {
  it("testProductCardRendersCorrectly", () => {
    const product: Product = {
      id: "1",
      name: "Test Product",
      price: 100,
      image_url: "https://example.com/image.jpg",
      description: "This is a test product",
      shipping_fee: 10,
      featured: true,
    };

    const { getByText, getByAltText } = render(
      <Router>
        <ProductCard product={product} />
      </Router>
    );

    expect(getByText("Test Product")).toBeInTheDocument();
    expect(getByText("₦100.00")).toBeInTheDocument();
    expect(getByText("This is a test product")).toBeInTheDocument();
    expect(getByAltText("Test Product")).toBeInTheDocument();
  });

  it("testAddToCartButtonFunctionality", () => {
    const product: Product = {
      id: "1",
      name: "Test Product",
      price: 100,
      image_url: "https://example.com/image.jpg",
      description: "This is a test product",
      shipping_fee: 10,
      featured: true,
    };


    const { getByLabelText } = render(
      <Router>
        <ProductCard product={product} />
      </Router>
    );

    const addToCartButton = getByLabelText("Add to cart");
    fireEvent.click(addToCartButton);

    // Check if the mock function was called with the correct arguments
    expect(mockAddToCart).toHaveBeenCalledWith(product, 1);
  });

  it("testViewDetailsButtonNavigation", () => {
    const product: Product = {
      id: "1",
      name: "Test Product",
      price: 100,
      image_url: "https://example.com/image.jpg",
      description: "This is a test product",
      shipping_fee: 10,
      featured: true,
    };

    const { getByText } = render(
      <Router>
        <ProductCard product={product} />
      </Router>
    );

    const viewDetailsButton = getByText("View Details");
    expect(viewDetailsButton.closest("a")).toHaveAttribute("href", "/products/1");
  });
});
