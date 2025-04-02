
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/services/productService";
import { supabase } from "@/integrations/supabase/client";

interface ProductTableProps {
  searchQuery?: string;
}

const ProductTable = ({ searchQuery = "" }: ProductTableProps) => {
  const { data: products, isLoading, error, refetch } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (product.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const pageSize = 10;
  const totalPages = Math.ceil((filteredProducts?.length || 0) / pageSize);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteProductId);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-3 py-3">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Failed to load products</p>
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!paginatedProducts || paginatedProducts.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          {searchQuery ? "No products match your search" : "No products found"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded overflow-hidden mr-3">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[250px]">
                        {product.description || "No description"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">{product.category || "Uncategorized"}</td>
                <td className="p-3 text-right">${product.price.toFixed(2)}</td>
                <td className="p-3 text-right">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-center space-x-2">
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <Link to={`/products/${product.id}`}>
                        <Eye size={18} />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="icon"
                      variant="ghost"
                      className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                    >
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Pencil size={18} />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      onClick={() => setDeleteProductId(product.id)}
                    >
                      <Trash2 size={18} />
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

      <AlertDialog
        open={deleteProductId !== null}
        onOpenChange={(isOpen) => !isOpen && setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this product. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductTable;
