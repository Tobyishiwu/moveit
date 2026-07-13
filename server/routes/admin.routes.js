import express from "express";
import {
  getStats,
  getAllOrders,
  getAllRiders,
  toggleRiderVerification,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.get("/riders", getAllRiders);
router.put("/riders/:id/verify", toggleRiderVerification);

export default router;
