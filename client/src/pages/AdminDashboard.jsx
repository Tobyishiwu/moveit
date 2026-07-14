import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStats, getAllOrders, getAllRiders, toggleRiderVerification } from "../api/admin.js";

const STATUS_OPTIONS = ["all", "pending", "accepted", "picked_up", "in_transit", "delivered", "cancelled"];

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-gray-100/50">
    <span className="text-2xl filter drop-shadow-sm">{icon}</span>
    <p className="font-mono text-2xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
  </div>
);

const statusBadgeClass = (status) =>
  status === "cancelled"
    ? "bg-red-50 text-red-600 border border-red-100"
    : status === "delivered"
    ? "bg-green-50 text-green-600 border border-green-100"
    : "bg-orange-50 text-accent border border-orange-100";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab] = useState("orders");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => setStats(await getStats());
  const fetchOrders = async () =>
    setOrders(await getAllOrders(statusFilter === "all" ? null : statusFilter));
  const fetchRiders = async () => setRiders(await getAllRiders());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchOrders(), fetchRiders()]);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleVerifyToggle = async (id) => {
    await toggleRiderVerification(id);
    fetchRiders();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3 text-gray-400 text-sm font-medium">
        <svg className="animate-spin h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-6 sm:py-10 antialiased text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title Grid */}
        <div className="flex flex-wrap justify-between items-end gap-2">
          <div>
            <p className="text-xs text-accent font-bold tracking-widest uppercase">Overview</p>
            <h1 className="font-display text-3xl font-black text-gray-900 mt-1 tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <span className="text-xs bg-gray-200/60 font-semibold px-3 py-1.5 rounded-lg text-gray-500 select-none">
            Live Updates
          </span>
        </div>

        {/* Stats Grid Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon="📦" label="Total orders" value={stats?.totalOrders || 0} />
          <StatCard icon="⚡" label="Active orders" value={stats?.activeOrders || 0} />
          <StatCard icon="🏍️" label="Total riders" value={stats?.totalRiders || 0} />
          <StatCard icon="✅" label="Verified riders" value={stats?.verifiedRiders || 0} />
          <StatCard icon="👤" label="Customers" value={stats?.totalCustomers || 0} />
          <StatCard icon="💰" label="Revenue" value={`₦${stats?.totalRevenue || 0}`} />
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex gap-2 border-b border-gray-200 pt-2">
          {["orders", "riders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-5 py-3 text-sm font-bold capitalize border-b-2 transition select-none " +
                (tab === t ? "border-accent text-accent" : "border-transparent text-gray-400 hover:text-gray-600")
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Orders Layout Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap items-center">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={
                    "text-xs font-bold px-3.5 py-2 rounded-full capitalize transition select-none " +
                    (statusFilter === s
                      ? "bg-accent text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50")
                  }
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>

            {orders.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm font-medium text-gray-400">
                No active orders match this status filter
              </div>
            )}

            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3 hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between items-start text-sm gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">📍 {order.pickupAddress}</p>
                    <p className="text-gray-400 font-medium text-xs mt-0.5 pl-5">to {order.dropoffAddress}</p>
                  </div>
                  <span className={"text-xs font-bold px-3 py-1 rounded-full capitalize whitespace-nowrap shrink-0 " + statusBadgeClass(order.status)}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-y-1 justify-between text-xs font-medium text-gray-400 pt-3 border-t border-gray-100/60">
                  <span>Customer: <strong className="text-gray-600">{order.customer?.name || "—"}</strong></span>
                  <span>Rider: <strong className="text-gray-600">{order.rider?.name || "Unassigned"}</strong></span>
                </div>

                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-gray-400 text-xs font-medium">
                    {order.weightKg ? `${order.weightKg}kg` : "—"} &middot; {order.distanceKm ? `${order.distanceKm}km` : "—"}
                  </span>
                  <span className="font-display font-black text-base text-gray-900">₦{order.fare}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Riders Layout Tab */}
        {tab === "riders" && (
          <div className="space-y-3">
            {riders.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm font-medium text-gray-400">
                No dispatch riders registered on the system yet
              </div>
            )}
            {riders.map((rider) => (
              <div key={rider._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm">
                  {rider.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{rider.name}</p>
                  <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{rider.phone} &middot; {rider.email}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    🏍️ {rider.vehicleType || "No vehicle set"} &middot; ⭐ {rider.rating || "5.0"}
                  </p>
                </div>
                <button
                  onClick={() => handleVerifyToggle(rider._id)}
                  className={
                    "text-xs font-bold px-4 py-2 rounded-xl transition shrink-0 border select-none " +
                    (rider.isVerified 
                      ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100/50" 
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100")
                  }
                >
                  {rider.isVerified ? "Verified ✓" : "Verify Rider"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

