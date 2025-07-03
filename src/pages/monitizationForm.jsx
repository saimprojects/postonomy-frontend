import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

const MonetizationForm = () => {
  const [form, setForm] = useState({
    email: "",
    method: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/monetization/request/", form);
      toast.success("Monetization request submitted!");
    } catch (err) {
      toast.error("Submission failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Apply for Monetization</h2>
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        className="w-full mb-3 border p-2 rounded"
      />
      <input
        type="text"
        name="method"
        placeholder="Withdrawal Method (PayPal, JazzCash)"
        value={form.method}
        onChange={handleChange}
        className="w-full mb-3 border p-2 rounded"
      />
      <textarea
        name="message"
        placeholder="Optional message"
        value={form.message}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default MonetizationForm;
