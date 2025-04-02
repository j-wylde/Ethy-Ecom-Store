
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import CartIcon from "./CartIcon";

const Navbar = () => {
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <Logo />
          {!isMobile && (
            <ul className="flex ml-10">
              <li className="mr-6">
                <Link
                  to="/"
                  className={`hover:text-coral ${
                    location.pathname === "/" ? "text-coral" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="mr-6">
                <Link
                  to="/shop"
                  className={`hover:text-coral ${
                    location.pathname === "/shop" ? "text-coral" : ""
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`hover:text-coral ${
                    location.pathname === "/blog" ? "text-coral" : ""
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
              className="mr-4"
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
                <Button asChild variant="ghost">
                  <Link to="/account">Account</Link>
                </Button>
                <Button onClick={() => signOut()} variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="bg-white border-t mt-2">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className={`block py-2 hover:text-coral ${
                    location.pathname === "/" ? "text-coral" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={`block py-2 hover:text-coral ${
                    location.pathname === "/shop" ? "text-coral" : ""
                  }`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className={`block py-2 hover:text-coral ${
                    location.pathname === "/blog" ? "text-coral" : ""
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
                      className={`block py-2 hover:text-coral ${
                        location.pathname === "/account" ? "text-coral" : ""
                      }`}
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => signOut()}
                      className="block py-2 hover:text-coral w-full text-left"
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
                      className={`block py-2 hover:text-coral ${
                        location.pathname === "/login" ? "text-coral" : ""
                      }`}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className={`block py-2 hover:text-coral ${
                        location.pathname === "/register" ? "text-coral" : ""
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
