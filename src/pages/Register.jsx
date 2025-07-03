import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false); // ✅ new state for checkbox

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    profile_image: null,
    code: "",
  });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "checkbox") {
      setAgreed(checked);
    } else {
      setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    }
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    const required = ["first_name", "last_name", "username", "email", "password"];
    if (required.some((field) => !form[field])) {
      return toast.error("🔑 Fill all fields!", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    if (form.password !== form.confirm_password) {
      return toast.error("🚫 Passwords do not match!", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    if (!agreed) {
      return toast.error("📝 Please agree to Terms & Privacy Policy", {
        position: "top-right",
        autoClose: 2500,
      });
    }

    const data = new FormData();
    ["first_name", "last_name", "username", "email", "password", "profile_image"].forEach((k) => {
      if (form[k]) data.append(k, form[k]);
    });

    try {
      await API.post("/api/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Code sent to email!", {
        position: "top-right",
        autoClose: 2000,
      });
      setStep(2);
    } catch (err) {
      const res = err.response?.data;
      console.log("Error Response Data:", res);
      if (res?.username) {
        toast.error(`⚠️ ${res.username}`, { position: "top-right", autoClose: 3000 });
      } else if (res?.email) {
        toast.error(`📧 ${res.email}`, { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(res?.detail || "Registration failed!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (!form.code) {
      return toast.error("✍️ Enter the code!", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    try {
      await API.post("/api/verify-email/", {
        email: form.email,
        code: form.code,
      });
      toast.success("🎉 Verified! Redirecting to login...", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => (window.location.href = "/login"), 2200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Invalid code!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-[#0D1117] py-8 px-4">
      <ToastContainer />
      <div className="bg-[#161B22] w-full max-w-lg p-8 rounded-2xl shadow-2xl">
        {step === 1 ? (
          <form onSubmit={handleStep1}>
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Create your account
            </h2>

            <div className="relative mb-4">
              <FaUser className="absolute left-3 top-4 text-[#FFD700]" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={form.username}
                className="w-full pl-10 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <FaUser className="absolute left-3 top-4 text-[#FFD700]" />
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  onChange={handleChange}
                  value={form.first_name}
                  className="w-full pl-10 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
              <div className="relative flex-1">
                <FaUser className="absolute left-3 top-4 text-[#FFD700]" />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  onChange={handleChange}
                  value={form.last_name}
                  className="w-full pl-10 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                />
              </div>
            </div>

            <div className="relative mb-4">
              <FaEnvelope className="absolute left-3 top-4 text-[#FFD700]" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={form.email}
                className="w-full pl-10 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
            </div>

            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-4 text-[#FFD700]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                className="w-full pl-10 pr-10 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 cursor-pointer transition-transform hover:scale-110"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-4 text-[#FFD700]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={form.confirm_password}
                className={`w-full pl-10 pr-10 p-3 rounded-md bg-[#0D1117] text-white border ${
                  form.confirm_password && form.confirm_password !== form.password
                    ? "border-red-600 focus:ring-red-600"
                    : "border-gray-600 focus:ring-[#FFD700]"
                } focus:outline-none focus:ring-2`}
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 cursor-pointer transition-transform hover:scale-110"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            <h1 className="text-yellow-400">Profile Image</h1>
            <div className="relative mb-6">
              <FaUserCircle className="absolute left-3 top-4 text-[#FFD700]" />
              <input
                type="file"
                name="profile_image"
                onChange={handleChange}
                className="w-full pl-10 p-2 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none"
              />
            </div>

            {/* ✅ Terms and Conditions */}
            <div className="flex items-start mb-4 text-white text-sm">
              <input
                type="checkbox"
                id="agree"
                className="mr-2 mt-1"
                checked={agreed}
                onChange={handleChange}
              />
              <label htmlFor="agree">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-400 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-blue-400 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00BFFF] text-white py-3 rounded-md font-semibold hover:bg-[#0099cc] transition"
            >
              Register
            </button>

            <motion.p
              className="text-center text-sm text-[#C9D1D9] mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Already have an account?{" "}
              <Link className="text-[#FFD700] hover:underline" to="/login">
                Login
              </Link>
            </motion.p>
          </form>
        ) : (
          <form onSubmit={handleStep2}>
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Enter Verification Code
            </h2>
            <input
              type="text"
              name="code"
              placeholder="6-digit code"
              onChange={handleChange}
              value={form.code}
              className="w-full mb-6 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
            <button
              type="submit"
              className="w-full bg-[#FFD700] text-[#0D1119] py-3 rounded-md font-semibold hover:bg-[#e6c200] transition"
            >
              Verify Email
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
