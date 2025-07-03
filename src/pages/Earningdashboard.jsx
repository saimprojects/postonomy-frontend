import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import WithdrawalHistory from "../components/WithdrawalHistory";
import WithdrawForm from "./WithdrawForm";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const COLORS = ["#6366F1", "#EF4444", "#10B981", "#F59E0B"];

const EarningDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [earnings, setEarnings] = useState({
    total_earnings: 0,
    paid: 0,
    available: 0,
  });
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, withdrawalRes, earningRes, monetizationRes] =
          await Promise.all([
            API.get("/postsapi/myposts/"),
            API.get("/postsapi/my-withdrawals/"),
            API.get("/postsapi/earnings-summary/"),
            API.get("/monetization/status/"),
          ]);

        setPosts(postRes.data);
        setWithdrawals(withdrawalRes.data);
        setEarnings(earningRes.data);

        const { status } = monetizationRes.data;
        if (status === "approved") {
          setIsAuthorized(true);
        } else {
          alert("🚫 You are not authorized to access the Earnings Dashboard.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        alert("Failed to load earnings dashboard. Please try again.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filterPosts = (range) => setFilter(range);

  const filteredPosts = posts.filter((post) => {
    const postDate = new Date(post.created_at);
    const now = new Date();
    if (filter === "weekly")
      return postDate >= new Date(now.setDate(now.getDate() - 7));
    if (filter === "monthly")
      return postDate >= new Date(now.setMonth(now.getMonth() - 1));
    if (filter === "yearly")
      return postDate >= new Date(now.setFullYear(now.getFullYear() - 1));
    return true;
  });

  const totalViews = filteredPosts.reduce((sum, p) => sum + (p.impressions || 0), 0);
  const totalLikes = filteredPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalDislikes = filteredPosts.reduce((sum, p) => sum + (p.dislikes || 0), 0);
  const totalComments = filteredPosts.reduce((sum, p) => sum + (p.comments_count || 0), 0);

  const pieData = [
    { name: "Impressions", value: totalViews },
    { name: "Likes", value: totalLikes },
    { name: "Comments", value: totalComments },
    { name: "Earnings", value: earnings.available },
  ];

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-red-600">
        🚫 Access Denied: You are not a monetized user.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8 animate-pulse">
        📈 Ultra Earnings Dashboard
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["all", "weekly", "monthly", "yearly"].map((range) => (
          <button
            key={range}
            onClick={() => filterPosts(range)}
            className={`px-4 py-1.5 rounded-full border text-sm transition-all duration-300 font-medium ${
              filter === range
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-700 border-purple-600"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard label="Total Earnings" value={`$${earnings.total_earnings.toFixed(2)}`} color="text-yellow-600" />
            <SummaryCard label="Paid Out" value={`$${earnings.paid.toFixed(2)}`} color="text-red-500" />
            <SummaryCard label="Available" value={`$${earnings.available.toFixed(2)}`} color="text-green-600" />
            <SummaryCard label="Impressions" value={totalViews} color="text-blue-600" />
            <SummaryCard label="Likes" value={totalLikes} color="text-pink-500" />
            <SummaryCard label="Dislikes" value={totalDislikes} color="text-rose-500" />
            <SummaryCard label="Comments" value={totalComments} color="text-indigo-500" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <ChartBox title="📊 Overview (Pie)">
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  isAnimationActive={true}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartBox>

            <ChartBox title="📈 Impressions & Likes (Line)">
              <LineChart data={filteredPosts} width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="impressions" stroke="#6366F1" />
                <Line type="monotone" dataKey="likes" stroke="#EF4444" />
                <Line type="monotone" dataKey="dislikes" stroke="#F97316" />
              </LineChart>
            </ChartBox>

            <ChartBox title="📉 Comments & Earnings (Bar)">
              <BarChart data={filteredPosts} width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="comments_count" fill="#9333EA" />
                <Bar dataKey="estimated_earning" fill="#10B981" />
              </BarChart>
            </ChartBox>

            <ChartBox title="📐 Quality Metrics (Radar)">
              <RadarChart outerRadius={90} width={500} height={300} data={pieData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.6} />
              </RadarChart>
            </ChartBox>

            <ChartBox title="📊 Engagement Over Time (Area)">
              <AreaChart data={filteredPosts} width={500} height={300}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDislikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="id" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="likes" stroke="#ec4899" fillOpacity={1} fill="url(#colorLikes)" />
                <Area type="monotone" dataKey="comments_count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorComments)" />
                <Area type="monotone" dataKey="impressions" stroke="#6366F1" fillOpacity={1} fill="url(#colorImpressions)" />
                <Area type="monotone" dataKey="dislikes" stroke="#f97316" fillOpacity={1} fill="url(#colorDislikes)" />
              </AreaChart>
            </ChartBox>

            <ChartBox title="💰 Earnings Breakdown (Bar)">
              <BarChart width={500} height={300} data={[
                { name: "Impressions", value: earnings.earnings_from_impressions || 0 },
                { name: "Likes", value: earnings.earnings_from_likes || 0 },
                { name: "Comments", value: earnings.earnings_from_comments || 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ChartBox>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">💸 Withdrawal</h2>
            <h6 className="text-xl mb-4 text-green-500 font-semibold">
              You can withdraw your available balance (min $25 required)
            </h6>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
              <div className="bg-gray-50 p-3 rounded shadow text-center">
                <p className="text-gray-600 font-medium">💸 From Impressions</p>
                <p className="text-purple-700 font-bold">
                  ${earnings.earnings_from_impressions?.toFixed(4) || "0.0000"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded shadow text-center">
                <p className="text-gray-600 font-medium">👍 From Likes</p>
                <p className="text-purple-700 font-bold">
                  ${earnings.earnings_from_likes?.toFixed(4) || "0.0000"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded shadow text-center">
                <p className="text-gray-600 font-medium">💬 From Comments</p>
                <p className="text-purple-700 font-bold">
                  ${earnings.earnings_from_comments?.toFixed(4) || "0.0000"}
                </p>
              </div>
            </div>

            <WithdrawForm
              availableEarnings={earnings.available.toFixed(2)}
              totalEarnings={earnings.total_earnings.toFixed(2)}
              totalPaid={earnings.paid.toFixed(2)}
            />

            <div className="mt-6">
              <WithdrawalHistory />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white rounded-xl shadow-md p-4 text-center"
  >
    <p className="text-gray-500 text-sm">{label}</p>
    <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
  </motion.div>
);

const ChartBox = ({ title, children }) => (
  <motion.div
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 30 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-lg p-4 shadow-md"
  >
    <h3 className="text-lg font-semibold mb-4 text-purple-700">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </motion.div>
);

export default EarningDashboard;
