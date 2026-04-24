const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...options,
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    // 🔐 Auto logout if token expired
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    if (!res.ok) {
      throw new Error(data?.detail || "API Error");
    }

    return data;

  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}


// 🔹 Products
export const getProducts = () => request("/products/");


// 🔹 Cart
export const addToCart = (id, quantity = 1) =>
  request("/cart/add/", {
    method: "POST",
    body: JSON.stringify({ product_id: id, quantity }),
  });

export const getCart = () => request("/cart/view/");

export const removeFromCart = (id) =>
  request(`/cart/remove/${id}/`, {
    method: "DELETE",
  });

// ✅ FIXED
export const getCartCount = () =>
  request("/cart/count/");


// 🔹 Orders
export const placeOrder = () =>
  request("/orders/place/", { method: "POST" });

export const getOrders = () =>
  request("/orders/my-orders/");


// 🔹 Auth
export const loginUser = (email, password) =>
  request("/accounts/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const signupUser = (data) =>
  request("/accounts/signup/", {
    method: "POST",
    body: JSON.stringify(data),
  });