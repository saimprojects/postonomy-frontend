import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Comment = ({ comment }) => {
  const user = comment.user;

  return (
    <div className="bg-[#22262e] p-3 rounded-lg text-sm text-[#C9D1D9] border border-[#30363D] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-1">
        {user?.profile_image ? (
          <img
            src={user.profile_image}
            alt="Commenter"
            className="w-8 h-8 rounded-full object-cover border border-[#FFD700]"
          />
        ) : (
          <FaUserCircle className="w-8 h-8 text-[#FFD700]" />
        )}
        <p className="font-semibold text-[#FFD700]">{user?.username || "Anonymous"}</p>
      </div>
      <p className="ml-11 whitespace-pre-wrap">{comment.text}</p>
    </div>
  );
};

export default Comment;

