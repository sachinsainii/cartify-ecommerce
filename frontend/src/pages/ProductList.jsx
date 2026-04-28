import { useEffect, useState } from "react";
// import { addToCart } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProducts, getCategories, addToCart } from "../api/api";

function ProductList({search}) {
  // const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL.replace("/api", "");

  // 🔥 Load categories
  useEffect(() => {
  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  loadCategories();
}, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500); // wait 500ms

  return () => clearTimeout(timer);
}, [search]);

  // 🔥 Load products with filters
  useEffect(() => {
  async function loadProducts() {
    // setLoading(true);

    try {
      const data = await getProducts(debouncedSearch, category);
      // setProducts(data);
      setProducts(data.results || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadProducts();
}, [debouncedSearch, category]);

  // 🔥 Add to cart
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
      <div className="grid grid-cols-4 gap-6">
        {Array(8).fill().map((_, i) => (
          <div key={i} className="animate-pulse bg-white p-4 rounded shadow">
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Products</h2>

        <div className="flex gap-4 mb-6">

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
          >
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
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-gray-500 text-sm">{p.category_name}</p>

              <p className="text-blue-600 font-bold">₹{p.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(p.id);
                }}
                disabled={p.stock === 0 || addingId === p.id}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
              >
                {addingId === p.id ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;