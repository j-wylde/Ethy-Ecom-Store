import { render, screen } from "@testing-library/react";
import { vi, Mock } from "vitest";
import Blog from "@/pages/Blog";
import * as blogService from "@/services/blogService";

vi.mock("@/services/blogService", () => ({
  useBlogPosts: vi.fn(),
}));

vi.mock("@/components/BlogPost", () => ({
  __esModule: true,
  default: ({ post }: any) => <div data-testid="blog-post">{post.title}</div>,
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: any) => (
    <div className={className} data-testid="skeleton"></div>
  ),
}));

describe("Blog", () => {
  // Access the mocked useBlogPosts function directly through the imported module
  const mockUseBlogPosts = blogService.useBlogPosts as Mock;

  it("should render loading skeletons when isLoading is true", () => {
    mockUseBlogPosts.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<Blog />);

    // There are 6 divs each with 5 Skeleton components, total 30 skeletons
    expect(screen.getAllByTestId("skeleton").length).toBe(30);
  });

  it("should display an error message when there is an error", () => {
    mockUseBlogPosts.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load blog posts"),
    });

    render(<Blog />);

    expect(screen.getByText(/failed to load blog posts/i)).toBeInTheDocument();
    expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
  });

  it("should display a 'No blog posts found' message when there are no posts", () => {
    mockUseBlogPosts.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Blog />);

    expect(screen.getByText(/no blog posts found/i)).toBeInTheDocument();
  });

  it("should render blog posts when data is available", () => {
    const mockPosts = [
      { id: "1", title: "Post 1" },
      { id: "2", title: "Post 2" },
    ];

    mockUseBlogPosts.mockReturnValue({
      data: mockPosts,
      isLoading: false,
      error: null,
    });

    render(<Blog />);

    expect(screen.getAllByTestId("blog-post").length).toBe(2);
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });
});
