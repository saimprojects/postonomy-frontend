import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const WithdrawForm = ({ availableEarnings, totalEarnings, totalPaid }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    whatsapp: "",
    method: "jazzcash",
    amount: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      whatsapp: "",
      method: "jazzcash",
      amount: "",
    });
    setOtpInput("");
    setOtpVerified(false);
    setOtpSent(false);
  };

  const sendOtp = async () => {
    if (!form.email || !form.email.includes("@")) {
      toast.error("📧 Enter a valid email.");
      return;
    }
    setSendingOtp(true);
    try {
      await API.post("/postsapi/send-otp/", { email: form.email });
      setOtpSent(true);
      toast.success("✅ OTP sent to your Gmail.");
    } catch {
      toast.error("❌ Failed to send OTP. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpInput || otpInput.length < 4) {
      toast.error("🔐 Enter the full OTP.");
      return;
    }
    setVerifying(true);
    try {
      const res = await API.post("/postsapi/verify-otp/", {
        email: form.email,
        otp: otpInput,
      });
      if (res.data.verified) {
        setOtpVerified(true);
        toast.success("✅ Email verified!");
      } else {
        toast.error("❌ Incorrect OTP.");
      }
    } catch {
      toast.error("❌ Invalid or expired OTP.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);

    if (!otpVerified) return toast.error("🔐 Please verify your email first.");
    if (!amount || amount <= 0) return toast.error("🚫 Enter a valid amount.");
    if (amount > availableEarnings)
      return toast.error("⚠️ Cannot withdraw more than available balance.");
    if (amount < 25)
      return toast.error("⚠️ Minimum $25 is required for withdrawal.");

    setSubmitting(true);
    try {
      await API.post("/postsapi/withdraw-request/", form);
      toast.success("🎉 Withdrawal request submitted!");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto mt-10 px-4"
    >
      <h2 className="text-3xl font-bold mb-4 text-purple-700 animate-pulse">
        💰 Withdraw Request
      </h2>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
        <div className="bg-yellow-100 rounded-md p-3 text-yellow-800 font-semibold border border-yellow-300">
          Total: ${totalEarnings}
        </div>
        <div className="bg-red-100 rounded-md p-3 text-red-700 font-semibold border border-red-300">
          Paid: ${totalPaid}
        </div>
        <div className="bg-green-100 rounded-md p-3 text-green-800 font-semibold border border-green-300">
          Available: ${availableEarnings}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-2xl shadow-md border border-purple-100"
      >
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full border px-4 py-2 rounded focus:outline-purple-500"
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Gmail (for verification)"
          className="w-full border px-4 py-2 rounded focus:outline-purple-500"
          required
        />

        {!otpVerified && (
          <div className="space-y-2">
            {otpSent ? (
              <>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full border px-4 py-2 rounded focus:outline-purple-500"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={verifying}
                  className={`w-full px-4 py-2 rounded text-white font-semibold ${
                    verifying ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {verifying ? "Verifying..." : "✅ Verify OTP"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={sendOtp}
                disabled={sendingOtp}
                className={`w-full px-4 py-2 rounded text-white font-semibold ${
                  sendingOtp ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {sendingOtp ? "Sending OTP..." : "✉️ Send OTP to Gmail"}
              </button>
            )}
          </div>
        )}

        <input
          type="text"
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp Number"
          className="w-full border px-4 py-2 rounded focus:outline-purple-500"
          required
        />

        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:outline-purple-500"
        >
          <option value="jazzcash">JazzCash</option>
          <option value="easypaisa">EasyPaisa</option>
          <option value="paypal">PayPal</option>
          <option value="Personal-Bank">Bank Transfer</option>
        </select>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter Amount (USD)"
          className="w-full border px-4 py-2 rounded focus:outline-purple-500"
          required
        />

        <button
          type="submit"
          disabled={submitting || !otpVerified}
          className={`w-full py-2 rounded text-white font-semibold transition-all ${
            otpVerified
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? "Submitting..." : "🚀 Submit Request"}
        </button>
      </form>
    </motion.div>
  );
};

export default WithdrawForm;
