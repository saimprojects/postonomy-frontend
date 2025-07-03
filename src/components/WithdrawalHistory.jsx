import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { Banknote, Mail, Smartphone, BadgeCheck, Clock } from "lucide-react";

const WithdrawalHistory = () => {
  const [history, setHistory] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    API.get("/postsapi/my-withdrawals/")
      .then((res) => {
        const data = res.data || [];
        setHistory(data);

        const paidAmount = data
          .filter((item) => item.status?.toLowerCase() === "paid")
          .reduce((sum, item) => sum + (item.amount || 0), 0);

        setTotalPaid(paidAmount.toFixed(2));
      })
      .catch((err) => {
        console.error("Failed to fetch withdrawal history:", err);
        setHistory([]);
      });
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 text-center animate-pulse">
        💼 Withdrawal History
      </h2>

      {totalPaid > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-400 via-purple-500 to-blue-500 text-white text-sm rounded-xl px-6 py-3 font-semibold mb-8 shadow-md w-fit mx-auto"
        >
          ✅ Total Paid Out: <span className="ml-1">${totalPaid}</span>
        </motion.div>
      )}

      {history.length === 0 ? (
        <p className="text-sm italic text-gray-500 text-center">
          No withdrawal requests found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, index) => {
            const isPaid = item.status?.toLowerCase() === "paid";
            const statusText = item.status?.toUpperCase() || "PENDING";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white/70 backdrop-blur border border-purple-200 shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur ${
                      isPaid
                        ? "bg-green-200/80 text-green-800 animate-pulse"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {isPaid ? (
                      <BadgeCheck size={14} className="inline mr-1" />
                    ) : (
                      <Clock size={14} className="inline mr-1" />
                    )}
                    {statusText}
                  </span>
                </div>

                {/* Withdrawal Info */}
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Banknote size={18} className="text-purple-600" />
                    <span className="font-semibold">Method:</span>{" "}
                    {item.method?.toUpperCase() || "N/A"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-blue-500" />
                    <span className="font-semibold">Email:</span>{" "}
                    {item.email || "N/A"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-green-500" />
                    <span className="font-semibold">WhatsApp:</span>{" "}
                    {item.whatsapp || "N/A"}
                  </div>

                  {item.amount && (
                    <div
                      className={`${
                        isPaid ? "text-green-700" : "text-yellow-700"
                      } font-semibold flex items-center gap-2 mt-1`}
                    >
                      <Banknote size={16} />
                      Amount: ${item.amount}
                    </div>
                  )}
                </div>

                {/* Glowing Border on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -inset-1 rounded-2xl border-2 border-purple-300 opacity-0 blur-lg pointer-events-none z-0"
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;
