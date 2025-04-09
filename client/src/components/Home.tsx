import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Main home component
const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Check auth status when component loads
  useEffect(() => {
    // Quick local storage check
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUsername(userData.email || "User");
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // Return either logged in or logged out version
  return (
    <div className="container mx-auto px-4">
      {isLoggedIn ? (
        // User dashboard when logged in
        <div className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Hey {username}! Welcome back.
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">📋</span>
                </div>
                <h3 className="font-semibold text-lg text-center mb-2">
                  View Products
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Check out your product catalog.
                </p>
                <Link
                  to="/products"
                  className="block text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Products
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">+</span>
                </div>
                <h3 className="font-semibold text-lg text-center mb-2">
                  Add New Product
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Create and add new products.
                </p>
                <Link
                  to="/products/create"
                  className="block text-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Product
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">📊</span>
                </div>
                <h3 className="font-semibold text-lg text-center mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  View stats & reports.
                </p>
                <Link
                  to="/products"
                  className="block text-center py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Landing page for visitors
        <div className="flex flex-col md:flex-row py-12">
          <div className="md:w-1/2 md:pr-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              Product Management Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Track, manage, and optimize your product inventory with our
              Product Mangement App.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                <span className="text-gray-700">Easy inventory management</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                <span className="text-gray-700">
                  Simple and Secure
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                <span className="text-gray-700">
                  Easy to use
                </span>
              </div>
            </div>
            <div className="mt-8 space-x-4">
              <Link
                to="/login"
                className="inline-block py-3 px-6 bg-gray-950 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-block py-3 px-6 bg-white text-gray-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="bg-gray-200 rounded-lg p-6 h-[25vh] md:h-full flex items-center justify-center">
              <div className="text-6xl">📦</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
