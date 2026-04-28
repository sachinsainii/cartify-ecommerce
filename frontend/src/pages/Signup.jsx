import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signupUser } from "../api/api";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  async function handleSignup() {
    if (!email || !username || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const data = await signupUser({
        email,
        username,
        password,
      });

      // ✅ Save tokens
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      toast.success("Signup successful 🎉");
      navigate("/");
    }
    // } catch (err) {
    //   console.error(err);
    //   toast.error(err.message || "Signup failed");
    // } finally {
    //   setLoading(false);
    // }
    catch (err) {
  try {
    const errors = JSON.parse(err.message);

    // show clean messages
    Object.values(errors).forEach(msgArr => {
      toast.error(msgArr[0]);
    });

  } catch {
    toast.error("Signup failed");
  }
}
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Signup
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;