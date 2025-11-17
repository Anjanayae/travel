import express from "express";
import {
  getBusinessTours,
  createBusinessTour,
  getBusinessTourById,
  updateBusinessTour,
  deleteBusinessTour,
  toggleTourVisibility
} from "../controllers/businessTourController.js";
import { protectBusiness } from "../middleware/businessAuth.js";

const router = express.Router();

router.use(protectBusiness);

router.get("/", getBusinessTours);
router.post("/", createBusinessTour);
router.get("/:id", getBusinessTourById);
router.put("/:id", updateBusinessTour);
router.delete("/:id", deleteBusinessTour);
router.patch("/:id/toggle", toggleTourVisibility);

export default router;