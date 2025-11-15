import express from "express";
import { 
  getTours, 
  getTourById, 
  createTour, 
  addReview, 
  getCategories, 
  getCities 
} from "../controllers/tourController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc   Get all tours with filtering
// @route  GET /api/tours
router.get("/", getTours);

// @desc   Get tour categories
// @route  GET /api/tours/categories
router.get("/categories", getCategories);

// @desc   Get tour cities
// @route  GET /api/tours/cities
router.get("/cities", getCities);

// @desc   Get single tour by ID
// @route  GET /api/tours/:id
router.get("/:id", getTourById);

// @desc   Create a new tour (protected route)
// @route  POST /api/tours
router.post("/", protect, createTour);

// @desc   Add review to tour (protected route)
// @route  POST /api/tours/:tourId/reviews
router.post("/:tourId/reviews", protect, addReview);

export default router;