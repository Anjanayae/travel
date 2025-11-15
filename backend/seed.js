import mongoose from "mongoose";
import dotenv from "dotenv";
import Tour from "./models/Tour.js";

dotenv.config();

const sampleTours = [
  {
    title: "Discover Paris",
    city: "Paris",
    address: "Eiffel Tower, Paris",
    distance: 5,
    photo: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop",
    desc: "Enjoy the city of love and lights. Visit iconic landmarks including the Eiffel Tower, Louvre Museum, and cruise along the Seine River.",
    price: 999,
    maxGroupSize: 10,
    category: "Urban",
    duration: "3 Days",
    difficulty: "Easy",
    includes: ["Hotel accommodation", "Breakfast", "Tour guide", "Museum tickets"],
    excludes: ["Flight tickets", "Lunch & Dinner", "Personal expenses"],
    featured: true,
    tags: ["romantic", "culture", "architecture"],
    reviews: [
      {
        name: "John Doe",
        rating: 5,
        comment: "Amazing experience! Paris is truly magical.",
        createdAt: new Date("2024-01-15")
      },
      {
        name: "Sarah Wilson",
        rating: 4,
        comment: "Great tour guide and beautiful locations.",
        createdAt: new Date("2024-01-20")
      }
    ]
  },
  {
    title: "Mountains of Manali",
    city: "Manali",
    address: "Old Manali, Himachal Pradesh",
    distance: 8,
    photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    desc: "A beautiful retreat in the Himalayan hills. Experience snow-capped mountains, adventure sports, and serene valleys.",
    price: 599,
    maxGroupSize: 15,
    category: "Mountain",
    duration: "5 Days",
    difficulty: "Moderate",
    includes: ["Mountain resort stay", "All meals", "Trek guide", "Adventure activities"],
    excludes: ["Travel to Manali", "Personal gear", "Tips"],
    featured: true,
    tags: ["adventure", "nature", "trekking"],
    reviews: [
      {
        name: "Mike Johnson",
        rating: 5,
        comment: "Perfect getaway for nature lovers!",
        createdAt: new Date("2024-02-01")
      }
    ]
  },
  {
    title: "Dubai Desert Safari",
    city: "Dubai",
    address: "Al Marmoom Desert Conservation Reserve",
    distance: 20,
    photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    desc: "Experience the thrill of the dunes with camel riding, sandboarding, and traditional Arabian entertainment.",
    price: 799,
    maxGroupSize: 12,
    category: "Desert",
    duration: "1 Day",
    difficulty: "Easy",
    includes: ["Desert safari", "BBQ dinner", "Cultural show", "Hotel pickup"],
    excludes: ["Alcoholic beverages", "Quad biking", "Tips"],
    featured: false,
    tags: ["adventure", "culture", "desert"],
    reviews: [
      {
        name: "Emma Davis",
        rating: 4,
        comment: "Exciting desert adventure with great food!",
        createdAt: new Date("2024-02-10")
      }
    ]
  },
  {
    title: "Goa Beach Paradise",
    city: "Goa",
    address: "Baga Beach, North Goa",
    distance: 2,
    photo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    desc: "Relax on pristine beaches, enjoy water sports, and experience Goa's vibrant nightlife and Portuguese culture.",
    price: 450,
    maxGroupSize: 20,
    category: "Beach",
    duration: "4 Days",
    difficulty: "Easy",
    includes: ["Beach resort", "Breakfast", "Water sports", "Beach parties"],
    excludes: ["Flights", "Lunch & Dinner", "Alcohol"],
    featured: true,
    tags: ["beach", "relaxation", "nightlife"]
  },
  {
    title: "Kerala Backwaters",
    city: "Alleppey",
    address: "Alleppey Backwaters, Kerala",
    distance: 15,
    photo: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
    desc: "Cruise through serene backwaters on traditional houseboats, witness village life, and enjoy authentic Kerala cuisine.",
    price: 699,
    maxGroupSize: 8,
    category: "Nature",
    duration: "2 Days",
    difficulty: "Easy",
    includes: ["Houseboat stay", "All meals", "Local guide", "Village tours"],
    excludes: ["Transportation to Kerala", "Shopping", "Tips"],
    featured: false,
    tags: ["nature", "peaceful", "cultural"]
  },
  {
    title: "Rajasthan Royal Heritage",
    city: "Jaipur",
    address: "City Palace, Jaipur",
    distance: 10,
    photo: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=400&fit=crop",
    desc: "Explore the royal palaces, magnificent forts, and vibrant markets of the Pink City. Rich cultural heritage awaits.",
    price: 899,
    maxGroupSize: 12,
    category: "Cultural",
    duration: "3 Days",
    difficulty: "Easy",
    includes: ["Heritage hotel", "Palace tours", "Cultural guide", "Traditional dinner"],
    excludes: ["Flights", "Shopping", "Camel ride"],
    featured: true,
    tags: ["heritage", "culture", "royal"]
  },
  {
    title: "Leh Ladakh Adventure",
    city: "Leh",
    address: "Leh Palace, Ladakh",
    distance: 25,
    photo: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&h=400&fit=crop",
    desc: "High altitude adventure through stunning landscapes, ancient monasteries, and challenging mountain passes.",
    price: 1299,
    maxGroupSize: 10,
    category: "Adventure",
    duration: "7 Days",
    difficulty: "Challenging",
    includes: ["Mountain accommodation", "All meals", "Oxygen support", "Monastery visits"],
    excludes: ["Flights to Leh", "Personal medication", "Porter services"],
    featured: false,
    tags: ["adventure", "mountains", "spiritual"]
  },
  {
    title: "Golden Temple Amritsar",
    city: "Amritsar",
    address: "Golden Temple Complex",
    distance: 3,
    photo: "https://images.unsplash.com/photo-1595659074696-d4f96701d043?w=600&h=400&fit=crop",
    desc: "Visit the most sacred Sikh shrine, experience community kitchen, and explore the vibrant culture of Punjab.",
    price: 399,
    maxGroupSize: 25,
    category: "Religious",
    duration: "2 Days",
    difficulty: "Easy",
    includes: ["Hotel stay", "Temple tours", "Langar meals", "Cultural guide"],
    excludes: ["Flights", "Personal expenses", "Shopping"],
    featured: false,
    tags: ["spiritual", "culture", "peace"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Tour.deleteMany({});
    
    // Calculate ratings for tours with reviews
    const toursWithRatings = sampleTours.map(tour => {
      if (tour.reviews && tour.reviews.length > 0) {
        const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0);
        tour.avgRating = totalRating / tour.reviews.length;
        tour.totalReviews = tour.reviews.length;
      }
      return tour;
    });
    
    await Tour.insertMany(toursWithRatings);
    console.log("✅ Enhanced tour data seeded with categories and reviews!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();