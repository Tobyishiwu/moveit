import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOrderById } from "../api/orders.js";
import LiveTrackingMap from "../components/LiveTrackingMap.jsx";

const STATUS_FLOW = ["pending", "accepted", "picked_up", "in_transit", "delivered"];

const STATUS_LABELS = {
  pending: "Looking for a rider",
  accepted: "Rider assigned",
  picked_up: "Package picked up",
  in_transit: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STEP_LABELS = {
  pending: "Requested",
  accepted: "Accepted",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
};

const StatusTimeline = ({ status }) => {
  if (status === "cancelled") {
    return (
      <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <div className="flex items-center">
      {STATUS_FLOW.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition " +
                  (isCurrent ? "bg-(--color-accent) text-white" : "bg-gray-100 text-gray-400")
                }
              >
                {isDone ? "OK" : i + 1}
              </div>
              <p
                className={
                  "text-[10px] mt-1.5 text-center w-16 " +
                  (isCurrent ? "text-gray-700 font-medium" : "text-gray-400")
                }
              >
                {STATUS_STEP_LABELS[step]}
              </p>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                className={
                  "h-0.5 flex-1 -mt-4 transition " +
                  (isDone ? "bg-(--color-accent)" : "bg-gray-100")
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Loading order...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-sm">
        {error}
      </div>
    );
  }

  const showMap = ["accepted", "picked_up", "in_transit"].includes(order.status);
  const statusBadgeClass =
    order.status === "cancelled"
      ? "bg-red-50 text-red-600"
      : order.status === "delivered"
      ? "bg-green-50 text-green-600"
      : "bg-orange-50 text-(--color-accent)";
  const riderPhoneLink = "tel:" + order.rider?.phone;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-4"
      >
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
          Back to dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-xs text-gray-400">Order</p>
              <p className="text-xs font-(family-name:--font-mono) text-gray-500">{order._id}</p>
            </div>
            <span className={"text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap " + statusBadgeClass}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <StatusTimeline status={order.status} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-(--color-teal)" />
              <span className="w-0.5 flex-1 bg-gray-200 my-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-(--color-accent)" />
            </div>
            <div className="flex-1 space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Pickup</p>
                <p className="font-medium">{order.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Dropoff</p>
                <p className="font-medium">{order.dropoffAddress}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-center">
            <div>
              <p className="text-xs text-gray-400">Package</p>
              <p className="text-sm font-medium capitalize">{order.packageSize}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Weight</p>
              <p className="text-sm font-medium">{order.weightKg} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Distance</p>
              <p className="text-sm font-medium">{order.distanceKm} km</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div>
              <span className="text-gray-500 text-sm">Fare</span>
              <p className="text-xs text-gray-400 capitalize">{order.paymentMethod}</p>
            </div>
            <span className="font-(family-name:--font-display) font-bold text-2xl">
              {"\u20A6"}{order.fare}
            </span>
          </div>
        </div>

        {order.rider && (
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-sm font-semibold">
              {order.rider.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{order.rider.name}</p>
              <p className="text-xs text-gray-400">{order.rider.phone}</p>
            </div>
            <a
              href={riderPhoneLink}
              className="text-xs font-medium bg-orange-50 text-(--color-accent) px-3 py-1.5 rounded-full"
            >
              Call
            </a>
          </div>
        )}

        {showMap && (
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <p className="text-xs text-gray-400 mb-2 px-1">Live tracking</p>
            <LiveTrackingMap orderId={order._id} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderDetails;


