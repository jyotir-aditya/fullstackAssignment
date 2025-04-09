import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  user_id: string; 
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 8; // Keep same as the server's limit

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Prepare query parameters
        const params: Record<string, string> = {
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        };
        if (search) params.search = search;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;

        // Fetch products using apiClient - no need to manually set auth header
        const response = await apiClient.get("/products", { params });
        
        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setTotalPages(Math.ceil(response.data.total / itemsPerPage));
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Received an invalid response format from the server");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, minPrice, maxPrice, minRating, currentPage]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // For delete operations, we use apiClient which now handles auth automatically
        await apiClient.delete(`/products/${id}`);
        
        // Remove the product from the state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  // check if the current user is the owner of a product or not
  const isOwner = (productUserId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id === productUserId;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Products</h2>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
           className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Filter Products
          </button>
          <Link
            to="/products/create"
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-950 hover:bg-gray-800 focus:outline-none"
          >
            <span className="mr-2 font-bold">+</span>
            Add New Product
          </Link>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isFilterOpen && (
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-5">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by name or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shadow-sm p-2 outline-none block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="e.g., Electronics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="shadow-sm p-2 outline-none block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="minPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Min Price
              </label>
              <input
                id="minPrice"
                type="number"
                placeholder="e.g., 10"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="shadow-sm p-2 outline-none block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="maxPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max Price
              </label>
              <input
                id="maxPrice"
                type="number"
                placeholder="e.g., 100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="shadow-sm p-2 outline-none block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="minRating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Min Rating
              </label>
              <input
                id="minRating"
                type="number"
                placeholder="1-5"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                min="1"
                max="5"
                className="shadow-sm p-2 outline-none block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="p-8 text-center w-[90vw] my-auto mb-20 mt-20">
            <div className="text-lg text-green-600 mb-2">•••</div>
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Category: {product.category}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Price: ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Rating: {product.rating}
              </p>
              <div className="flex space-x-2">
                {isOwner(product.user_id) && (
                  <>
                    <Link
                      to={`/products/update/${product.id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-6xl text-gray-300 mb-4">📦</div>
            <p className="mt-2 text-gray-500">
              No products found. Try adjusting your filters or add a new
              product.
            </p>
            <Link
              to="/products/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="mr-2 font-bold">+</span>
              Add New Product
            </Link>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
