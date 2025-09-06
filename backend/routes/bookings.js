import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Booking from '../models/bookingModel.js';
import { protect } from "../middleware/auth.js";



const router = express.Router();

// Get bookings for current user
router.get("/my", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("tour");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings failed:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("tour");

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", protect, async (req, res) => {
  const { tourId } = req.body;

  try {
    const booking = new Booking({
      user: req.user._id,
      tour: tourId,
      seats:1,
    });

    await booking.save();
    res.json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
