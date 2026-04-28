import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>
    </div>
  );
}

function App() {
  const [search, setSearch] = useState("");

  // 🌙 Dark mode state
  // const [dark, setDark] = useState(() => {
  //   return localStorage.getItem("theme") === "dark";
  // });

  // // ✅ FORCE correct theme on first load
  // useEffect(() => {
  //   const saved = localStorage.getItem("theme");

  //   if (saved === "dark") {
  //     document.documentElement.classList.add("dark");
  //     setDark(true);
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     setDark(false);
  //   }
  // }, []);

  const [dark, setDark] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}, [dark]);

  // ✅ Handle toggle
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* ✅ FIXED ROOT */}
      {/* <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300"> */}
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-4">

        <Navbar
          search={search}
          setSearch={setSearch}
          dark={dark}
          setDark={setDark}
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>

            <Route path="/" element={<ProductList search={search} />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;