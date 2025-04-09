import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";

const CreateProduct: React.FC = () => {
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  
  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handle form submission
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start loading
    setLoading(true);
    setError("");
    setSuccess("");
    
    // Super basic validation
    if (!name.trim() || !description.trim() || !category.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      setError("Price must be a valid number");
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5) {
      setError("Rating must be between 0 and 5");
      setLoading(false);
      return;
    }
    
    try {
      // Send the create request using apiClient (authorization header is automatically added)
      await apiClient.post(
        "/api/products",
        {
          name,
          description,
          category,
          price: parseFloat(price),
          rating: parseFloat(rating),
        }
      );
      
      // Show success and redirect
      setSuccess("Product added!");
      setTimeout(() => navigate("/products"), 2000);
    } catch (err) {
      console.warn("Failed to create product:", err);
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:truncate">Create New Product</h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="shadow-sm outline-none p-2 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="What's your product called?"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                    className="shadow-sm outline-none p-2 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. Electronics, Clothing, etc."
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="shadow-sm outline-none p-2 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Tell us about your product"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price 
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="outline-none p-2 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    id="rating"
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    required
                    min="1"
                    max="5"
                    step="0.1"
                    className="shadow-sm outline-none p-2 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="1-5"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                   ✅
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Link
                to="/products"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-950 hover:bg-gray-800 focus:outline-none disabled:opacity-50"
              >
                {loading ? "Creating..." : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
