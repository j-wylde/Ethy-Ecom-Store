import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import CartIcon from "../../components/CartIcon";
import { describe, it, expect } from "vitest";
import { CartProvider}  from "../../contexts/CartContext";

describe("CartIcon Component", () => {
  it("test_cart_icon_click_redirects_to_cart", () => {
    const { getByRole } = render(
      <CartProvider>
        <BrowserRouter>
            <CartIcon />
        </BrowserRouter>
      </CartProvider>
      
    );

    const linkElement = getByRole("link", { name: /shopping cart/i });
    expect(linkElement).toHaveAttribute("href", "/cart");
  });
});