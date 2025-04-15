import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    }
  });
  
  const filteredProfiles = profiles?.filter(profile => 
    (profile.first_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (profile.last_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    profile.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pageSize = 10;
  const totalPages = Math.ceil((filteredProfiles?.length || 0) / pageSize);
  const paginatedProfiles = filteredProfiles?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const getInitials = (profile: Profile) => {
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    
    if (firstName && lastName) {
      return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    } else {
      return "U";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py极客时间10 px-4">
        <h1 className="text-3xl font-semibold mb-6">User Management</h1>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex space-x-3 py-3 border-b">
              <Skeleton className="h-10 w-10 rounded-full" data-testid="skeleton" />
              <div className="space极客时间-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" data-testid="skeleton" />
                <Skeleton className="h-4 w-1/4" data-testid="skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4" data-testid="error-container">
        <h1 className="text-3xl font-semibold mb-6">User Management</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center" data-testid="error-content">
          <p className="text-red-500" data-testid="error-message" role="alert">Failed to load users</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2"
            data-testid="retry-button"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">User Management</h1>
      
      <div className="relative max-w-md mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
          data-testid="search-input"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        {!profiles || profiles.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No users available yet</p>
            <p className="text-gray-400 mt-2">Users will appear here after they register</p>
          </div>
        ) : !filteredProfiles || filteredProfiles.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No users match your search</p>
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
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProfiles?.map((profile) => (
                    <tr key={profile.id} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center">
                          <Avatar className="mr-2">
                            <AvatarImage src={profile.avatar_url || undefined} />
                            <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {profile.first_name && profile.last_name 
                                ? `${profile.first_name} ${profile.last_name}` 
                                : profile.first_name || profile.last_name || "Anonymous User"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{profile.id.slice(0, 8)}...</td>
                      <td className="p-3 text-right">
                        {profile.created_at ? formatDate(new Date(profile.created_at)) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t" data-testid="pagination-controls">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    data-testid="pagination-prev"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    data-testid="pagination-next"
                    aria-label="Next page"
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

export default UserManagement;
