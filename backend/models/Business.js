import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String,
    required: true,
    trim: true
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  socialLinks: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'approved'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'business'
  }
}, { timestamps: true });

export default mongoose.model("Business", businessSchema);