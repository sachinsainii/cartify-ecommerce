import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";

import { useEffect } from "react";


// 🔥 Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


// 🔥 404 Page
function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="min-h-screen bg-gray-100">

        {/* 🔝 Navbar */}
        <Navbar />

        {/* 📦 Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Routes>

            {/* 🏠 Public Routes */}
            <Route path="/" element={<ProductList />} />
            {/* <Route path="/products/:id" element={<ProductDetail />} /> */}
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔒 Protected Routes */}
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

            {/* ❌ 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;