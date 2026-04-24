import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCart,
  removeFromCart,
  addToCart,
  placeOrder
} from "../api/api";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL.replace("/api", "");

  // 🔥 Load cart
  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setItems(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart ❌");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   loadCart();
  // }, []);

  useEffect(() => {
  (async () => {
    try {
      await loadCart();
    } catch (e) {
      console.error(e);
    }
  })();
}, []);

  // 🔥 Remove item
  async function removeItem(productId) {
    try {
      await removeFromCart(productId);
      toast.success("Item removed");
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  }

  // 🔥 Update quantity
  async function updateQuantity(productId, newQuantity, stock) {
    if (newQuantity <= 0) return;

    if (newQuantity > stock) {
      toast.error("Not enough stock");
      return;
    }

    try {
      await addToCart(productId, newQuantity);
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity");
    }
  }

  // 🔥 Place Order (FIXED)
  async function placeOrderHandler() {
    if (placing) return;

    setPlacing(true);

    try {
      await placeOrder();

      toast.success("Order placed successfully 🎉");

      loadCart(); // refresh cart
      window.dispatchEvent(new Event("cartUpdated"));

      // 👉 optional redirect
      navigate("/orders");

    } catch (err) {
      console.error(err);

      if (err.message === "Session expired") {
        toast.error("Session expired, login again");
        navigate("/login");
      } else {
        toast.error("Order failed ❌");
      }

    } finally {
      setPlacing(false);
    }
  }

  // 🔥 Total
  const totalPrice = items?.reduce(
    (total, item) =>
      total + item.quantity * parseFloat(item.product.price),
    0
  );

  // 🔥 Check stock
  const hasOutOfStock = items.some(
    (item) => item.product.stock === 0
  );

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="space-y-4">
        {Array(4).fill().map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white p-4 rounded shadow flex gap-4"
          >
            <div className="w-24 h-24 bg-gray-300 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          Your cart is empty 🛒
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {/* 🛒 ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex gap-4 items-center"
              >
                <img
                  src={`${BASE_URL}${item.product.image}`}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {item.product.name}
                  </h3>

                  <p className="text-gray-500">
                    ₹{item.product.price}
                  </p>

                  {/* Stock */}
                  {item.product.stock === 0 && (
                    <p className="text-red-500 text-sm">
                      Out of stock
                    </p>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      disabled={item.quantity === 1}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.product.stock
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="px-2 py-1 bg-gray-200 rounded"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.product.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* 💰 SUMMARY */}
          <div className="bg-white shadow-md rounded-lg p-4 h-fit">
            <h3 className="text-lg font-semibold mb-3">
              Order Summary
            </h3>

            <p className="flex justify-between mb-2">
              <span>Total</span>
              <span className="font-bold">₹{totalPrice}</span>
            </p>

            <button
              onClick={placeOrderHandler}   // ✅ FIXED
              disabled={placing || hasOutOfStock}
              className={`w-full py-3 rounded text-white mt-3 ${
                placing || hasOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {placing
                ? "Placing Order..."
                : hasOutOfStock
                ? "Fix cart items"
                : "Place Order"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;