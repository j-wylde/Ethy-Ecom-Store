
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface BlogPostType {
  id: string;
  title: string;
  content: string;
  published: boolean;
  image_url?: string | null;
  created_at?: string | null;
  author_id?: string | null;
}

interface BlogPostProps {
  post: BlogPostType;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const { id, title, content, image_url, created_at } = post;

  // Extract a brief excerpt from the content
  const excerpt = content.length > 150 
    ? content.substring(0, 150) + "..." 
    : content;

  // Format the date
  const formattedDate = created_at 
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true }) 
    : "Recently";

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="aspect-video overflow-hidden">
        <img 
          src={image_url || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="flex-1 p-5">
        <h3 className="font-bold text-xl mb-2">
          <Link to={`/blog/${id}`} className="hover:text-coral transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {formattedDate}
        </p>
        <p className="text-gray-700">{excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 px-5 pb-5">
        <Link 
          to={`/blog/${id}`}
          className="text-coral hover:underline font-medium"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogPost;
