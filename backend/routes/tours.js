import express from "express";
import Tour from "../models/Tour.js"; // Make sure this exists and is exported properly

const router = express.Router();

// @desc   Get all tours
// @route  GET /api/tours
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error.message);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
});

// @desc   Get single tour by ID
// @route  GET /api/tours/:id
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error.message);
    res.status(500).json({ error: "Failed to fetch tour" });
  }
});

export default router;
