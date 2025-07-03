import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../api";

const BoostRequestModal = ({ postId, onClose }) => {
  const [method, setMethod] = useState("jazzcash"); // default lowercase
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ fixed keys: lowercase
  const paymentDetails = {
    jazzcash: {
      title: "JazzCash Payment Details",
      name: "Hafiz Abdul Majeed",
      number: "+923066816105",
    },
    easypaisa: {
      title: "EasyPaisa Payment Details",
      name: "Hafiz Abdul Majeed",
      number: "+923066816105",
    },
    bank_transfer: {
      title: "Bank Transfer Details",
      name: "Hafiz Abdul Majeed",
      iban: "PK11NAYA1234503066816105",
    },
  };

  const handleSubmit = async () => {
    if (!reference) {
      toast.error("Please enter transaction ID.");
      return;
    }

    setLoading(true);
    try {
      await API.post(
        `/postsapi/posts/${postId}/boost-request/`,
        {
          post: postId, // ✅ important for backend
          method: method,
          reference_id: reference,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Boost request submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit boost request.");
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const payment = paymentDetails[method]; // ✅ dynamic details

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161B22] border border-[#30363D] p-6 rounded-xl w-full max-w-md shadow-xl relative text-white"
      >
        <h2 className="text-xl font-bold text-[#FFD700] mb-4">🚀 Boost Post</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-[#C9D1D9]">Select Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-[#0D1117] border border-[#30363D] text-white px-4 py-2 rounded focus:outline-none"
          >
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">EasyPaisa</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="mb-4 bg-[#0D1117] border border-[#30363D] rounded p-3 text-sm text-[#C9D1D9]">
          <h3 className="text-[#FFD700] font-semibold text-base mb-2">{payment.title}</h3>
          <p>👤 <strong>Account Holder:</strong> {payment.name}</p>
          {payment.number && <p>📞 <strong>Number:</strong> {payment.number}</p>}
          {payment.iban && <p>🏦 <strong>IBAN:</strong> {payment.iban}</p>}
          <p className="mt-2 text-xs text-gray-400 italic">Fee: Rs.500 (for 1 week boost)</p>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-[#C9D1D9]">Transaction ID / Ref #</label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. TXN123456789"
            className="w-full bg-[#0D1117] border border-[#30363D] text-white px-4 py-2 rounded focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#FFD700] text-black font-semibold rounded text-sm hover:bg-yellow-400"
          >
            {loading ? "Submitting..." : "Submit Boost"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BoostRequestModal;
