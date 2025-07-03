import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import API from "../api";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    code: "",
    new_password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendResetCode = async () => {
    setLoading(true);
    try {
      await API.post("/api/send-password-reset-code/", { email: form.email });
      toast.success("📩 Code sent to your email");
      setStep(2);
    } catch {
      toast.error("❌ Email not found");
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (form.new_password !== form.confirm_password) {
      toast.error("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/verify-reset-code/", {
        email: form.email,
        code: form.code,
        new_password: form.new_password,
      });
      toast.success("🔐 Password reset successfully!");
      setStep(4);
    } catch {
      toast.error("❌ Invalid code or email");
    }
    setLoading(false);
  };

  // Redirect to login after 3 seconds
  useEffect(() => {
    if (step === 4) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [step, navigate]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-[#0D1117] pt-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer />
      <div className="bg-[#161B22] p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          🔄 Reset Password
        </h2>

        {step === 1 && (
          <>
            <p className="text-[#C9D1D9] mb-4 text-sm">
              Enter your email to receive a verification code.
            </p>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-4 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              required
            />
            <button
              onClick={sendResetCode}
              className="w-full bg-[#00BFFF] text-white py-3 rounded-md font-semibold hover:bg-[#0099cc] transition flex justify-center items-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send Code"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[#C9D1D9] mb-4 text-sm">
              Enter the code you received and your new password.
            </p>
            <input
              type="text"
              name="code"
              placeholder="Verification Code"
              value={form.code}
              onChange={handleChange}
              className="w-full mb-4 p-3 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="new_password"
                placeholder="New Password"
                value={form.new_password}
                onChange={handleChange}
                className="w-full p-3 pr-10 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full p-3 pr-10 rounded-md bg-[#0D1117] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </div>
            </div>

            <button
              onClick={verifyCode}
              className="w-full bg-[#FFD700] text-[#0D1117] py-3 rounded-md font-semibold hover:bg-[#e6c200] transition flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}

        {step === 4 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center text-[#2ECC71] font-semibold text-xl"
          >
            ✅ Password reset successful. Redirecting to login...
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ResetPassword;
