import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    default: 1
  },
  bookingDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);