// Full updated PostCard.jsx with slug-based routing and API usage

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  FileText,
  BadgeCheck,
  MoreVertical,
} from "lucide-react";
import PostReport from "../pages/PostReport";
import { Menu } from "@headlessui/react";

const ExpandableText = ({ text, maxWords = 20 }) => {
  const [expanded, setExpanded] = useState(false);
  const words = text?.trim()?.split(" ") || [];
  if (!text || words.length === 0) return null;
  if (words.length <= maxWords)
    return <p className="text-sm text-gray-700">{text}</p>;
  const preview = words.slice(0, maxWords).join(" ") + "...";
  return (
    <p className="text-sm text-gray-700">
      {expanded ? text : preview}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-purple-600 ml-1 text-[11px] underline"
      >
        {expanded ? "See Less" : "See More"}
      </button>
    </p>
  );
};

const PostCard = ({ post }) => {
  const ref = useRef();
  const videoRef = useRef();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [me, setMe] = useState(null);
  const [following, setFollowing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const isTrending = (post.likes || 0) >= 10 || (post.impressions || 0) >= 30;
  const isTop = post.likes >= 20 && post.comments_count >= 10;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/api/profile/");
        setMe(res.data);
        if (res.data.id !== post.user_id) {
          const check = await API.get(`/api/is-following/${post.user_id}/`);
          setFollowing(check.data.is_following);
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    let watchStart = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          watchStart = Date.now();
          if (post.post_type === "video" && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          const timeSpent = watchStart
            ? Math.floor((Date.now() - watchStart) / 1000)
            : 0;
          if (timeSpent > 0) {
            API.post(`/postsapi/posts/${post.slug || post.id}/impression/`, {
              time_spent: timeSpent,
            }).catch((e) => console.error("View tracking error:", e));
          }
          if (videoRef.current) videoRef.current.pause();
          watchStart = null;
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleReaction = async (is_like) => {
    try {
      await API.post(`/postsapi/posts/${post.slug || post.id}/react/`, {
        is_like,
      });
      const res = await API.get(`/postsapi/posts/${post.slug || post.id}/`);
      setLikes(res.data.likes);
      toast.success(is_like ? "Liked!" : "Disliked!");
    } catch {
      toast.error("Login required to react.");
    }
  };

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments) {
      try {
        const res = await API.get(
          `/postsapi/posts/${post.slug || post.id}/comments/`
        );
        setComments(res.data);
      } catch {
        toast.error("Failed to load comments.");
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return toast.warning("Write something!");
    setSubmitting(true);
    try {
      await API.post(`/postsapi/posts/${post.slug || post.id}/comments/`, {
        content: commentInput,
      });
      setCommentInput("");
      const res = await API.get(
        `/postsapi/posts/${post.slug || post.id}/comments/`
      );
      setComments(res.data);
      toast.success("Comment added!");
    } catch {
      toast.error("Login required to comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFollow = async () => {
    setChecking(true);
    try {
      await API.post(`/api/follow/${post.user_id}/`);
      setFollowing(true);
      toast.success("Followed!");
    } catch {
      toast.error("Failed to follow.");
    } finally {
      setChecking(false);
    }
  };

  const handleUnfollow = async () => {
    setChecking(true);
    try {
      await API.post(`/api/unfollow/${post.user_id}/`);
      setFollowing(false);
      toast.info("Unfollowed!");
    } catch {
      toast.error("Failed to unfollow.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full sm:w-[95%] md:w-[90%] lg:w-[75%] xl:w-[65%] mx-auto p-4 bg-white rounded-xl shadow-lg text-sm transition-all duration-500 ${
        isTop
          ? "border-2 border-yellow-300"
          : isTrending
          ? "border border-red-300"
          : "border border-gray-200"
      }`}
    >
      {/* 👤 User Info */}
      <div className="flex items-center justify-between mb-2">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/profile/${post.user_public_id}`)}
        >
          <img
            src={
              post.user_image
                ? post.user_image.replace("http://", "https://")
                : `https://ui-avatars.com/api/?name=${post.username}`
            }
            alt="profile"
            className="w-8 h-8 rounded-full object-cover select-none pointer-events-none"
            onContextMenu={(e) => e.preventDefault()}
          />
          <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
            {post.username}
            {post.is_badge && (
              <BadgeCheck
                size={14}
                className="text-blue-500"
                title="Verified"
              />
            )}
          </span>
          media_url
        </div>

        <div className="flex items-center gap-2">
          {me && post.user_id !== me.id && (
            <div>
              {following ? (
                <button
                  onClick={handleUnfollow}
                  disabled={checking}
                  className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-2 py-1 rounded"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={checking}
                  className="bg-green-500 hover:bg-green-600 text-white text-[10px] px-2 py-1 rounded"
                >
                  Follow
                </button>
              )}
            </div>
          )}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <MoreVertical className="text-gray-600" size={18} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className={`block w-full px-4 py-2 text-left ${
                      active ? "bg-red-100 text-red-600" : "text-gray-700"
                    }`}
                  >
                    ⚠️ Report Post
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      {/* 📢 Caption */}
      <Link to={`/post/${post.slug || post.id}`}>
        <ExpandableText text={post.caption} maxWords={20} />
      </Link>

      {/* 🖼️ Media */}
      <Link to={`/post/${post.slug || post.id}`}>
        {post.post_type === "image" && post.media_url && (
          <motion.img
            src={post.media_url.replace("http://", "https://")}
            alt="Post"
            className="rounded-lg w-full max-h-[350px] object-contain mt-2 pointer-events-none select-none"
            onContextMenu={(e) => e.preventDefault()}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        )}

        {post.post_type === "video" && post.media_url && (
          <video
            ref={videoRef}
            src={post.media_url.replace("http://", "https://")}
            muted
            controls
            controlsList="nodownload noplaybackrate"
            className="w-full max-h-[350px] rounded-lg mt-2 object-contain"
            onContextMenu={(e) => e.preventDefault()}
          />
        )}

        {post.post_type === "document" && post.media_url && (
          <a
            href={post.media_url.replace("http://", "https://")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 flex gap-1 items-center underline mt-2 text-xs"
          >
            <FileText size={14} /> View Document
          </a>
        )}
      </Link>

      {/* 👍 Reactions */}
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={() => handleReaction(true)}
          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
        >
          <ThumbsUp size={14} /> ({likes})
        </button>
        <button
          onClick={() => handleReaction(false)}
          className="text-red-600 hover:text-red-800 flex items-center gap-1 text-xs"
        >
          <ThumbsDown size={14} />
        </button>
        <button
          onClick={toggleComments}
          className="text-blue-500 hover:text-blue-700 ml-auto flex items-center gap-1 text-xs"
        >
          <MessageSquareText size={14} /> 💬
        </button>
      </div>

      {/* 💬 Comments */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-3"
        >
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className="w-full border text-xs p-2 rounded"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={submitting}
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
          <div className="mt-2 space-y-2">
            {comments.length === 0 ? (
              <p className="text-xs italic text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-50 p-2 rounded text-xs shadow-sm"
                >
                  <p className="font-semibold text-purple-700 flex items-center gap-1">
                    {c.user}
                    {c.is_badge && (
                      <BadgeCheck
                        size={12}
                        className="text-blue-500"
                        title="Verified"
                      />
                    )}
                  </p>
                  <p className="text-gray-800">{c.content}</p>
                  {c.replies?.map((r) => (
                    <div
                      key={r.id}
                      className="ml-4 mt-1 bg-gray-100 p-2 rounded text-xs"
                    >
                      <p className="font-semibold text-purple-600 flex items-center gap-1">
                        {r.user}
                        {r.is_badge && (
                          <BadgeCheck
                            size={14}
                            className="text-blue-500"
                            title="Verified"
                          />
                        )}
                      </p>
                      <p>{r.content}</p>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* 🚩 PostReport Modal */}
      {showReportModal && (
        <PostReport
          postId={post.slug || post.id}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </motion.div>
  );
};

export default PostCard;
