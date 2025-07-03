import React, { useState, useEffect } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { Send, ShieldAlert, X } from "lucide-react";
import { motion } from "framer-motion";

const PostReport = ({ postId, onClose }) => {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      toast.error("❌ No Post ID provided. Please try again.");
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postId || typeof postId !== "number") {
      toast.error("❌ Invalid post ID. Please refresh.");
      return;
    }

    if (!reason) {
      toast.error("⚠️ Please select a reason.");
      return;
    }

    setLoading(true);
    try {
      await API.post(`/postsapi/posts/${postId}/report/`, {
        reason,
        message,
      });

      toast.success("✅ Report submitted successfully!");
      setReason("");
      setMessage("");

      if (onClose) onClose(); // Close modal if provided
    } catch (error) {
      console.error("Report Error:", error);
      toast.error("❌ Failed to submit report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6 space-y-6 relative overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
          >
            <X size={22} />
          </button>
        )}

        {/* 🚨 Header */}
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white mb-2">
          <ShieldAlert className="text-red-500 animate-pulse" size={28} />
          Report This Post
        </h2>

        {/* 📋 Reason Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Reason <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Select reason --</option>
            <option value="spam">Spam or misleading</option>
            <option value="violence">Violence or harmful content</option>
            <option value="hate">Hate speech or symbols</option>
            <option value="nudity">Nudity or sexual content</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* 📝 Message (optional) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Additional Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="You can provide more context here..."
            rows={4}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* 🚀 Submit Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Report
            </>
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default PostReport;
