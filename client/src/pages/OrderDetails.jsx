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
    <div className="flex items-center overflow-x-auto">
      {STATUS_FLOW.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none min-w-0">
            <div className="flex flex-col items-center shrink-0">
              <div
                className={
                  "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition " +
                  (isCurrent ? "bg-(--color-accent) text-white" : "bg-gray-100 text-gray-400")
                }
              >
                {isDone ? "OK" : i + 1}
              </div>
              <p
                className={
                  "text-[9px] sm:text-[10px] mt-1.5 text-center w-12 sm:w-16 leading-tight " +
                  (isCurrent ? "text-gray-700 font-medium" : "text-gray-400")
                }
              >
                {STATUS_STEP_LABELS[step]}
              </p>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                className={
                  "h-0.5 flex-1 -mt-4 min-w-3 transition " +
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
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm px-4">
        Loading order...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-sm px-4 text-center">
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
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-6 sm:py-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-3 sm:space-y-4"
      >
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
          Back to dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex justify-between items-start mb-5 gap-2">
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Order</p>
              <p className="text-[11px] sm:text-xs font-(family-name:--font-mono) text-gray-500 truncate">
                {order._id}
              </p>
            </div>
            <span className={"text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shrink-0 " + statusBadgeClass}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <StatusTimeline status={order.status} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-(--color-teal)" />
              <span className="w-0.5 flex-1 bg-gray-200 my-1" />
              <span className="w-2.5 h-2.5 rounded-full bg-(--color-accent)" />
            </div>
            <div className="flex-1 space-y-4 text-sm min-w-0">
              <div>
                <p className="text-xs text-gray-400">Pickup</p>
                <p className="font-medium break-words">{order.pickupAddress}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Dropoff</p>
                <p className="font-medium break-words">{order.dropoffAddress}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-gray-100 text-center">
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
            <span className="font-(family-name:--font-display) font-bold text-xl sm:text-2xl">
              {"\u20A6"}{order.fare}
            </span>
          </div>
        </div>

        {order.rider && (
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {order.rider.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{order.rider.name}</p>
              <p className="text-xs text-gray-400">{order.rider.phone}</p>
            </div>
            
            <a
              href={riderPhoneLink}
              className="text-xs font-medium bg-orange-50 text-(--color-accent) px-3 py-1.5 rounded-full shrink-0"
            >
              Call
            </a>
          </div>
        )}

        {showMap && (
          <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4">
            <p className="text-xs text-gray-400 mb-2 px-1">Live tracking</p>
            <LiveTrackingMap orderId={order._id} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrderDetails;

