import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import PostCard from "../components/PostCard";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// ✅ New SEO Hook
import { useDocumentMeta } from "../hooks/useDocumentMeta";

const PostDetail = () => {
  const { slug } = useParams();  // ✅ use slug instead of id
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/postsapi/posts/${slug}/`);  // ✅ slug based fetch
      setPost(res.data);
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  // ✅ Dynamic SEO Injection
  useDocumentMeta({
    title: post ? `${post.caption?.slice(0, 50) || "Post"} | Postonomy` : "Postonomy",
    description: post?.caption?.slice(0, 120) || "Post on Postonomy",
    ogTitle: post?.caption || "Postonomy",
    ogDescription: post?.caption?.slice(0, 100),
    ogImage: post?.media_url || "/logo192.png",
    ogUrl: `https://postonomy.com/post/${post?.slug}`,  // ✅ use slug not id
    twitterCard: "summary_large_image",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mt-5 px-3"
    >
      {/* 🔙 Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Feed
        </button>
      </div>

      {/* 🌀 Loader OR ✅ PostCard OR ❌ Error */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
        </div>
      ) : post ? (
        <PostCard post={post} />
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          Post not found.
        </motion.p>
      )}
    </motion.div>
  );
};

export default PostDetail;
