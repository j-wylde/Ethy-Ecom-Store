
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Pencil, Trash, ArrowUpRight, Eye, MessageSquare, Filter, Plus } from "lucide-react";

// Mock data for admin dashboard
const products = [
  { id: 1, name: "HYDRATING LIP SCRUB", price: 8250.00, stock: 25, category: "Lip Care" },
  { id: 2, name: "HYDRATING LIP MASK", price: 8250.00, stock: 18, category: "Lip Care" },
  { id: 3, name: "SONIC JADE ROLLER", price: 18800.00, stock: 10, category: "Skincare Devices" },
  { id: 4, name: "LIP BUTTER", price: 8800.00, stock: 30, category: "Lip Care" },
  { id: 5, name: "ES HAIR SCRUNCHIES", price: 7150.00, stock: 15, category: "Hair Care" },
];

const blogPosts = [
  { id: 1, title: "5 Essential Skincare Tips for Dry Skin", date: "2023-06-15", status: "Published", comments: 12 },
  { id: 2, title: "How to Choose the Right Lip Care Products", date: "2023-06-02", status: "Published", comments: 8 },
  { id: 3, title: "Benefits of Using Jade Rollers in Your Routine", date: "2023-05-20", status: "Draft", comments: 0 },
];

const comments = [
  { id: 1, author: "Jane Smith", date: "2023-06-18", content: "I love the lip scrub! It's so hydrating.", postTitle: "5 Essential Skincare Tips for Dry Skin", approved: true },
  { id: 2, author: "Michael Brown", date: "2023-06-16", content: "Can you recommend a good moisturizer to use with the jade roller?", postTitle: "Benefits of Using Jade Rollers in Your Routine", approved: true },
  { id: 3, author: "Sarah Johnson", date: "2023-06-15", content: "This was very helpful, thank you!", postTitle: "How to Choose the Right Lip Care Products", approved: false },
];

const AdminDashboard = () => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  const toggleProductSelection = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const togglePostSelection = (id: number) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(postId => postId !== id));
    } else {
      setSelectedPosts([...selectedPosts, id]);
    }
  };

  const toggleCommentSelection = (id: number) => {
    if (selectedComments.includes(id)) {
      setSelectedComments(selectedComments.filter(commentId => commentId !== id));
    } else {
      setSelectedComments([...selectedComments, id]);
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

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your store products, update inventory and prices.</CardDescription>
              </div>
              <Link to="/admin/products/add" className="coral-button flex items-center gap-2">
                <Plus size={16} />
                Add Product
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Category</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Stock</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-t">
                        <td className="p-3">{product.id}</td>
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3">{product.category}</td>
                        <td className="p-3 text-right">₦{product.price.toLocaleString()}</td>
                        <td className="p-3 text-right">{product.stock}</td>
                        <td className="p-3">
                          <div className="flex justify-center space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                              <Eye size={18} />
                            </button>
                            <button className="p-1 text-amber-600 hover:bg-amber-100 rounded">
                              <Pencil size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Blog Management</CardTitle>
                <CardDescription>Create and manage blog posts for your store.</CardDescription>
              </div>
              <Link to="/admin/blog/add" className="coral-button flex items-center gap-2">
                <Plus size={16} />
                Add Post
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">ID</th>
                      <th className="p-3 text-left">Title</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-right">Comments</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map(post => (
                      <tr key={post.id} className="border-t">
                        <td className="p-3">{post.id}</td>
                        <td className="p-3 font-medium">{post.title}</td>
                        <td className="p-3">{post.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            post.status === "Published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">{post.comments}</td>
                        <td className="p-3">
                          <div className="flex justify-center space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                              <Eye size={18} />
                            </button>
                            <button className="p-1 text-amber-600 hover:bg-amber-100 rounded">
                              <Pencil size={18} />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comment Moderation</CardTitle>
              <CardDescription>Approve, edit, or delete comments on your blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Author</th>
                      <th className="p-3 text-left">Comment</th>
                      <th className="p-3 text-left">Post</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(comment => (
                      <tr key={comment.id} className="border-t">
                        <td className="p-3 font-medium">{comment.author}</td>
                        <td className="p-3">{comment.content}</td>
                        <td className="p-3">{comment.postTitle}</td>
                        <td className="p-3">{comment.date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            comment.approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {comment.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center space-x-2">
                            {!comment.approved && (
                              <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                <ArrowUpRight size={18} />
                              </button>
                            )}
                            <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
