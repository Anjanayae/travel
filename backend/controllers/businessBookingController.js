import Booking from "../models/bookingModel.js";
import Tour from "../models/Tour.js";

export const getBusinessBookings = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { businessId: req.business._id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('tourId', 'title photo city price')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
      total: bookings.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingStats = async (req, res) => {
  try {
    const businessId = req.business._id;

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      rejectedBookings,
      totalRevenue
    ] = await Promise.all([
      Booking.countDocuments({ businessId }),
      Booking.countDocuments({ businessId, status: 'pending' }),
      Booking.countDocuments({ businessId, status: 'confirmed' }),
      Booking.countDocuments({ businessId, status: 'rejected' }),
      Booking.aggregate([
        { $match: { businessId: req.business._id, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const totalTours = await Tour.countDocuments({ businessId });

    res.status(200).json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      rejectedBookings,
      totalTours,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      _id: id,
      businessId: req.business._id
    }).populate('tourId userId');

    if (!booking) {
      return res.status(404).json({ error: "Booking not found or access denied" });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: "Only pending bookings can be confirmed" });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      message: "Booking confirmed successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: id,
      businessId: req.business._id
    }).populate('tourId userId');

    if (!booking) {
      return res.status(404).json({ error: "Booking not found or access denied" });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: "Only pending bookings can be rejected" });
    }

    booking.status = 'rejected';
    booking.rejectionReason = reason || 'No reason provided';
    await booking.save();

    res.status(200).json({
      message: "Booking rejected successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      businessId: req.business._id
    })
      .populate('tourId', 'title photo city price duration maxGroupSize')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ error: "Booking not found or access denied" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};