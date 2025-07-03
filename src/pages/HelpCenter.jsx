import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Loader2,
  SendHorizonal,
  Mail,
  User,
  ListChecks,
  BadgeCheck,
  Clock3,
} from "lucide-react";
import { motion } from "framer-motion";
import API from "../api";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [ticketID, setTicketID] = useState("");
  const [ticketHistory, setTicketHistory] = useState([]);

  // ✅ Load ticket history from localStorage on mount
  useEffect(() => {
    const storedTickets = localStorage.getItem("ticketHistory");
    if (storedTickets) {
      setTicketHistory(JSON.parse(storedTickets));
    }
  }, []);

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("ticketHistory", JSON.stringify(ticketHistory));
  }, [ticketHistory]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        user_name: formData.name,
        user_email: formData.email,
        message: formData.message,
      };

      const res = await API.post("/support/submit-ticket/", payload);
      const newTicket = {
        ticket_id: res.data.ticket_id,
        status: "pending", // Default
      };

      setTicketID(res.data.ticket_id);
      setTicketHistory((prev) => [newTicket, ...prev]);
      toast.success("Ticket Submitted Successfully 🎫");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to submit ticket ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10 p-6 rounded-2xl bg-white shadow-xl border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛠️ Help Center
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="pl-10 w-full py-2 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="pl-10 w-full py-2 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="message"
          placeholder="Describe your issue..."
          rows="4"
          className="w-full py-2 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
          {loading ? "Submitting..." : "Submit Ticket"}
        </motion.button>
      </form>

      {/* ✅ Ticket ID */}
      {ticketID && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl text-center">
          🎫 Your ticket number: <strong>{ticketID}</strong>
        </div>
      )}

      {/* ✅ Ticket History */}
      {ticketHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <ListChecks size={20} /> Ticket History
          </h3>
          <ul className="space-y-3">
            {ticketHistory.map((ticket, index) => (
              <li
                key={index}
                className="p-3 border border-gray-200 rounded-xl bg-gray-50 flex justify-between items-center"
              >
                <span className="text-sm text-gray-700">
                  🎫 <strong>{ticket.ticket_id}</strong>
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    ticket.status === "solved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  } flex items-center gap-1`}
                >
                  {ticket.status === "solved" ? (
                    <>
                      <BadgeCheck size={14} /> Solved
                    </>
                  ) : (
                    <>
                      <Clock3 size={14} /> Pending
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Terms & Conditions and Privacy Policy */}
      <div className="mt-10 text-center text-sm text-gray-500">
        By submitting, you agree to our{" "}
        <Link
          to="/terms"
          className="text-blue-600 hover:underline hover:text-blue-800 transition"
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          to="/privacy-policy"
          className="text-blue-600 hover:underline hover:text-blue-800 transition"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </motion.div>
  );
};

export default HelpCenter;
