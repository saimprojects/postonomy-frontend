import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";
import useNotifications from "../hooks/useNotifications";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const NotificationBell = () => {
  const { notifications, unread, fetchNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-refresh when bell opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const markAsRead = async (id) => {
    setLoading(true);
    try {
      await API.post(`/api/notifications/read/${id}/`);
      await fetchNotifications();
    } catch (err) {
      console.error("Mark single read error", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await API.post(`/api/notifications/read-all/`);
      await fetchNotifications();
    } catch (err) {
      console.error("Mark all read error", err);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg) => {
    if (msg.startsWith("user/")) {
      const publicId = msg.split("-")[0].replace("user/", "");
      const rest = msg.split("-").slice(1).join(" ");
      return (
        <>
          <Link
            to={`/profile/${publicId}`}
            className="text-purple-700 font-medium hover:underline"
          >
            {publicId}
          </Link>{" "}
          {rest}
        </>
      );
    }
    return msg;
  };

  return (
    <div className="relative z-50">
      <button onClick={() => setOpen((prev) => !prev)} className="relative">
        <Bell className="text-purple-600 hover:scale-110 transition" size={22} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-80 max-h-[350px] overflow-auto bg-white text-black border border-gray-200 shadow-xl rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
              {notifications.length > 0 && unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-purple-600 hover:underline disabled:opacity-50"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-purple-600" size={20} />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No notifications available.
              </p>
            ) : (
              notifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  onClick={() => {
                    if (n.url) window.location.href = n.url;
                    if (!n.is_read) markAsRead(n.id);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition border ${
                    !n.is_read ? "bg-purple-50 border-purple-100" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800 flex gap-2 items-center">
                    {!n.is_read && <CheckCircle size={14} className="text-purple-500" />}
                    {renderMessage(n.message)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
