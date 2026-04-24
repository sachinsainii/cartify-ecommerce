import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../api/api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL.replace("/api", "");

  // 🔥 useEffect with inline function (NO errors)

useEffect(() => {
  if (!id) return;

  async function loadProduct() {
    try {
      const res = await fetch(`${API_URL}/products/${id}/`);

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setProduct(data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load product ❌");

    } finally {
      setLoading(false);
    }
  }

  loadProduct();

}, [id,API_URL]);

  // 🛒 Add to cart
  async function handleAddToCart() {
    if (!product) return;

    setAdding(true);

    try {
      await addToCart(product.id, 1);
      toast.success("Added to cart 🛒");
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.error(err);

      if (err.message === "Session expired") {
        navigate("/login");
      } else {
        toast.error("Failed to add item");
      }

    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!product) return <p className="text-center text-red-500">Not found</p>;

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
      
      <img
        src={
          product.image
            ? `${BASE_URL}${product.image}`
            : "https://via.placeholder.com/400"
        }
        className="w-full h-96 object-cover rounded"
      />

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-gray-600 mt-2">
          {product.description || "No description"}
        </p>

        <p className="text-2xl font-bold text-blue-600 mt-4">
          ₹{product.price}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="block mt-4 text-blue-500 underline"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;