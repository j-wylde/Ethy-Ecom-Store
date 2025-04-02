
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Logo from "../components/Logo";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // This will be replaced with actual logout logic
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-lg font-medium">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/admin/dashboard"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/dashboard")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Home size={18} className="mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/products/add"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/products/add")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Package size={18} className="mr-3" />
              Add Product
            </Link>
            <Link
              to="/admin/blog/add"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/blog/add")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <FileText size={18} className="mr-3" />
              Add Blog Post
            </Link>
            <Link
              to="/admin/orders"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/orders")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <ShoppingCart size={18} className="mr-3" />
              Orders
            </Link>
            <Link
              to="/admin/customers"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/customers")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Users size={18} className="mr-3" />
              Customers
            </Link>
            <Link
              to="/admin/comments"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/comments")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <MessageSquare size={18} className="mr-3" />
              Comments
            </Link>
            <Link
              to="/admin/settings"
              className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive("/admin/settings")
                  ? "bg-coral text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Settings size={18} className="mr-3" />
              Settings
            </Link>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <div className="min-h-screen bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
