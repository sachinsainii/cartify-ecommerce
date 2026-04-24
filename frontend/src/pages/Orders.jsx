import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrders } from "../api/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError("");

      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
        toast.error("Failed to load orders ❌");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // 🎨 status color
  function getStatusStyle(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // 🔄 Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white p-4 rounded shadow"
            >
              <div className="h-4 bg-gray-300 w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 w-full"></div>
            </div>
          ))}
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {/* 🛒 Empty */}
      {orders.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          <p>You haven’t placed any orders yet 🛒</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              {/* 🔝 Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  Order #{order.id}
                </h3>

                <span
                  className={`px-3 py-1 rounded text-sm ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* 📅 Date */}
              <p className="text-gray-500 text-sm mt-1">
                {new Date(order.created_at).toLocaleString()}
              </p>

              {/* 📦 Items */}
              <div className="mt-4 border-t pt-3 space-y-2">
                {(order.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* 💰 Total */}
              <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.total_price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;