import jwt from "jsonwebtoken";
import Business from "../models/Business.js";

export const protectBusiness = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'business') {
      return res.status(403).json({ error: "Access denied. Business account required." });
    }

    const business = await Business.findById(decoded.id).select('-password');

    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    if (business.status === 'blocked') {
      return res.status(403).json({ error: "Your business account has been blocked" });
    }

    if (!business.isActive) {
      return res.status(403).json({ error: "Your business account is inactive" });
    }

    req.business = business;
    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized, token failed" });
  }
};