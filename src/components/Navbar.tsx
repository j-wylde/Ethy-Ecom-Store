
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import CartIcon from "./CartIcon";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-coral shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Logo />
          {!isMobile && (
            <ul className="flex ml-10">
              <li className="mr-6">
                <Link
                  to="/"
                  className={`text-white hover:text-gray-200 ${
                    location.pathname === "/" ? "font-bold" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  to="/shop"
                  className={`text-white hover:text-gray-200 ${
                    location.pathname === "/shop" ? "font-bold" : ""
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`text-white hover:text-gray-200 ${
                    location.pathname === "/blog" ? "font-bold" : ""
                  }`}
                >
                  Blog
                </Link>
              </li>
            </ul>
          )}
        </div>
        {isMobile ? (
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu />
            </Button>
            <div className="flex items-center gap-4">
              <CartIcon />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <CartIcon />
            {user ? (
              <>
                <Button asChild variant="ghost" className="text-white">
                  <Link to="/account">Account</Link>
                </Button>
                <Button onClick={() => signOut()} variant="ghost" className="text-white">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-white">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-white text-coral hover:bg-gray-100 hover:text-black">
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="bg-coral border-t mt-2">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className={`block py-2 text-white hover:text-gray-200 ${
                    location.pathname === "/" ? "font-bold" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`block py-2 text-white hover:text-gray-200 ${
                    location.pathname === "/shop" ? "font-bold" : ""
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`block py-2 text-white hover:text-gray-200 ${
                    location.pathname === "/blog" ? "font-bold" : ""
                  }`}
                >
                  Blog
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/account"
                      className={`block py-2 text-white hover:text-gray-200 ${
                        location.pathname === "/account" ? "font-bold" : ""
                      }`}
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="block py-2 text-white hover:text-gray-200 w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`block py-2 text-white hover:text-gray-200 ${
                        location.pathname === "/login" ? "font-bold" : ""
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className={`block py-2 text-white hover:text-gray-200 ${
                        location.pathname === "/register" ? "font-bold" : ""
                      }`}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
