import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Loader2, BadgeCheck } from "lucide-react";
import { toast } from "react-toastify";

const PublicProfile = () => {
  const { public_id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // 1️⃣ Get target user's public profile
        const res = await API.get(`/api/profile/${public_id}/`);
        setProfile(res.data);

        // 2️⃣ Check if already following using new endpoint
        const followCheck = await API.get(`/api/is-following/${res.data.id}/`);
        setFollowing(followCheck.data.is_following);
      } catch (err) {
        toast.error("Failed to load profile");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [public_id]);

  // 🔁 FOLLOW
  const handleFollow = async () => {
    if (!profile?.id) return;
    setChecking(true);
    try {
      await API.post(`/api/follow/${profile.id}/`);
      toast.success("Followed!");
      setFollowing(true);
      setProfile((prev) => ({
        ...prev,
        followers_count: (prev.followers_count || 0) + 1,
      }));
    } catch {
      toast.error("Failed to follow.");
    } finally {
      setChecking(false);
    }
  };

  // 🔁 UNFOLLOW
  const handleUnfollow = async () => {
    if (!profile?.id) return;
    setChecking(true);
    try {
      await API.post(`/api/unfollow/${profile.id}/`);
      toast.info("Unfollowed!");
      setFollowing(false);
      setProfile((prev) => ({
        ...prev,
        followers_count: Math.max((prev.followers_count || 1) - 1, 0),
      }));
    } catch {
      toast.error("Failed to unfollow.");
    } finally {
      setChecking(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0D1117] text-white">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={30} />
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 bg-[#0D1117] text-white">
      {/* Profile Info Card */}
      <div className="max-w-4xl mx-auto bg-[#161B22] p-6 rounded-xl shadow-md mb-10">
        <div className="flex items-center gap-4">
          <img
            src={
              profile?.profile_image?.includes("res.cloudinary.com")
                ? profile.profile_image
                : `https://ui-avatars.com/api/?name=${profile.username || "User"}`
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-purple-600 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
              {profile.username}
              {profile.is_badge && (
                <BadgeCheck className="text-blue-500" size={18} />
              )}
            </h2>
            <p className="text-sm text-gray-400">
              {profile.bio || "No bio available"}
            </p>
            <p className="text-xs mt-1 text-gray-500">
              Followers: {profile.followers_count} | Following:{" "}
              {profile.following_count}
            </p>
          </div>

          {/* Follow / Unfollow Button */}
          <div className="ml-auto">
            {following ? (
              <button
                onClick={handleUnfollow}
                disabled={checking}
                className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white text-sm"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={checking}
                className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-white text-sm"
              >
                Follow
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        {profile?.posts?.length > 0 ? (
          profile.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p className="text-center text-gray-400">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
