import express from "express";
import {
  registerBusiness,
  loginBusiness,
  getBusinessProfile,
  updateBusinessProfile
} from "../controllers/businessAuthController.js";
import { protectBusiness } from "../middleware/businessAuth.js";

const router = express.Router();

router.post("/register", registerBusiness);
router.post("/login", loginBusiness);
router.get("/profile", protectBusiness, getBusinessProfile);
router.put("/profile", protectBusiness, updateBusinessProfile);

export default router;