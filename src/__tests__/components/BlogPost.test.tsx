import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BlogPost, { BlogPostType } from '../../components/BlogPost';

describe("BlogPost Component", () => {
  it("test_blog_post_renders_with_all_data", () => {
    const post: BlogPostType = {
      id: "1",
      title: "Test Blog Post",
      content: "This is a test blog post content that is quite lengthy to test the excerpt functionality.",
      published: true,
      image_url: "https://example.com/image.jpg",
      created_at: new Date().toISOString(),
      author_id: "author-1"
    };

    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <BlogPost post={post} />
      </MemoryRouter>
    );

    expect(getByText("Test Blog Post")).toBeInTheDocument();
    expect(getByText(/This is a test blog post content/)).toBeInTheDocument();
    expect(getByAltText("Test Blog Post")).toBeInTheDocument();
    expect(getByText(/Read More/)).toBeInTheDocument();
  });
});