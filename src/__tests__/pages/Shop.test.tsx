import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import Shop, {categories} from "@/pages/Shop";

// Mock dependencies
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock("@/components/ProductGrid", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="product-grid"></div>),
}));

describe("Shop Page", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocation as unknown as jest.Mock).mockReturnValue({ search: "" });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("should render the Shop page with title, search input, and category buttons", () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    expect(screen.getByText("Shop Our Products")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("should update the active category and URL when a category is clicked", () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    const categoryButton = screen.getByText("Body Care");
    fireEvent.click(categoryButton);

    expect(categoryButton).toHaveClass("bg-coral");
    expect(mockNavigate).toHaveBeenCalledWith({ search: "category=Body+Care" });
  });

  it("should update the search query state when typing in the search input", () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "lotion" } });

    expect(searchInput).toHaveValue("lotion");
  });

  it("should pass the correct props to ProductGrid", () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    expect(screen.getByTestId("product-grid")).toBeInTheDocument();
  });

  it("should set the active category based on the URL query parameter", () => {
    (useLocation as unknown as jest.Mock).mockReturnValue({ search: "?category=Facial+Care" });

    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    );

    const activeCategoryButton = screen.getByText("Facial Care");
    expect(activeCategoryButton).toHaveClass("bg-coral");
  });
});