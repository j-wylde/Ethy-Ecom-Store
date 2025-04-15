import { describe, it, vi, expect, beforeEach } from "vitest";
import { useFeaturedProducts } from "@/services/productService";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

vi.mock("@/integrations/supabase/client", () => {
  const selectMock = vi.fn().mockReturnThis();
  const eqMock = vi.fn().mockReturnThis();
  const limitMock = vi.fn();

  const fromMock = vi.fn(() => ({
    select: selectMock,
    eq: eqMock,
    limit: limitMock,
  }));

  return {
    supabase: {
      from: fromMock,
    },
  };
});

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("productService - useFeaturedProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches featured products with default limit", async () => {
    const limitMock = (supabase.from("products").limit as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }],
      error: null,
    });

    (useQuery as any).mockImplementation(({ queryFn }) => queryFn());

    const result = await useFeaturedProducts();

    expect(supabase.from).toHaveBeenCalledWith("products");
    expect(supabase.from("products").eq).toHaveBeenCalledWith("featured", true);
    expect(limitMock).toHaveBeenCalledWith(4);
    expect(result).toEqual([{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }]);
  });

  it("fetches featured products with custom limit", async () => {
    const limitMock = (supabase.from("products").limit as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }],
      error: null,
    });

    (useQuery as any).mockImplementation(({ queryFn }) => queryFn());

    const result = await useFeaturedProducts(10);

    expect(supabase.from).toHaveBeenCalledWith("products");
    expect(supabase.from("products").eq).toHaveBeenCalledWith("featured", true);
    expect(limitMock).toHaveBeenCalledWith(10);
    expect(result).toEqual([{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }]);
  });

  it("throws an error if fetching featured products fails", async () => {
    (supabase.from("products").limit as jest.Mock).mockResolvedValue({
      data: null,
      error: new Error("Failed to fetch featured products"),
    });

    (useQuery as any).mockImplementation(({ queryFn }) => queryFn());

    await expect(useFeaturedProducts()).rejects.toThrow("Failed to fetch featured products");
  });
});