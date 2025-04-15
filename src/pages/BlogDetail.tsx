
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogPost } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Skeleton data-testid="skeleton" className="h-8 w-3/4 mb-2" />
        <Skeleton data-testid="skeleton" className="h-4 w-1/4 mb-6" />
        <Skeleton data-testid="skeleton" className="h-80 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton data-testid="skeleton" className="h-4 w-full" />
          <Skeleton data-testid="skeleton" className="h-4 w-full" />
          <Skeleton data-testid="skeleton" className="h-4 w-full" />
          <Skeleton data-testid="skeleton" className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
        <p className="mb-6 text-gray-600">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blog" className="text-coral hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link to="/blog" className="text-gray-500 hover:text-coral mb-6 flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <p className="text-gray-500 mb-8">
        Published {post.created_at ? formatDate(new Date(post.created_at)) : "recently"}
      </p>
      
      {post.image_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
        ))}
      </div>
    </div>
  );
};

export default BlogDetail;
