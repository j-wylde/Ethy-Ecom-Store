import { render, screen } from "@testing-library/react";
import { vi, Mock } from "vitest";
import BlogDetail from "@/pages/BlogDetail";
import * as blogService from "@/services/blogService";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("@/services/blogService", () => ({
  useBlogPost: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <svg data-testid="arrow-left-icon" />,
}));

describe("BlogDetail", () => {
  const mockUseBlogPost = blogService.useBlogPost as Mock;

  const renderWithRouter = (path: string) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("should render loading skeletons when isLoading is true", () => {
    mockUseBlogPost.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithRouter("/blog/1");

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("should display an error message when there is an error", () => {
    mockUseBlogPost.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load blog post"),
    });

    renderWithRouter("/blog/1");

    expect(screen.getByText(/blog post not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the blog post you're looking for doesn't exist/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/back to blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });

  it("should display an error message when no post is found", () => {
    mockUseBlogPost.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithRouter("/blog/1");

    expect(screen.getByText(/blog post not found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the blog post you're looking for doesn't exist/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/back to blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
  });

  it("should render blog post details when data is available", () => {
    const mockPost = {
      id: "1",
      title: "Sample Blog Post",
      created_at: "2023-01-01T00:00:00Z",
      image_url: "https://example.com/image.jpg",
      content: "This is a sample blog post.\nIt has multiple paragraphs.",
    };

    mockUseBlogPost.mockReturnValue({
      data: mockPost,
      isLoading: false,
      error: null,
    });

    renderWithRouter("/blog/1");

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(/published/i)).toBeInTheDocument();
    expect(screen.getByAltText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText("This is a sample blog post.")).toBeInTheDocument();
    expect(screen.getByText("It has multiple paragraphs.")).toBeInTheDocument();
  });
});