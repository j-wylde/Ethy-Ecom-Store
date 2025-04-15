import { describe, it, vi, expect, beforeEach } from "vitest";
import { uploadProductImage } from "@/services/storageService";
import { supabase } from "@/integrations/supabase/client";

vi.mock("@/integrations/supabase/client", () => {
  const uploadMock = vi.fn();
  const getPublicUrlMock = vi.fn();

  const fromMock = vi.fn(() => ({
    upload: uploadMock,
    getPublicUrl: getPublicUrlMock,
  }));

  return {
    supabase: {
      storage: {
        from: fromMock,
      },
    },
  };
});

describe("storageService - uploadProductImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads a product image and returns the public URL", async () => {
    const mockFile = new File(["content"], "image.png", { type: "image/png" });
    const productId = "product_123";
    const mockPublicUrl = "https://example.com/product_123/123456789.png";

    (supabase.storage.from("products").upload as any).mockResolvedValue({ error: null });
    (supabase.storage.from("products").getPublicUrl as any).mockReturnValue({
      data: { publicUrl: mockPublicUrl },
    });

    const result = await uploadProductImage(mockFile, productId);

    expect(supabase.storage.from).toHaveBeenCalledWith("products");
    expect(supabase.storage.from("products").upload).toHaveBeenCalledWith(
      expect.stringMatching(/^product_123\/\d+\.png$/),
      mockFile
    );
    expect(supabase.storage.from("products").getPublicUrl).toHaveBeenCalledWith(
      expect.stringMatching(/^product_123\/\d+\.png$/)
    );
    expect(result).toBe(mockPublicUrl);
  });

  it("uploads a blog image to the correct bucket", async () => {
    const mockFile = new File(["content"], "image.jpg", { type: "image/jpeg" });
    const productId = "blog_456";

    (supabase.storage.from("blog_posts").upload as any).mockResolvedValue({ error: null });
    (supabase.storage.from("blog_posts").getPublicUrl as any).mockReturnValue({
      data: { publicUrl: "https://example.com/blog_456/123456789.jpg" },
    });

    await uploadProductImage(mockFile, productId);

    expect(supabase.storage.from).toHaveBeenCalledWith("blog_posts");
    expect(supabase.storage.from("blog_posts").upload).toHaveBeenCalledWith(
      expect.stringMatching(/^blog_456\/\d+\.jpg$/),
      mockFile
    );
  });

  it("throws an error if the upload fails", async () => {
    const mockFile = new File(["content"], "image.png", { type: "image/png" });
    const productId = "product_123";
    const mockError = new Error("Upload failed");

    (supabase.storage.from("products").upload as any).mockResolvedValue({ error: mockError });

    await expect(uploadProductImage(mockFile, productId)).rejects.toThrow("Upload failed");

    expect(supabase.storage.from).toHaveBeenCalledWith("products");
    expect(supabase.storage.from("products").upload).toHaveBeenCalledWith(
      expect.stringMatching(/^product_123\/\d+\.png$/),
      mockFile
    );
  });
});