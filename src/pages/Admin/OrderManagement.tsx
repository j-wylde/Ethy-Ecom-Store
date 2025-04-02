
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatCurrency } from "@/lib/utils";

type Order = {
  id: string;
  created_at: string;
  total: number;
  status: string;
  user_id: string;
};

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });
  
  const filteredOrders = orders?.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pageSize = 10;
  const totalPages = Math.ceil((filteredOrders?.length || 0) / pageSize);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold mb-6">Order Management</h1>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex space-x-3 py-3 border-b">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold mb-6">Order Management</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-red-500">Failed to load orders</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">Order Management</h1>
      
      <div className="relative max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search orders by ID or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        {!orders || orders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No orders available yet</p>
            <p className="text-gray-400 mt-2">Orders will appear here once customers make purchases</p>
          </div>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No orders match your search</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Order ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders?.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="p-3 font-medium">{order.id.slice(0, 8)}...</td>
                      <td className="p-3">{order.created_at ? formatDate(new Date(order.created_at)) : 'N/A'}</td>
                      <td className="p-3 text-right">{formatCurrency(order.total)}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <Button
                            asChild
                            size="icon"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            <Link to={`/admin/orders/${order.id}`}>
                              <Eye size={18} />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
