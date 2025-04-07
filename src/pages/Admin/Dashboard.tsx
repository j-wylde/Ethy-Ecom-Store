
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Pencil, ArrowUpRight, Eye, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/services/productService";
import { useAdminBlogPosts, useDeleteBlogPost } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: blogPosts = [], isLoading: isLoadingBlogPosts } = useAdminBlogPosts();
  const deleteBlogPost = useDeleteBlogPost();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  
  // Take the first 5 products and blog posts for the dashboard
  const displayProducts = products.slice(0, 5);
  const displayBlogPosts = blogPosts.slice(0, 5);

  const handleDeleteBlogPost = async (id: string) => {
    try {
      await deleteBlogPost.mutateAsync(id);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <Link to="/" className="text-sm text-gray-500 hover:text-coral">
          View Site
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your products</CardDescription>
            </div>
            <Package className="h-5 w-5 text-coral" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Total products</p>
            <Button asChild className="mt-4 w-full bg-coral">
              <Link to="/admin/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </div>
            <MessageSquare className="h-5 w-5 text-coral" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPosts.length}</div>
            <p className="text-xs text-muted-foreground">Published posts</p>
            <Button asChild className="mt-4 w-full bg-coral">
              <Link to="/admin/blog">View All Posts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Add new content</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start bg-coral">
              <Link to="/admin/products/add" className="flex items-center">
                <Plus size={16} className="mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/admin/blog/add" className="flex items-center">
                <Plus size={16} className="mr-2" />
                Create Blog Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="section-title">Recent Products</CardTitle>
                <CardDescription>Manage your store products, update inventory and prices.</CardDescription>
              </div>
              <Link to="/admin/products/add" className="coral-button flex items-center gap-2">
                <Plus size={16} />
                Add Product
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <div className="text-center py-8">Loading products...</div>
              ) : displayProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found</p>
                  <p className="text-gray-400 mt-2">Get started by adding your first product</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Stock</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayProducts.map(product => (
                        <tr key={product.id} className="border-t">
                          <td className="p-3 font-medium">{product.name}</td>
                          <td className="p-3">{product.category || "Uncategorized"}</td>
                          <td className="p-3 text-right">₦{product.price.toFixed(2)}</td>
                          <td className="p-3 text-right">{product.stock}</td>
                          <td className="p-3">
                            <div className="flex justify-center space-x-2">
                              <Link to={`/products/${product.id}`} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                <Eye size={18} />
                              </Link>
                              <Link to={`/admin/products/edit/${product.id}`} className="p-1 text-amber-600 hover:bg-amber-100 rounded">
                                <Pencil size={18} />
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size='icon' variant="ghost" className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded">
                                    <Trash2 size={18} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the product.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="section-title">Blog Posts</CardTitle>
                <CardDescription>Create and manage blog posts for your store.</CardDescription>
              </div>
              <Link to="/admin/blog/add" className="coral-button flex items-center gap-2">
                <Plus size={16} />
                Add Post
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingBlogPosts ? (
                <div className="text-center py-8">Loading blog posts...</div>
              ) : displayBlogPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blog posts found</p>
                  <p className="text-gray-400 mt-2">Get started by creating your first blog post</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayBlogPosts.map(post => (
                        <tr key={post.id} className="border-t">
                          <td className="p-3 font-medium">{post.title}</td>
                          <td className="p-3">{new Date(post.created_at || "").toLocaleDateString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              post.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center space-x-2">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
