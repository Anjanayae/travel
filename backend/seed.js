import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "./models/Tour.js";

dotenv.config();

const sampleTours = [
  {
    title: "Discover Paris",
    city: "Paris",
    address: "Eiffel Tower",
    distance: 5,
    photo: "https://source.unsplash.com/600x400/?paris",
    desc: "Enjoy the city of love and lights.",
    price: 999,
    maxGroupSize: 10,
  },
  {
    title: "Mountains of Manali",
    city: "Manali",
    address: "Old Manali",
    distance: 8,
    photo: "https://source.unsplash.com/600x400/?manali",
    desc: "A beautiful retreat in the Himalayan hills.",
    price: 599,
    maxGroupSize: 15,
  },
  {
    title: "Dubai Desert Safari",
    city: "Dubai",
    address: "Al Marmoom Desert",
    distance: 20,
    photo: "https://source.unsplash.com/600x400/?dubai",
    desc: "Experience the thrill of the dunes.",
    price: 799,
    maxGroupSize: 12,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Tour.deleteMany({});
    await Tour.insertMany(sampleTours);
    console.log("✅ Tour data seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
