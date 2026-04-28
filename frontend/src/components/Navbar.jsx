import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getAuthHeaders } from "../auth";
import { useEffect, useState, useRef } from "react";
import { getCartCount } from "../api/api";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ search, setSearch, dark, setDark }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [count, setCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Listen login/logout
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // 🛒 Cart count
  useEffect(() => {
    async function loadCount() {
      if (!token) return setCount(0);

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

  // 👇 Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout(navigate);
    toast.success("Logged out successfully");
    window.dispatchEvent(new Event("storage"));
  }

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "hover:text-blue-600";

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className={isActive("/")}>
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <h1 className="text-xl font-bold dark:text-white">Cartify</h1>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-5 text-gray-700 dark:text-gray-200">

          {/* 🔍 Search */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
          />

          {/* 🌙 Dark mode toggle */}
         <button
  onClick={() => setDark(prev => !prev)}
  className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
>
  {dark ? "☀️" : "🌙"}
</button>

          {token ? (
            <>
              {/* 🛒 Cart */}
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

              {/* 📦 Orders */}
              <Link
                to="/orders"
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                Orders
              </Link>

              {/* 👤 Profile */}
              <div className="relative" ref={menuRef}>
                <FaUserCircle
                  size={28}
                  className="cursor-pointer"
                  onClick={() => setShowMenu(!showMenu)}
                />

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg p-2">
                    
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
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