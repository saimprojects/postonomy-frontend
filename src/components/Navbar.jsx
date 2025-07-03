import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LogIn,
  LogOut,
  Home,
  PlusCircle,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
  Bell,
  HelpCircle, // ✅ NEW
} from "lucide-react";
import logo from "../assets/logo.png";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("access");
  const [mobileMenu, setMobileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="bg-[#0D1117] fixed top-0 left-0 w-full z-50 border-b border-[#161B22] shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Postonomy Logo" className="h-8 w-auto" />
        </Link>

        {/* ✅ Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm text-white">
          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className={`font-semibold transition-all relative group ${
                  isActive("/") ? "text-cyan-400" : "text-white hover:text-cyan-400"
                }`}
              >
                <Home className="inline mr-1" size={16} />
                Feed
                <span className="block h-[2px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>

              <Link
                to="/dashboard"
                className={`font-semibold transition-all relative group ${
                  isActive("/dashboard")
                    ? "text-yellow-400"
                    : "text-white hover:text-yellow-400"
                }`}
              >
                <LayoutDashboard className="inline mr-1" size={16} />
                Dashboard
                <span className="block h-[2px] bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>

              <Link
                to="/create-post"
                className={`font-semibold transition-all relative group ${
                  isActive("/create-post")
                    ? "text-green-400"
                    : "text-white hover:text-green-400"
                }`}
              >
                <PlusCircle className="inline mr-1" size={16} />
                Create Post
                <span className="block h-[2px] bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>

              <Link
                to="/help"
                className={`font-semibold transition-all relative group ${
                  isActive("/help")
                    ? "text-purple-400"
                    : "text-white hover:text-purple-400"
                }`}
              >
                <HelpCircle className="inline mr-1" size={16} />
                Help Center
                <span className="block h-[2px] bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>

              <button
                onClick={logout}
                className="text-red-400 hover:text-red-600 transition font-semibold flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>

              {/* 🔔 Notifications */}
              <NotificationBell />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`font-semibold flex items-center gap-1 transition ${
                  isActive("/login") ? "text-cyan-400" : "hover:text-cyan-400"
                }`}
              >
                <LogIn size={16} /> Login
              </Link>

              <Link
                to="/register"
                className={`font-semibold flex items-center gap-1 transition ${
                  isActive("/register") ? "text-cyan-400" : "hover:text-cyan-400"
                }`}
              >
                <UserPlus size={16} /> Register
              </Link>
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-3 text-white">
          {isLoggedIn && <NotificationBell />}
          <button onClick={toggleMobileMenu} className="text-2xl">
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown */}
      {mobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm bg-[#0D1117] text-white border-t border-[#161B22] animate-fade-in-down"
        >
          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className={`transition ${
                  isActive("/") ? "text-cyan-400" : "hover:text-cyan-400"
                }`}
                onClick={toggleMobileMenu}
              >
                <Home className="inline mr-1" size={16} /> Feed
              </Link>

              <Link
                to="/dashboard"
                className={`transition ${
                  isActive("/dashboard") ? "text-yellow-400" : "hover:text-yellow-400"
                }`}
                onClick={toggleMobileMenu}
              >
                <LayoutDashboard className="inline mr-1" size={16} /> Dashboard
              </Link>

              <Link
                to="/create-post"
                className={`transition ${
                  isActive("/create-post") ? "text-green-400" : "hover:text-green-400"
                }`}
                onClick={toggleMobileMenu}
              >
                <PlusCircle className="inline mr-1" size={16} /> Create Post
              </Link>

              <Link
                to="/help"
                className={`transition ${
                  isActive("/help") ? "text-purple-400" : "hover:text-purple-400"
                }`}
                onClick={toggleMobileMenu}
              >
                <HelpCircle className="inline mr-1" size={16} /> Help Center
              </Link>

              <button
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="text-left text-red-400 hover:text-red-600 transition"
              >
                <LogOut className="inline mr-1" size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`transition ${
                  isActive("/login") ? "text-cyan-400" : "hover:text-cyan-400"
                }`}
                onClick={toggleMobileMenu}
              >
                <LogIn className="inline mr-1" size={16} /> Login
              </Link>

              <Link
                to="/register"
                className={`transition ${
                  isActive("/register") ? "text-cyan-400" : "hover:text-cyan-400"
                }`}
                onClick={toggleMobileMenu}
              >
                <UserPlus className="inline mr-1" size={16} /> Register
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
