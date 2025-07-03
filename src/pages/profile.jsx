import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  FaCheckCircle,
  FaEnvelope,
  FaUser,
  FaIdBadge,
  FaFileAlt,
  FaTrashAlt,
  FaEdit,
  FaChartBar,
} from "react-icons/fa";
import { Loader2, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BoostRequestModal from "../components/BoostRequestModal";

const ExpandableText = ({ text, threshold = 300 }) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > threshold;
  const displayedText = expanded ? text : text.slice(0, threshold) + (shouldTruncate ? "..." : "");

  return (
    <div className="transition-all duration-300 overflow-hidden relative text-sm text-[#C9D1D9]">
      <p className="whitespace-pre-wrap">{displayedText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#FFD700] hover:underline text-xs mt-2 block"
        >
          {expanded ? "▲ See Less" : "▼ See More"}
        </button>
      )}
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monetizationStatus, setMonetizationStatus] = useState("not_requested");
  const [boostingPostId, setBoostingPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, postsRes, monetizationRes] = await Promise.all([
          API.get("/api/profile/"),
          API.get("/postsapi/myposts/"),
          API.get("/monetization/status/")
        ]);

        setProfile(profileRes.data);
        setPosts(postsRes.data);

        const { status } = monetizationRes.data;

        if (status === "approved") {
          setMonetizationStatus("accepted");
        } else if (status === "pending") {
          setMonetizationStatus("pending");
        } else if (status === "rejected") {
          setMonetizationStatus("rejected");
        } else {
          setMonetizationStatus("not_requested");
        }

      } catch (err) {
        toast.error("Error loading profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await API.delete(`/postsapi/delete/${postId}/`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch {
      toast.error("Error deleting post.");
    }
  };

  const handleResetTags = async () => {
    if (window.confirm("Are you sure you want to reset your feed preferences?")) {
      try {
        const token = localStorage.getItem("token");
        await API.post("/postsapi/reset-tags/", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Feed interests reset!");
      } catch {
        toast.error("Failed to reset interests.");
      }
    }
  };

  const renderMedia = (post) => {
    const style = {
      aspectRatio: "1 / 1",
      width: "100%",
      objectFit: "cover",
      borderRadius: "1rem",
      maxWidth: "100%",
      maxHeight: "1080px",
    };

    switch (post.post_type) {
      case "image":
        return <img src={post.media_url} alt="post" style={style} className="mx-auto" />;
      case "video":
        return (
          <video controls preload="metadata" style={style} className="mx-auto">
            <source src={post.media_url} type="video/mp4" />
          </video>
        );
      case "document":
        return (
          <a
            href={post.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00BFFF] hover:underline"
          >
            <FaFileAlt className="inline mr-2" /> View Document
          </a>
        );
      case "text":
        return (
          <div className="rounded-xl bg-[#22262e] p-4 shadow-md w-full mx-auto text-sm text-[#C9D1D9]">
            <ExpandableText text={post.caption} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white px-4 pt-24 pb-10 md:px-10">
      {/* Banner for Advertisers */}
      <div className="bg-yellow-600 text-black text-center py-3 rounded-lg shadow mb-6">
        📢 Want to promote your business? <span className="underline cursor-pointer" onClick={() => navigate("/advertise")}>Click here to submit your ad!</span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <motion.div
          className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-xl w-full md:max-w-sm md:sticky top-28 self-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
            <FaUser /> Your Profile
          </h2>

          {loading ? (
            <div className="text-center py-10 animate-pulse">
              <Loader2 className="mx-auto animate-spin text-[#FFD700]" size={30} />
              <p className="text-[#C9D1D9] mt-2">Loading profile...</p>
            </div>
          ) : profile ? (
            <>
              <div className="flex flex-col items-center gap-4 mb-6">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-[#FFD700] shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#30363D] flex items-center justify-center text-3xl font-bold text-[#FFD700]">
                    {profile.username?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-[#C9D1D9]">
                <div className="flex justify-center gap-8 text-center mb-4">
                  <div>
                    <p className="text-[#FFD700] text-xl font-bold">{profile.followers_count}</p>
                    <p className="text-xs text-[#C9D1D9]">Followers</p>
                  </div>
                  <div>
                    <p className="text-[#FFD700] text-xl font-bold">{profile.following_count}</p>
                    <p className="text-xs text-[#C9D1D9]">Following</p>
                  </div>
                </div>
                <p><span className="text-[#FFD700] font-medium">First Name:</span> {profile.first_name}</p>
                <p><span className="text-[#FFD700] font-medium">Last Name:</span> {profile.last_name}</p>
                <p className="flex items-center gap-1">
                  <span className="text-[#FFD700] font-medium">Username:</span> {profile.username}
                  {profile.is_badge && <BadgeCheck size={16} className="text-blue-500" />}
                </p>
                <p><FaEnvelope className="inline text-[#FFD700] mr-2" />{profile.email}</p>
                <p><FaIdBadge className="inline text-[#FFD700] mr-2" /> User ID: {profile.public_id}</p>
                <p className="mt-2 text-sm"><span className="text-[#FFD700] font-medium">Bio:</span> {profile.bio || "No bio added."}</p>
              </div>

              <div className="mt-4">
                {monetizationStatus === "accepted" ? (
                  <button onClick={() => navigate("/earningdashboard")} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm">💰 Creator Dashboard</button>
                ) : monetizationStatus === "pending" ? (
                  <p className="text-yellow-500 text-sm italic mt-1">Your monetization request is pending admin approval.</p>
                ) : monetizationStatus === "rejected" ? (
                  <p className="text-red-500 text-sm italic mt-1">Your request was rejected. Please contact support.</p>
                ) : profile.followers_count >= 100 ? (
                  <button onClick={() => navigate("/monetization-form")} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm">📝 Apply for Monetization</button>
                ) : (
                  <p className="text-gray-400 text-sm italic mt-1">Reach 100 followers to unlock monetization.</p>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <button onClick={() => navigate("/profile/update")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm justify-center"><FaEdit /> Edit Profile</button>
                <button onClick={handleResetTags} className="bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm">🔁 Reset Interests</button>
              </div>
            </>
          ) : (
            <p className="text-[#C9D1D9] animate-pulse">Profile not found...</p>
          )}
        </motion.div>

        {/* Posts Section */}
        <motion.div className="flex-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl font-bold text-[#FFD700] mb-6 border-b border-[#30363D] pb-2 text-center">
            Your Posts
          </h2>
          {loading ? (
            <div className="text-center py-10 animate-pulse">
              <Loader2 className="mx-auto animate-spin text-[#00BFFF]" size={30} />
              <p className="text-[#C9D1D9] mt-2">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-[#888] text-sm text-center">No posts yet.</p>
          ) : (
            <div className="flex flex-col items-center gap-6 px-4 md:px-0">
              {posts.map((post) => (
                <div key={post.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 shadow-md hover:shadow-2xl transition duration-300 w-full max-w-[600px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={profile.profile_image} alt="Author" className="w-10 h-10 rounded-full object-cover border border-[#FFD700]" />
                      <div className="text-sm font-medium text-[#FFD700] flex items-center gap-1">
                        {profile.username}
                        {profile.is_badge && <BadgeCheck size={16} className="text-blue-500" />}
                        {post.is_boosted && <span className="ml-2 text-orange-400 text-xs font-semibold">🚀 Boosted</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!post.is_boosted && (
                        <button onClick={() => setBoostingPostId(post.id)} className="text-orange-500 hover:text-orange-600 text-xs font-semibold border border-orange-500 px-2 py-1 rounded">🚀 Boost</button>
                      )}
                      <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700" title="Delete Post">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-2 line-clamp-2">{post.caption && post.post_type !== "text" ? post.caption : "No caption"}</div>
                  <div className="mb-2 text-xs text-[#888]">Tags: {post.tags || "None"}</div>
                  <div className="mb-2">{renderMedia(post)}</div>
                  <div className="text-xs text-right text-gray-500 mt-2">
                    Type: {post.post_type} | Post ID: #{post.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      {boostingPostId && (
        <BoostRequestModal postId={boostingPostId} onClose={() => setBoostingPostId(null)} />
      )}
    </div>
  );
};

export default Profile;
