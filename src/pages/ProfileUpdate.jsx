import React, { useEffect, useState } from "react";
import API from "../api";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Loader2, Pencil, User, Mail, ImagePlus, FileText } from "lucide-react";

const ProfileUpdate = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    bio: "",
    profile_image: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/profile/", { withCredentials: true }).then((res) => {
      setForm((prev) => ({
        ...prev,
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        username: res.data.username,
        email: res.data.email,
        bio: res.data.bio || "",
      }));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);
    formData.append("username", form.username);
    formData.append("bio", form.bio);
    if (form.profile_image) {
      formData.append("profile_image", form.profile_image);
    }

    try {
      await API.put("/api/profile/update/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      if (err.response?.data?.username) {
        toast.error("⚠️ Username already exists!");
      } else {
        toast.error("❌ Update failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#1a1a2e] rounded-xl p-6 mt-8 shadow-2xl text-white">
      {/* ✅ Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <h2 className="text-3xl font-bold text-purple-400 mb-4 flex items-center gap-2">
        <User className="text-purple-500" /> Update Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        {/* First Name */}
        <div>
          <label className="flex gap-2 items-center font-medium">
            <Pencil /> First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full bg-[#2e2e42] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your First Name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="flex gap-2 items-center font-medium">
            <Pencil /> Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full bg-[#2e2e42] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your Last Name"
          />
        </div>

        {/* Username */}
        <div>
          <label className="flex gap-2 items-center font-medium">
            <User /> Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-[#2e2e42] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your Username"
          />
        </div>

        {/* Email (disabled) */}
        <div>
          <label className="flex gap-2 items-center font-medium">
            <Mail /> Email
          </label>
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full bg-gray-700 text-gray-300 p-3 rounded cursor-not-allowed"
            title="You can't change your email"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="flex gap-2 items-center font-medium">
            <FileText /> Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="4"
            className="w-full bg-[#2e2e42] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Tell us something about yourself..."
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="flex gap-2 items-center font-medium">
            <ImagePlus /> Profile Image
          </label>
          <input
            type="file"
            name="profile_image"
            onChange={handleChange}
            className="block w-full text-sm text-gray-300"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-full flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" />} Update Profile
          </button>

          <button
            type="button"
            onClick={() => navigate("/reset-password")}
            className="text-sm text-yellow-400 underline hover:text-yellow-500"
          >
            Reset Password?
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
