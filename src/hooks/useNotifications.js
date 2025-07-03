import { useEffect, useState } from "react";
import API from "../api";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/api/notifications/");
      setNotifications(res.data);
      const unreadCount = res.data.filter((n) => !n.is_read).length;
      setUnread(unreadCount);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, unread, fetchNotifications };
};

export default useNotifications;
