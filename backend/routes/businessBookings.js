import express from "express";
import {
  getBusinessBookings,
  getBookingStats,
  confirmBooking,
  rejectBooking,
  getBookingById
} from "../controllers/businessBookingController.js";
import { protectBusiness } from "../middleware/businessAuth.js";

const router = express.Router();

router.use(protectBusiness);

router.get("/stats", getBookingStats);
router.get("/", getBusinessBookings);
router.get("/:id", getBookingById);
router.patch("/:id/confirm", confirmBooking);
router.patch("/:id/reject", rejectBooking);

export default router;