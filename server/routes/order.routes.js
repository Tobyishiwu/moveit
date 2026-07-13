import express from "express";
import {
  createOrder,
  estimateFare,
  getMyOrders,
  getPendingOrders,
  getMyRiderOrders,
  getOrderById,
  acceptOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createOrder);
router.post("/estimate", protect, authorize("customer"), estimateFare);
router.get("/my-orders", protect, authorize("customer"), getMyOrders);
router.get("/pending", protect, authorize("rider"), getPendingOrders);
router.get("/rider/my-deliveries", protect, authorize("rider"), getMyRiderOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/accept", protect, authorize("rider"), acceptOrder);
router.put("/:id/status", protect, authorize("rider"), updateOrderStatus);

export default router;
