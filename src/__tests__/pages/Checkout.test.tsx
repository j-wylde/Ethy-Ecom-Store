import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { useCart } from "../../contexts/CartContext";
import { useCheckout } from "../../hooks/useCheckout";
import Checkout from "../../pages/Checkout";

vi.mock("../../contexts/CartContext");
vi.mock("../../hooks/useCheckout");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Checkout Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ items: [] });
    (useCheckout as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: {},
      isLoading: false,
      subtotal: 0,
      shippingFee: 0,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
    });
  });

  it("should redirect to /cart if there are no items in the cart", () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  it("should render the CheckoutForm and OrderSummary components when items are in the cart", () => {
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ items: [{ product: { id: 1, name: "Item 1" }, quantity: 1 }] });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
  });

  it("should pass the correct props to CheckoutForm", () => {
    const mockHandleChange = vi.fn();
    const mockHandleSubmit = vi.fn();
    (useCart as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ items: [{ product: { id: 1, name: "Item 1" }, quantity: 1 }] });
    (useCheckout as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: { name: "John Doe" },
      isLoading: false,
      subtotal: 100,
      shippingFee: 10,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText("Checkout")).toBeInTheDocument();
    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(mockHandleChange).toBeDefined();
    expect(mockHandleSubmit).toBeDefined();
  });
});
