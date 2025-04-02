
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";

// Layouts
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AddProduct from "./pages/Admin/AddProduct";
import AddBlog from "./pages/Admin/AddBlog";
import ProductManagement from "./pages/Admin/ProductManagement";

// Components
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products/:slug" element={<Product />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={
                  <RequireAuth>
                    <Checkout />
                  </RequireAuth>
                } />
                <Route path="/order-success/:orderId" element={
                  <RequireAuth>
                    <OrderSuccess />
                  </RequireAuth>
                } />
                <Route path="/account" element={
                  <RequireAuth>
                    <Account />
                  </RequireAuth>
                } />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="blog/add" element={<AddBlog />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
