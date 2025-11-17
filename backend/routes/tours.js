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

router.get("/", getTours);
router.get("/categories", getCategories);
router.get("/cities", getCities);
router.get("/:id", getTourById);
router.post("/", protect, createTour);
router.post("/:tourId/reviews", protect, addReview);

export default router;