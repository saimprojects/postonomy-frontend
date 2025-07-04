import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import ProfileUpdate from "./pages/ProfileUpdate";
import ResetPassword from "./pages/resetPassword";
import Profile from "./pages/profile";
import CreatePost from "./pages/createPost";
import Feed from "./pages/feed";
import PostDetail from "./pages/PostDetail";
import EarningDashboard from "./pages/Earningdashboard";
import WithdrawForm from "./pages/WithdrawForm";
import PublicProfile from "./pages/PublicProfile";
import MonetizationForm from "./pages/monitizationForm";
import PostReport from "./pages/PostReport";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/terms";
import AdvertiseForm from "./pages/AdvertiseForm";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <Navbar />

      {/* Push content down so navbar doesn't overlap */}
      <div className="pt-20 min-h-screen bg-[#0D1117]">
        
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/earningdashboard" element={<EarningDashboard />} />
          <Route path="/withdraw" element={<WithdrawForm />} />
          <Route path="/profile/:public_id" element={<PublicProfile />} />
          <Route path="/monetization-form" element={<MonetizationForm />} />
          <Route path="/report/:id" element={<PostReport />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/advertise" element={<AdvertiseForm />} />




        



          <Route
            path="/create-post"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/update"
            element={
              <PrivateRoute>
                <ProfileUpdate />
              </PrivateRoute>
            }
          />
        </Routes>
      
      </div>

      {/* Global Toastify Container */}
      <ToastContainer />
    </>
  );
}

export default App;
