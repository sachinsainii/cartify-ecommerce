export function getAuthHeaders() {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}


// 🔥 Cleaner logout
export function logout(navigate) {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");

  // use React navigation instead of reload
  if (navigate) {
    navigate("/login");
  } else {
    window.location.href = "/login"; // fallback
  }
}