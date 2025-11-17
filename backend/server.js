import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import tourRoutes from "./routes/tours.js";
import bookingRoutes from "./routes/bookings.js";

import businessAuthRoutes from "./routes/businessAuth.js";
import businessTourRoutes from "./routes/businessTours.js";
import businessBookingRoutes from "./routes/businessBookings.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/business/auth", businessAuthRoutes);
app.use("/api/business/tours", businessTourRoutes);
app.use("/api/business/bookings", businessBookingRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error(err));