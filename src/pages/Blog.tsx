
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, User } from "lucide-react";

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "5 Essential Skincare Tips for Dry Skin",
    excerpt:
      "Discover how to keep your dry skin hydrated and glowing with these 5 essential tips that dermatologists swear by.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/lovable-uploads/e7edabff-4014-4344-aea1-93cc89816d01.png",
    author: "Sarah Johnson",
    date: "June 15, 2023",
    category: "Skincare Tips",
    slug: "essential-skincare-tips-dry-skin",
  },
  {
    id: 2,
    title: "How to Choose the Right Lip Care Products",
    excerpt:
      "With so many lip care products available, it can be challenging to find the right one for your needs. Here's our guide to help you choose.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/lovable-uploads/b5b998d4-ffa6-43ba-8a55-a3f6cc69e5c6.png",
    author: "Michael Brown",
    date: "June 2, 2023",
    category: "Product Reviews",
    slug: "choose-right-lip-care-products",
  },
  {
    id: 3,
    title: "Benefits of Using Jade Rollers in Your Routine",
    excerpt:
      "Jade rollers have been used in skincare for centuries. Learn about the benefits and how to incorporate them into your daily routine.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/lovable-uploads/6a6469b2-e641-48f7-8d02-eb5409ddf11c.png",
    author: "Emma Wilson",
    date: "May 20, 2023",
    category: "Beauty Trends",
    slug: "benefits-jade-rollers-skincare-routine",
  },
  {
    id: 4,
    title: "The Ultimate Guide to Double Cleansing",
    excerpt:
      "Double cleansing is a game-changer in any skincare routine. Learn the proper technique and the best products to use.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "/lovable-uploads/e7edabff-4014-4344-aea1-93cc89816d01.png",
    author: "David Chen",
    date: "May 10, 2023",
    category: "Tutorials",
    slug: "ultimate-guide-double-cleansing",
  },
];

const categories = [
  "All",
  "Skincare Tips",
  "Product Reviews",
  "Beauty Trends",
  "Tutorials",
  "Wellness",
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter posts based on search term and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover skincare tips, product reviews, and the latest beauty trends to help you achieve your best skin.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-coral focus:border-coral"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <h3 className="font-medium text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <button
                    className={`text-left w-full py-1 px-2 rounded ${
                      selectedCategory === category
                        ? "bg-coral/10 text-coral font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="font-medium text-lg mb-4">Recent Posts</h3>
            <div className="space-y-4">
              {blogPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="flex items-start space-x-2 group"
                >
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm group-hover:text-coral transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium bg-coral/10 text-coral px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <h2 className="mt-2 text-xl font-semibold line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">
                No blog posts found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
