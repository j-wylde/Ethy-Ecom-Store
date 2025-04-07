
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import { useAdminBlogPosts, useDeleteBlogPost } from "@/services/blogService";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const BlogManagement = () => {
  const { data: posts = [], isLoading } = useAdminBlogPosts();
  const deleteBlogPost = useDeleteBlogPost();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDeleteBlogPost = async (id: string) => {
    try {
      await deleteBlogPost.mutateAsync(id);
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Blog Management</h1>
        <Link to="/admin/dashboard" className="text-sm text-gray-500 hover:text-coral">
          Back to Dashboard
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Manage all your blog posts</CardDescription>
          </div>
          <Link to="/admin/blog/add" className="coral-button flex items-center gap-2">
            <Plus size={16} />
            Add New Post
          </Link>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading blog posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No blog posts found</p>
              {searchTerm ? (
                <p className="text-gray-400 mt-2">Try adjusting your search term</p>
              ) : (
                <p className="text-gray-400 mt-2">Get started by creating your first blog post</p>
              )}
            </div>
          ) : (
            <Table>
              <TableCaption>A list of all blog posts</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{new Date(post.created_at || "").toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/blog/${post.id}`} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                          <Eye size={18} />
                        </Link>
                        <Link to={`/admin/blog/edit/${post.id}`} className="p-1 text-amber-600 hover:bg-amber-100 rounded">
                          <Pencil size={18} />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost" className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded">
                              <Trash2 size={18} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the blog post.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteBlogPost(post.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
