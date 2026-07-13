import User from "../models/User.model.js";
import Order from "../models/Order.model.js";

// @desc Get dashboard stats
export const getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      status: { $in: ["pending", "accepted", "picked_up", "in_transit"] },
    });
    const totalRiders = await User.countDocuments({ role: "rider" });
    const verifiedRiders = await User.countDocuments({ role: "rider", isVerified: true });
    const totalCustomers = await User.countDocuments({ role: "customer" });

    const deliveredOrders = await Order.find({ status: "delivered" });
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.fare, 0);

    res.json({
      totalOrders,
      activeOrders,
      totalRiders,
      verifiedRiders,
      totalCustomers,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all orders (with optional status filter)
export const getAllOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("customer", "name phone")
      .populate("rider", "name phone");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all riders
export const getAllRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: "rider" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify or unverify a rider
export const toggleRiderVerification = async (req, res) => {
  try {
    const rider = await User.findById(req.params.id);
    if (!rider || rider.role !== "rider") {
      return res.status(404).json({ message: "Rider not found" });
    }
    rider.isVerified = !rider.isVerified;
    await rider.save();
    res.json(rider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
