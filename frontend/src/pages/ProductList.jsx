import { useEffect, useState } from "react";
import { getProducts, addToCart } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  // 🔥 Load products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data.results || data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products ❌");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // 🔥 Add to cart (FIXED)
  async function handleAddToCart(productId) {
    setAddingId(productId);

    try {
      await addToCart(productId, 1);

      toast.success("Added to cart 🛒");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      if (err.message === "Session expired") {
        toast.error("Please login again");
        navigate("/login");
      } else {
        toast.error("Failed to add item");
      }
    } finally {
      setAddingId(null);
    }
  }

  // 🔥 Loader
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill()
          .map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded shadow">
              <div className="h-48 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 mt-3 w-3/4"></div>
              <div className="h-4 bg-gray-300 mt-2 w-1/2"></div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
          >
            {/* Image */}
            <img
              src={
                p.image
                  ? `${BASE_URL}${p.image}`
                  : "https://via.placeholder.com/300"
              }
              alt={p.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-500 text-sm">{p.category_name}</p>

              <p className="text-xs text-gray-400 mt-1">
                Stock: {p.stock}
              </p>

              <div className="flex justify-between items-center mt-3">
                <p className="text-xl font-bold text-blue-600">
                  ₹{p.price}
                </p>

                {/* 🔥 FIXED BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(p.id);
                  }}
                  disabled={p.stock === 0 || addingId === p.id}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    p.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {addingId === p.id
                    ? "Adding..."
                    : p.stock === 0
                    ? "Out of Stock"
                    : "Add"}
                </button>
              </div>

              {/* Out of stock */}
              {p.stock === 0 && (
                <p className="text-red-500 text-xs mt-2">
                  This item is currently unavailable
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;