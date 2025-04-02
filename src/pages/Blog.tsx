
import React from "react";
import { useBlogPosts } from "@/services/blogService";
import BlogPost from "@/components/BlogPost";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const { data: posts, isLoading, error } = useBlogPosts();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-10 text-center">Our Blog</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/5" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load blog posts</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
