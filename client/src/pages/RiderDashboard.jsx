import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getPendingOrders,
  getMyRiderOrders,
  acceptOrder,
  updateOrderStatus,
} from "../api/orders.js";
import RiderLocationBroadcaster from "../components/RiderLocationBroadcaster.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NEXT_STATUS = {
  accepted: "picked_up",
  picked_up: "in_transit",
  in_transit: "delivered",
};

const STATUS_ACTION_LABEL = {
  accepted: "Mark picked up",
  picked_up: "Mark in transit",
  in_transit: "Mark delivered",
};

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const OrderCard = ({ order, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
  >
    <div className="flex justify-between items-start">
      <div className="text-sm">
        <p className="font-medium">{order.pickupAddress}</p>
        <p className="text-gray-400">to {order.dropoffAddress}</p>
      </div>
      <span className="bg-orange-50 text-(--color-accent) text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
        {STATUS_LABELS[order.status]}
      </span>
    </div>
    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
      <span className="text-gray-500">
        {order.packageDescription} &middot; {order.weightKg}kg &middot; {order.distanceKm}km
      </span>
      <span className="font-(family-name:--font-display) font-bold">{"\u20A6"}{order.fare}</span>
    </div>
    {children}
  </motion.div>
);

const RiderDashboard = () => {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const [pendingData, myData] = await Promise.all([
        getPendingOrders(),
        getMyRiderOrders(),
      ]);
      setPending(pendingData);
      setMyDeliveries(myData);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders");
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id) => {
    setActionLoadingId(id);
    try {
      await acceptOrder(id);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not accept order");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdvanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setActionLoadingId(order._id);
    try {
      await updateOrderStatus(order._id, next);
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const activeDelivery = myDeliveries.find((o) =>
    ["accepted", "picked_up", "in_transit"].includes(o.status)
  );
  const deliveredToday = myDeliveries.filter((o) => o.status === "delivered").length;
  const earningsToday = myDeliveries
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
            {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage available and active deliveries</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="font-(family-name:--font-mono) text-xl font-semibold">{pending.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Available now</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="font-(family-name:--font-mono) text-xl font-semibold">{deliveredToday}</p>
            <p className="text-xs text-gray-400 mt-0.5">Delivered</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <p className="font-(family-name:--font-mono) text-xl font-semibold">{"\u20A6"}{earningsToday}</p>
            <p className="text-xs text-gray-400 mt-0.5">Earned</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {activeDelivery && (
          <RiderLocationBroadcaster orderId={activeDelivery._id} />
        )}

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500">My deliveries</h2>
          {myDeliveries.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <span className="text-3xl">🏍️</span>
              <p className="font-(family-name:--font-display) font-bold mt-3">No deliveries yet</p>
              <p className="text-gray-400 text-sm mt-1">Accept an order below to get started.</p>
            </div>
          )}
          <AnimatePresence>
            {myDeliveries.map((order) => (
              <OrderCard key={order._id} order={order}>
                {NEXT_STATUS[order.status] && (
                  <button
                    onClick={() => handleAdvanceStatus(order)}
                    disabled={actionLoadingId === order._id}
                    className="w-full bg-(--color-primary) text-white text-sm font-medium rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
                  >
                    {actionLoadingId === order._id ? "Updating..." : STATUS_ACTION_LABEL[order.status]}
                  </button>
                )}
              </OrderCard>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500">Available orders</h2>
          {pending.length === 0 && (
            <div className="bg-white rounded-xl p-4 text-sm text-gray-400 text-center">
              No pending orders right now
            </div>
          )}
          <AnimatePresence>
            {pending.map((order) => (
              <OrderCard key={order._id} order={order}>
                <button
                  onClick={() => handleAccept(order._id)}
                  disabled={actionLoadingId === order._id || !!activeDelivery}
                  className="w-full bg-(--color-accent) text-white text-sm font-medium rounded-lg py-2.5 hover:opacity-90 transition disabled:opacity-50"
                >
                  {activeDelivery
                    ? "Finish current delivery first"
                    : actionLoadingId === order._id
                    ? "Accepting..."
                    : "Accept delivery"}
                </button>
              </OrderCard>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
