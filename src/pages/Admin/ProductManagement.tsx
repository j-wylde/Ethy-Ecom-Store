
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/Admin/ProductTable";

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-semibold">Product Management</h1>
        <Button asChild className="bg-coral">
          <Link to="/admin/products/add">
            <Plus size={16} className="mr-2" /> Add New Product
          </Link>
        </Button>
      </div>
      
      <div className="relative max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ProductTable searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default ProductManagement;
