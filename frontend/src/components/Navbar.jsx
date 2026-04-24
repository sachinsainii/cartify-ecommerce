import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getAuthHeaders } from "../auth";
import { useEffect, useState } from "react";
import { getCartCount } from "../api/api";
import toast from "react-hot-toast";

function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [count, setCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Listen to login/logout changes
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // ✅ Load cart count
  useEffect(() => {
    async function loadCount() {
      if (!token) {
        setCount(0);
        return;
      }

      try {
        const c = await getCartCount(getAuthHeaders());
        setCount(c);
      } catch (err) {
        console.error(err);
      }
    }

    loadCount();
     window.addEventListener("cartUpdated", loadCount);

  return () => {
    window.removeEventListener("cartUpdated", loadCount);
  };
  }, [token]);

  function handleLogout() {
    logout(navigate);
    toast.success("Logged out successfully");

    // 🔥 trigger update
    window.dispatchEvent(new Event("storage"));
  }

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          Ecom
        </h1>

        <div className="flex items-center gap-6 text-gray-700 font-medium">
          
          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          {token ? (
            <>
              {/* 🔥 Cart with badge */}
              <Link
                to="/cart"
                className="relative bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Cart

                {count > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Orders
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;