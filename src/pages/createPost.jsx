import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, Upload, FileText, Tag, FileImage, Video, File } from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
  const [form, setForm] = useState({
    caption: "",
    post_type: "text",
    tags: "",
    media: null,
  });
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, media: file }));
      setMediaPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("caption", form.caption);
    data.append("post_type", form.post_type);
    data.append("tags", form.tags);
    if (form.media) data.append("media", form.media);

    try {
      await API.post("postsapi/posts/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Post created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("❌ Failed to create post!");
    } finally {
      setLoading(false);
    }
  };

  const renderMediaPreview = () => {
    if (!mediaPreview) return null;
    if (form.post_type === "image") {
      return <img src={mediaPreview} alt="preview" className="max-h-64 rounded shadow" />;
    } else if (form.post_type === "video") {
      return <video src={mediaPreview} controls className="max-h-64 rounded shadow" />;
    } else if (form.post_type === "document") {
      return <iframe src={mediaPreview} title="document" className="w-full h-64 rounded shadow" />;
    }
    return null;
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-[#0D1117] text-white p-6 rounded-2xl shadow-xl border border-[#161B22] animate-fade-in">
      <h2 className="text-3xl font-bold text-purple-400 mb-6 flex items-center gap-2">
        <Upload /> Create a Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Caption */}
        <div>
          <label className="flex items-center gap-2 mb-1">
            <FileText /> Caption
          </label>
          <textarea
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Write something..."
            className="w-full bg-[#1a1a2e] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Post Type */}
        <div>
          <label className="flex items-center gap-2 mb-1">
            <File /> Post Type
          </label>
          <select
            name="post_type"
            value={form.post_type}
            onChange={handleChange}
            className="w-full bg-[#1a1a2e] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 mb-1">
            <Tag /> Tags
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Comma-separated tags"
            className="w-full bg-[#1a1a2e] p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Media Upload */}
        {form.post_type !== "text" && (
          <div>
            <label className="flex items-center gap-2 mb-1">
              {form.post_type === "image" && <FileImage />}
              {form.post_type === "video" && <Video />}
              {form.post_type === "document" && <File />}
              Upload {form.post_type}
            </label>
            <input
              type="file"
              name="media"
              onChange={handleChange}
              className="block w-full text-sm text-gray-300"
            />
            <div className="mt-3">{renderMediaPreview()}</div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-2 rounded-full flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" />} Post Now
        </button>
            <p className="text-yellow-400 text-sm mt-2">
      ⚠️ <strong>Post Requirements:</strong><br />
      📸 <strong>Images</strong>: Only <span className="text-white">1080x1080px</span> square allowed.<br />
      🎥 <strong>Videos</strong>: Only <span className="text-white">9:16 (vertical)</span> or <span className="text-white">1:1 (square)</span> allowed.<br />
      ❌ Any other format will be rejected.
    </p>
      </form>
    </div>
  );
};

export default CreatePost;
