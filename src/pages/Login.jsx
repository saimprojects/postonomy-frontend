import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("justLoggedIn", "true");

      toast.success("✅ Login successful!", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });

      setTimeout(() => navigate("/dashboard"), 2200);
    } catch (err) {
      toast.error("❌ Invalid email or password!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#0D1117] pt-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer />
      <div className="bg-[#161B22] p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password Input with Toggle */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <Link
              to="/reset-password"
              className="text-sm text-[#C9D1D9] hover:text-[#FFD700] transition"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00BFFF] text-white py-3 rounded-md font-semibold hover:bg-[#0099cc] transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-[#C9D1D9] mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#FFD700] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
