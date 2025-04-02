
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, Search, User } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="bg-coral py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          <Logo />
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`nav-link ${isActive("/")}`}>HOME</Link>
          <Link to="/shop" className={`nav-link ${isActive("/shop")}`}>SHOP</Link>
          <Link to="/categories" className={`nav-link ${isActive("/categories")}`}>CATEGORIES</Link>
          <Link to="/gift-items" className={`nav-link ${isActive("/gift-items")}`}>GIFT ITEMS</Link>
          <Link to="/blog" className={`nav-link ${isActive("/blog")}`}>BLOG</Link>
          <Link to="/about" className={`nav-link ${isActive("/about")}`}>ABOUT US</Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact")}`}>CONTACT</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/account" className="text-white hover:text-gray-200">
            <User size={20} />
          </Link>
          <Link to="/cart" className="text-white hover:text-gray-200">
            <ShoppingCart size={20} />
          </Link>
          <Link to="/wishlist" className="text-white hover:text-gray-200">
            <Heart size={20} />
          </Link>
          <Link to="/search" className="text-white hover:text-gray-200">
            <Search size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
