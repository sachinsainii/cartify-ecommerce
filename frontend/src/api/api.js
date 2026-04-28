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

    // 🔐 Handle unauthorized
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");

      // 🔥 better than reload
      window.dispatchEvent(new Event("unauthorized"));

      throw new Error("Session expired");
    }

    if (!res.ok) {
      // throw new Error(data?.detail || "API Error");
      throw new Error(JSON.stringify(data));
    }

    return data;

  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
}



//  PRODUCTS (UPDATED)

export const getProducts = async (search = "", category = "") => {
  let url = "/products/?";

  if (search) url += `search=${search}&`;
  if (category) url += `category=${category}&`;

   const data = await request(url);

  return data.results || data 
};


//  CATEGORIES (FIXED)

export const getCategories = () =>
  request("/products/categories/");



//  CART

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

export const getCartCount = () =>
  request("/cart/count/");


//  ORDERS

export const placeOrder = () =>
  request("/orders/place/", { method: "POST" });

export const getOrders = () =>
  request("/orders/my-orders/");



//  AUTH

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

  // 🔹 PROFILE

export const getProfile = () =>
  request("/accounts/profile/");

export const updateProfile = (formData) =>
  request("/accounts/profile/", {
    method: "PUT",
    headers: {
      // ❗ DO NOT set Content-Type for FormData
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  });