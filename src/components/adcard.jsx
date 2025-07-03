import React from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

const AdCard = ({ ad }) => {
  if (!ad) return null;

  // Utility: Check if it's a video
  const isVideo = ad.media_url && /\.(mp4|webm|ogg)$/i.test(ad.media_url);

  return (
    <motion.a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="block w-full sm:w-[95%] md:w-[90%] lg:w-[75%] xl:w-[65%] mx-auto p-4 bg-yellow-50 border-[5px] border-yellow-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500"
    >
      {/* 🧠 Header */}
      <div className="text-center text-sm font-bold text-yellow-800 py-1 border-b border-yellow-300 tracking-wide">
        Sponsored
      </div>

      {/* 🎥 Image / Video */}
      <div className="p-4 flex items-center justify-center">
        {ad.media_url ? (
          isVideo ? (
            <video
              src={ad.media_url}
              controls
              muted
              className="w-full max-h-[300px] rounded-lg object-contain border border-yellow-200 shadow"
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <img
              src={ad.media_url}
              alt="Ad"
              className="w-full max-h-[300px] rounded-lg object-contain border border-yellow-200 shadow"
              onContextMenu={(e) => e.preventDefault()}
            />
          )
        ) : (
          <div className="w-full h-[200px] bg-yellow-100 rounded-lg flex justify-center items-center">
            <Megaphone size={48} className="text-yellow-500" />
          </div>
        )}
      </div>

      {/* 📝 Title */}
      <div className="px-4 text-center text-sm text-yellow-900 font-semibold pb-2">
        {ad.title}
      </div>

      {/* 🔘 Button */}
      <div className="flex justify-center pb-2">
        <span className="inline-block text-xs font-semibold bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300">
          {ad.button_text || "Learn More"}
        </span>
      </div>
    </motion.a>
  );
};

export default AdCard;
