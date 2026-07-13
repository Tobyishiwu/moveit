import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { getMyOrders } from "../api/orders.js";

const STATUS_LABELS = {
  pending: "Looking for a rider",
  accepted: "Rider assigned",
  picked_up: "Package picked up",
  in_transit: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const activeOrder = orders.find((o) =>
    ["pending", "accepted", "picked_up", "in_transit"].includes(o.status)
  );
  const pastOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const totalSpent = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.fare, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-xs text-(--color-accent) font-semibold tracking-wide">
            {getGreeting().toUpperCase()}
          </p>
          <h1 className="font-(family-name:--font-display) text-3xl font-bold mt-1">
            Hi, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Where's your next package going?</p>
        </div>

        <Link to="/book" className="block">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="bg-(--color-accent) text-white rounded-2xl p-6 flex justify-between items-center cursor-pointer shadow-lg"
          >
            <div>
              <p className="font-(family-name:--font-display) text-lg font-bold">Book a delivery</p>
              <p className="text-sm opacity-90">Fast, reliable, on-demand</p>
            </div>
            <span className="text-2xl">→</span>
          </motion.div>
        </Link>

        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-(family-name:--font-mono) text-xl font-semibold">{orders.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total orders</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-(family-name:--font-mono) text-xl font-semibold">{deliveredCount}</p>
              <p className="text-xs text-gray-400 mt-0.5">Delivered</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="font-(family-name:--font-mono) text-xl font-semibold">{"\u20A6"}{totalSpent}</p>
              <p className="text-xs text-gray-400 mt-0.5">Total spent</p>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-sm text-gray-400 text-center">Loading your orders...</p>
        )}

        {activeOrder && (
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Active delivery</h2>
            <Link to={"/orders/" + activeOrder._id} className="block">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm p-4 space-y-3 cursor-pointer border border-orange-100"
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm">
                    <p className="font-medium">{activeOrder.pickupAddress}</p>
                    <p className="text-gray-400">to {activeOrder.dropoffAddress}</p>
                  </div>
                  <span className="bg-orange-50 text-(--color-accent) text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {STATUS_LABELS[activeOrder.status]}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                  <span className="text-gray-500">{activeOrder.packageDescription} &middot; {activeOrder.distanceKm} km</span>
                  <span className="font-(family-name:--font-display) font-bold">{"\u20A6"}{activeOrder.fare}</span>
                </div>
              </motion.div>
            </Link>
          </div>
        )}

        {!loading && pastOrders.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-2">Past deliveries</h2>
            <div className="space-y-2">
              {pastOrders.map((order) => (
                <Link key={order._id} to={"/orders/" + order._id} className="block">
                  <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
                    <div className="text-sm">
                      <p className="font-medium">{order.pickupAddress}</p>
                      <p className="text-gray-400">to {order.dropoffAddress}</p>
                    </div>
                    <div className="text-right">
                      <p className={"text-xs font-medium " + (order.status === "delivered" ? "text-green-600" : "text-red-500")}>
                        {STATUS_LABELS[order.status]}
                      </p>
                      <p className="text-sm font-(family-name:--font-mono) font-semibold">{"\u20A6"}{order.fare}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <span className="text-3xl">📦</span>
            <p className="font-(family-name:--font-display) font-bold mt-3">No deliveries yet</p>
            <p className="text-gray-400 text-sm mt-1">Book your first one above — it takes less than a minute.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
