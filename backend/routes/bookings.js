import express from "express";
import { protect } from "../middleware/auth.js";
import Booking from "../models/bookingModel.js";
import Tour from "../models/Tour.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { tourId, numberOfPeople, bookingDate, specialRequests } = req.body;
    const userId = req.user._id;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    if (!tour.isActive || !tour.available) {
      return res.status(400).json({ error: "This tour is not available for booking" });
    }

    const totalAmount = tour.price * numberOfPeople;

    const newBooking = new Booking({
      userId,
      tourId,
      businessId: tour.businessId,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || 'Not provided',
      numberOfPeople,
      bookingDate,
      totalAmount,
      specialRequests,
      status: 'pending'
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking request submitted successfully! Please wait for confirmation from the tour operator.",
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('tourId', 'title photo city price duration category')
      .populate('businessId', 'businessName phone email')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('tourId')
      .populate('businessId', 'businessName phone email');

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ error: "This booking cannot be cancelled" });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;