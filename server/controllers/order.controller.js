import Order from "../models/Order.model.js";
import { calculateFare } from "../utils/fareCalculator.js";
import { geocodeAddress } from "../utils/geocode.js";
import { calculateDistanceKm } from "../utils/distance.js";

// @desc Customer creates a new delivery order
export const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      dropoffAddress,
      packageDescription,
      packageSize,
      weightKg,
      paymentMethod,
    } = req.body;

    const pickupCoords = await geocodeAddress(pickupAddress);
    const dropoffCoords = await geocodeAddress(dropoffAddress);

    const distanceKm = calculateDistanceKm(
      pickupCoords.lat,
      pickupCoords.lng,
      dropoffCoords.lat,
      dropoffCoords.lng
    );
    const fare = calculateFare(distanceKm, weightKg);

    const order = await Order.create({
      customer: req.user._id,
      pickupAddress,
      pickupLocation: { type: "Point", coordinates: [pickupCoords.lng, pickupCoords.lat] },
      dropoffAddress,
      dropoffLocation: { type: "Point", coordinates: [dropoffCoords.lng, dropoffCoords.lat] },
      packageDescription,
      packageSize,
      weightKg,
      fare,
      distanceKm: Math.round(distanceKm * 10) / 10,
      paymentMethod,
      statusHistory: [{ status: "pending" }],
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Preview fare before booking (no order created)
export const estimateFare = async (req, res) => {
  try {
    const { pickupAddress, dropoffAddress, weightKg } = req.body;

    const pickupCoords = await geocodeAddress(pickupAddress);
    const dropoffCoords = await geocodeAddress(dropoffAddress);

    const distanceKm = calculateDistanceKm(
      pickupCoords.lat,
      pickupCoords.lng,
      dropoffCoords.lat,
      dropoffCoords.lng
    );
    const fare = calculateFare(distanceKm, weightKg);

    res.json({ distanceKm: Math.round(distanceKm * 10) / 10, fare });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Customer views their own orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("rider", "name phone rating vehicleType");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Rider views all pending (unassigned) orders
export const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("customer", "name phone");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Rider views their accepted/active/past orders
export const getMyRiderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ rider: req.user._id })
      .sort({ createdAt: -1 })
      .populate("customer", "name phone");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single order by ID (customer, assigned rider, or admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name phone")
      .populate("rider", "name phone rating vehicleType");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.customer._id.toString() === req.user._id.toString();
    const isRider = order.rider && order.rider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isRider && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Rider accepts a pending order
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order already accepted by another rider" });
    }

    order.rider = req.user._id;
    order.status = "accepted";
    order.statusHistory.push({ status: "accepted" });
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Rider updates order status through the delivery lifecycle
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validTransitions = ["picked_up", "in_transit", "delivered", "cancelled"];

    if (!validTransitions.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.rider || order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.status = status;
    order.statusHistory.push({ status });
    if (status === "delivered") order.paymentStatus = "paid";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
