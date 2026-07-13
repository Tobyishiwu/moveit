import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createOrder, estimateFare } from "../api/orders.js";

const BookDelivery = () => {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    packageDescription: "",
    packageSize: "small",
    weightKg: "",
    paymentMethod: "cash",
  });
  const [estimate, setEstimate] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Debounced live fare estimate whenever pickup, dropoff, or weight change
  useEffect(() => {
    const { pickupAddress, dropoffAddress, weightKg } = formData;
    if (!pickupAddress || !dropoffAddress || !weightKg) {
      setEstimate(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setEstimating(true);
      setEstimateError("");
      try {
        const data = await estimateFare({ pickupAddress, dropoffAddress, weightKg });
        setEstimate(data);
      } catch (err) {
        setEstimateError(err.response?.data?.message || "Could not estimate fare");
        setEstimate(null);
      } finally {
        setEstimating(false);
      }
    }, 900);

    return () => clearTimeout(timeout);
  }, [formData.pickupAddress, formData.dropoffAddress, formData.weightKg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const order = await createOrder(formData);
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold mb-1">Book a delivery</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Send a package anywhere, fast and reliable.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Pickup address
            </label>
            <input
              name="pickupAddress"
              placeholder="e.g. 12 Aba Road, Port Harcourt"
              value={formData.pickupAddress}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Dropoff address
            </label>
            <input
              name="dropoffAddress"
              placeholder="e.g. 45 Olu Obasanjo Road, Port Harcourt"
              value={formData.dropoffAddress}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Package description
            </label>
            <input
              name="packageDescription"
              placeholder="e.g. Documents, electronics, food"
              value={formData.packageDescription}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weightKg"
                min="0.1"
                step="0.1"
                placeholder="e.g. 2.5"
                value={formData.weightKg}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Package size
              </label>
              <select
                name="packageSize"
                value={formData.packageSize}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent) capitalize"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">
              Payment method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-3">
            {estimating && (
              <p className="text-sm text-gray-400">Calculating fare...</p>
            )}
            {estimateError && !estimating && (
              <p className="text-sm text-red-500">{estimateError}</p>
            )}
            {estimate && !estimating && !estimateError && (
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Estimated fare</span>
                  <p className="text-xs text-gray-400">{estimate.distanceKm} km</p>
                </div>
                <span className="text-lg font-bold">₦{estimate.fare}</span>
              </div>
            )}
            {!estimate && !estimating && !estimateError && (
              <p className="text-sm text-gray-400">
                Enter both addresses and weight to see your fare
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !estimate}
            className="w-full bg-(--color-accent) text-white font-medium rounded-lg py-2.5 text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book delivery"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookDelivery;
