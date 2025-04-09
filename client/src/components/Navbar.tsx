import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if we have a token
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    // Check auth when component loads
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Re-check when URL changes
    checkAuthStatus();
  }, [location.pathname]);

  useEffect(() => {
    // Handle storage changes (when another tab logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Our custom auth change event
    const handleAuthEvent = () => {
      checkAuthStatus();
    };

    window.addEventListener("authChange", handleAuthEvent);
    return () => {
      window.removeEventListener("authChange", handleAuthEvent);
    };
  }, []);

  // Logout handler
  function handleLogout() {
    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);

    // Tell the app we logged out
    window.dispatchEvent(new Event("authChange"));

    // Refresh the page to clear state
    window.location.reload();
  }

  return (
    <nav className="bg-gradient-to-r shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-black text-xl font-bold">Product Manager</h1>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-black hover:bg-gray-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/products"
                    className="text-black hover:bg-gray-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Products
                  </Link>
                  <Link
                    to="/products/create"
                    className="text-black hover:bg-gray-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Add Product
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-black hover:bg-gray-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-black hover:bg-gray-500 hover:bg-opacity-75 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-gray-700 hover:bg-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-blue-500 focus:outline-none"
            >
              <span className="font-bold text-lg">
                {isMenuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 pb-3 pt-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-black hover:bg-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Products
                </Link>
                <Link
                  to="/products/create"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-black hover:bg-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Add Product
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-black hover:bg-gray-500 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-black hover:bg-gray-500 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-black hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
