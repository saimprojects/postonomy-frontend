import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import PostCard from "./PostCard";
import { Flame, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const TopThisWeek = () => {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const isHovered = useRef(false);

  const intervalDuration = 5000; // 🔁 5 seconds

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await API.get("/postsapi/top-this-week/");
        setPosts(res.data);
        setVisiblePosts(res.data.slice(0, 3));
        setStartIndex(3);
      } catch (error) {
        console.error("Error fetching top posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  useEffect(() => {
    if (posts.length <= 3) return;

    const rotatePosts = () => {
      intervalRef.current = setInterval(() => {
        if (isHovered.current) return;

        setVisiblePosts((prev) => {
          const next = posts.slice(startIndex, startIndex + 3);
          if (next.length > 0) {
            setStartIndex(startIndex + 3);
            return next;
          } else {
            setStartIndex(3);
            return posts.slice(0, 3);
          }
        });
      }, intervalDuration);
    };

    rotatePosts();
    return () => clearInterval(intervalRef.current);
  }, [posts, startIndex]);

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  return (
    <div
      className="mt-10 w-full max-w-2xl mx-auto px-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold text-purple-800 mb-6 flex items-center gap-2"
      >
        <Flame className="text-red-500 animate-pulse" size={22} />
        Top This Week
      </motion.h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-purple-600" size={28} />
        </div>
      ) : visiblePosts.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-center text-gray-500 italic"
        >
          No trending posts yet.
        </motion.p>
      ) : (
        <motion.div
          key={startIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TopThisWeek;
