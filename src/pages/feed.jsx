import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import { refreshToken } from "../utils/refreshToken";
import PostCard from "../components/PostCard";
import AdCard from "../components/adcard";
import LoginPopup from "../components/LoginPopup"; // ✅ new import
import {
  Loader2,
  Flame,
  UserCheck,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

// Inject Ads Function (unchanged)
const injectAds = (posts, ads, interval = 5) => {
  const result = [];
  let adIndex = 0;
  for (let i = 0; i < posts.length; i++) {
    result.push({ type: "post", data: posts[i] });
    if ((i + 1) % interval === 0 && ads.length > 0) {
      result.push({ type: "ad", data: ads[adIndex] });
      adIndex = (adIndex + 1) % ads.length;
    }
  }
  return result;
};

const Feed = () => {
  useDocumentMeta({
    title: "Postonomy — Global Creator Platform",
    description: "Postonomy is the top platform to earn by posting videos, blogs, and content.",
    ogTitle: "Postonomy",
    ogDescription: "Global earning platform for creators.",
    ogImage: "/logo192.png",
    ogUrl: "https://postonomy.com/",
    twitterCard: "summary_large_image",
  });

  const [activeTab, setActiveTab] = useState("forYou");
  const [forYouPosts, setForYouPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [visibleTop, setVisibleTop] = useState([]);
  const [startIndex, setStartIndex] = useState(3);
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  const [topOpen, setTopOpen] = useState(true);
  const [ads, setAds] = useState([]);

  const intervalRef = useRef(null);
  const isHovered = useRef(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access"); // ✅ check token

  const posts = activeTab === "forYou" ? forYouPosts : followingPosts;

  useEffect(() => {
    const fetchFeeds = async () => {
      await refreshToken();
      try {
        const [foryou, following, adsRes] = await Promise.all([
          API.get("/postsapi/feed/"),
          API.get("/postsapi/following-feed/"),
          API.get("/adsapi/"),
        ]);
        setForYouPosts(foryou.data);
        setFollowingPosts(following.data);
        setAds(adsRes.data);
      } catch (err) {
        console.error("Feed error:", err);
      } finally {
        setLoading(false);
      }

      try {
        const topRes = await API.get("/postsapi/top-this-week/");
        setTopPosts(topRes.data);
        setVisibleTop(topRes.data.slice(0, 3));
        setStartIndex(3);
      } catch (err) {
        console.error("Top This Week error:", err);
      } finally {
        setTopLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  useEffect(() => {
    if (topPosts.length <= 3) return;

    intervalRef.current = setInterval(() => {
      if (isHovered.current) return;
      setVisibleTop(() => {
        const next = topPosts.slice(startIndex, startIndex + 3);
        if (next.length > 0) {
          setStartIndex(startIndex + 3);
          return next;
        } else {
          setStartIndex(3);
          return topPosts.slice(0, 3);
        }
      });
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [topPosts, startIndex]);

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  const mixedFeed = injectAds(posts, ads, 5);

  return (
    <div className="relative pt-24 pb-20 px-4 max-w-3xl mx-auto">
      {/* 🔥 Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("forYou")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "forYou"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <Flame className="inline mr-1" size={16} />
          For You
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeTab === "following"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          <UserCheck className="inline mr-1" size={16} />
          Following
        </button>
      </div>

      {/* 📝 Feed Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-purple-600" size={28} />
        </div>
      ) : mixedFeed.length === 0 ? (
        <p className="text-center text-gray-500 italic">No Post Fetched Yet OR Login Needed First Register Yourself</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {mixedFeed.map((item, index) =>
            item.type === "post" ? (
              <PostCard
                key={`post-${item.data.id}-${index}`}
                post={item.data}
                isAuthenticated={!!token} // ✅ pass auth status
              />
            ) : (
              <AdCard key={`ad-${index}`} ad={item.data} />
            )
          )}
        </motion.div>
      )}

      {/* 🏆 Top This Week Sidebar */}
      <motion.div
        animate={{ x: topOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 left-0 w-64 bg-white shadow-xl border rounded-r-2xl p-4 z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          onClick={() => setTopOpen(!topOpen)}
          className="absolute -right-6 top-5 bg-white border shadow p-1 rounded-full z-50"
        >
          {topOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Trophy className="text-yellow-500" size={18} />
          <h2 className="text-sm font-semibold text-gray-700">Top This Week</h2>
        </div>

        {topLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-yellow-50 rounded-lg" />
            ))}
          </div>
        ) : visibleTop.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No trending posts yet.</p>
        ) : (
          <div className="space-y-2">
            {visibleTop.map((post) => (
              <button
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="w-full text-left bg-gray-50 border hover:bg-gray-100 transition rounded-lg p-2 text-xs shadow-sm"
              >
                <div className="font-medium text-gray-800 truncate">
                  {post.caption?.slice(0, 50) || "Untitled Post"}...
                </div>
                <div className="text-[10px] text-gray-500">@{post.username}</div>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* 👤 Popup for Unauthenticated Users */}
      {!token && <LoginPopup />} {/* ✅ conditional render */}
    </div>
  );
};

export default Feed;
