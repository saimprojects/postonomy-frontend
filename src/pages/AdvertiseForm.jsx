import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const CLOUD_NAME = "dxommxt6d";
const UPLOAD_PRESET = "postonomy_ad_upload";

export default function AdvertiseForm() {
  const [formData, setFormData] = useState({
    title: "",
    redirect_link: "",
    button_label: "Learn More",
    custom_message: "",
    transaction_id: "",
    payment_screenshot: null,
    ad_media: null,
    payment_method: "jazzcash",
  });

  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let screenshotUrl = null;
      let adMediaUrl = null;

      if (formData.payment_screenshot) {
        screenshotUrl = await uploadToCloudinary(formData.payment_screenshot);
      }

      if (formData.ad_media) {
        adMediaUrl = await uploadToCloudinary(formData.ad_media);
      }

      const payload = {
        title: formData.title,
        redirect_link: formData.redirect_link,
        button_label: formData.button_label,
        custom_message: formData.custom_message,
        transaction_id: formData.transaction_id,
        payment_method: formData.payment_method,
        payment_screenshot: screenshotUrl,
        ad_media: adMediaUrl,
      };

      const token = localStorage.getItem("token");

      await API.post("/adsapi/create-ad-request/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Ad request submitted successfully! 🎉");
      toast.info("We’ll review your ad soon. ✅", {
        position: "top-right",
      });

      setFormData({
        title: "",
        redirect_link: "",
        button_label: "Learn More",
        custom_message: "",
        transaction_id: "",
        payment_screenshot: null,
        ad_media: null,
        payment_method: "jazzcash",
      });
    } catch (err) {
      toast.error("Error submitting ad request.");
    } finally {
      setLoading(false);
    }
  };

  const payment = paymentDetails[formData.payment_method];

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-24 pb-10 px-6 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-[#FFD700] mb-6 text-center"
      >
        📢 Advertise Your Business
      </motion.h1>

      <motion.div
        className="bg-[#161B22] p-6 rounded-xl shadow-lg border border-[#30363D] space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-sm text-[#C9D1D9]">
          📌 <span className="text-[#FFD700]">Fee:</span> PKR 500/week (Pay via JazzCash, Easypaisa or Bank Transfer).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-[#C9D1D9]">Select Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full bg-[#0D1117] border border-[#30363D] text-white px-4 py-2 rounded focus:outline-none"
            >
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="bg-[#0D1117] border border-[#30363D] rounded p-3 text-sm text-[#C9D1D9]">
            <h3 className="text-[#FFD700] font-semibold text-base mb-2">{payment.title}</h3>
            <p>👤 <strong>Account Holder:</strong> {payment.name}</p>
            {payment.number && <p>📞 <strong>Number:</strong> {payment.number}</p>}
            {payment.iban && <p>🏦 <strong>IBAN:</strong> {payment.iban}</p>}
            <p className="mt-2 text-xs text-gray-400 italic">Fee: Rs.500 (for 1 week ad)</p>
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Ad Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-white"
              placeholder="e.g. 50% OFF on Sneakers"
            />
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Redirect Link</label>
            <input
              name="redirect_link"
              value={formData.redirect_link}
              onChange={handleChange}
              required
              type="url"
              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-white"
              placeholder="https://yourshop.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Button Label</label>
            <input
              name="button_label"
              value={formData.button_label}
              onChange={handleChange}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Message</label>
            <textarea
              name="custom_message"
              value={formData.custom_message}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-white"
              placeholder="Write a short message for your ad..."
            />
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Transaction ID / Reference</label>
            <input
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleChange}
              required
              className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-white"
              placeholder="e.g. TXN-3248-JAZZCASH"
            />
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Payment Screenshot</label>
            <input
              name="payment_screenshot"
              onChange={handleChange}
              type="file"
              accept="image/*"
              required
              className="text-[#C9D1D9]"
            />
          </div>

          <div>
            <label className="block mb-1 text-[#C9D1D9]">Attach Ad Media</label>
            <input
              name="ad_media"
              onChange={handleChange}
              type="file"
              accept="image/*,video/*,application/pdf"
              required
              className="text-[#C9D1D9]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD700] text-black font-semibold py-2 rounded hover:bg-yellow-400 transition"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Submit Ad Request"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
