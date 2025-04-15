import { render, screen, fireEvent } from "@testing-library/react";
import { vi, Mock } from "vitest";
import Cart from "@/pages/Cart";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("Cart", () => {
  const mockUseCart = useCart as Mock;
  const mockUseAuth = useAuth as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display empty cart message when no items are in the cart", () => {
    mockUseCart.mockReturnValue({
      items: [],
      subtotal: 0,
      totalItems: 0,
      shippingFee: 0,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    });
    mockUseAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/continue shopping/i)).toBeInTheDocument();
  });

  it("should display cart items and order summary when items are in the cart", () => {
    mockUseCart.mockReturnValue({
      items: [
        {
          product: {
            id: "1",
            name: "Product 1",
            price: 100,
            stock: 10,
            image_url: "/product1.jpg",
            category: "Category 1",
          },
          quantity: 2,
        },
      ],
      subtotal: 200,
      totalItems: 2,
      shippingFee: 50,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    });
    mockUseAuth.mockReturnValue({ user: { id: "user1" } });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();
    expect(screen.getByText("₦100.00")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("₦200.00").length).toBeGreaterThan(0);
    expect(screen.getByText("₦50.00")).toBeInTheDocument();
    expect(screen.getByText("₦250.00")).toBeInTheDocument();
  });

  it("should call updateQuantity when quantity buttons are clicked", () => {
    const mockUpdateQuantity = vi.fn();
    mockUseCart.mockReturnValue({
      items: [
        {
          product: {
            id: "1",
            name: "Product 1",
            price: 100,
            stock: 10,
            image_url: "/product1.jpg",
          },
          quantity: 2,
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeFromCart: vi.fn(),
      subtotal: 200,
      totalItems: 2,
      shippingFee: 50,
    });


    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const incrementButton = screen.getByRole("button", { name: /plus/i });
    fireEvent.click(incrementButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 3);

    const decrementButton = screen.getByRole("button", { name: /minus/i });
    fireEvent.click(decrementButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("1", 1);
  });

  it("should call removeFromCart when remove button is clicked", () => {
    const mockRemoveFromCart = vi.fn();
    mockUseCart.mockReturnValue({
      items: [
        {
          product: {
            id: "1",
            name: "Product 1",
            price: 100,
            stock: 10,
            image_url: "/product1.jpg",
          },
          quantity: 2,
        },
      ],
      removeFromCart: mockRemoveFromCart,
      updateQuantity: vi.fn(),
      subtotal: 200,
      totalItems: 2,
      shippingFee: 50,
    });


    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const removeButton = screen.getByRole("button", { name: /remove item/i });
    fireEvent.click(removeButton);
    expect(mockRemoveFromCart).toHaveBeenCalledWith("1");
  });

  it("should disable checkout button for logged-out users", () => {
    mockUseCart.mockReturnValue({
      items: [
        {
          product: {
            id: "1",
            name: "Product 1",
            price: 100,
            stock: 10,
            image_url: "/product1.jpg",
          },
          quantity: 2,
        },
      ],
      subtotal: 200,
      totalItems: 2,
      shippingFee: 50,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
    });
    mockUseAuth.mockReturnValue({ user: null });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const checkoutButton = screen.getByRole("link", { name: /login to checkout/i });
    expect(checkoutButton).toHaveAttribute("disabled");
  });

  it("should enable checkout button for logged-in users", () => {
    mockUseCart.mockReturnValue({
      items: [
        {
          product: {
            id: "1",
            name: "Product 1",
            price: 100,
            stock: 10,
            image_url: "/product1.jpg",
          },
          quantity: 2,
        },
      ],
      subtotal: 200,
      totalItems: 2,
      shippingFee: 50,
    });
    mockUseAuth.mockReturnValue({ user: { id: "user1" } });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const checkoutButton = screen.getByRole("link", { name: /proceed to checkout/i });
    expect(checkoutButton).toBeEnabled();
  });
});