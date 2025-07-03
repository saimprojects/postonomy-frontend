import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPopup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-5 right-5 bg-white shadow-xl rounded-2xl px-5 py-4 border z-50 w-64"
    >
      <p className="text-sm text-gray-700 font-semibold mb-3">
        LOGIN YOUR ACCOUNT TO SEE POSTS 
      </p>
      <Link
        to="/login"
        className="block text-center bg-purple-600 hover:bg-purple-700 transition text-white font-medium py-2 rounded-lg text-sm"
      >
        Login / Sign Up
      </Link>
    </motion.div>
  );
};

export default LoginPopup;
