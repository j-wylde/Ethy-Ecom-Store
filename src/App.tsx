
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import "./App.css";

// Layouts
import Layout from "@/layouts/Layout";
import AdminLayout from "@/layouts/AdminLayout";

// Public pages
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import OrderSuccess from "@/pages/OrderSuccess";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";

// Admin pages
import AdminDashboard from "@/pages/Admin/Dashboard";
import ProductManagement from "@/pages/Admin/ProductManagement";
import OrderManagement from "@/pages/Admin/OrderManagement";
import UserManagement from "@/pages/Admin/UserManagement";
import AddProduct from "@/pages/Admin/AddProduct";
import BlogManagement from "@/pages/Admin/BlogManagement";
import AddBlog from "@/pages/Admin/AddBlog";
import BlogEditor from "@/pages/Admin/BlogEditor";

// Auth wrapper
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="about" element={<About/>}/>
                <Route path="shop" element={<Shop />} />
                <Route path="products/:id" element={<Product />} />
                <Route path="cart" element={<Cart />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="account"
                  element={
                    <RequireAuth>
                      <Account />
                    </RequireAuth>
                  }
                />
                <Route
                  path="checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route
                  path="order-success/:id"
                  element={
                    <RequireAuth>
                      <OrderSuccess />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/add" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="blog/add" element={<AddBlog />} />
                <Route path="blog/edit/:id" element={<BlogEditor />} />
              </Route>
            </Routes>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
