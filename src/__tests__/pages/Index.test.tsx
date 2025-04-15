import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Index from "@/pages/Index";

vi.mock("../../components/Hero", () => ({
  default: () => <div data-testid="hero-component" />,
}));

vi.mock("../../components/CategorySection", () => ({
  default: () => <div data-testid="category-section" />,
}));

vi.mock("../../components/ProductSection", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="product-section">{title}</div>
  ),
}));

describe("Index Page", () => {
  it("should render without crashing", () => {
    render(<Index />);
    expect(screen.getByTestId("hero-component")).toBeInTheDocument();
    expect(screen.getByTestId("category-section")).toBeInTheDocument();
    expect(screen.getByTestId("product-section")).toBeInTheDocument();
  });

  it("should render the Hero component", () => {
    render(<Index />);
    expect(screen.getByTestId("hero-component")).toBeInTheDocument();
  });

  it("should render the CategorySection component", () => {
    render(<Index />);
    expect(screen.getByTestId("category-section")).toBeInTheDocument();
  });

  it("should render the ProductSection component with the correct title", () => {
    render(<Index />);
    expect(screen.getByTestId("product-section")).toHaveTextContent(
      "Latest Products"
    );
  });
});