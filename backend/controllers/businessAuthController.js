import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Business from "../models/Business.js";

export const registerBusiness = async (req, res) => {
  try {
    const {
      businessName,
      contactPerson,
      email,
      password,
      phone,
      gstNumber,
      businessAddress
    } = req.body;

    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ error: "Business already registered with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBusiness = new Business({
      businessName,
      contactPerson,
      email,
      password: hashedPassword,
      phone,
      gstNumber,
      businessAddress
    });

    await newBusiness.save();

    res.status(201).json({
      message: "Business registered successfully! You can now login.",
      business: {
        id: newBusiness._id,
        businessName: newBusiness.businessName,
        email: newBusiness.email,
        status: newBusiness.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    if (business.status === 'blocked') {
      return res.status(403).json({ error: "Your business account has been blocked. Contact admin." });
    }

    if (business.status === 'pending') {
      return res.status(403).json({ error: "Your business account is pending approval." });
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: business._id, role: 'business' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      business: {
        id: business._id,
        businessName: business.businessName,
        contactPerson: business.contactPerson,
        email: business.email,
        phone: business.phone,
        logo: business.logo,
        status: business.status,
        role: business.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.business._id).select('-password');
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    delete updates.email;
    delete updates.password;
    delete updates.status;

    const business = await Business.findByIdAndUpdate(
      req.business._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      business
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};