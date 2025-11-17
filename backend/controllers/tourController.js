import Tour from "../models/Tour.js";

export const getTours = async (req, res) => {
  try {
    const { 
      city, 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      featured,
      page = 1, 
      limit = 9 
    } = req.query;

    const filter = { isActive: true };
    
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const tours = await Tour.find(filter)
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const total = await Tour.countDocuments(filter);
    
    res.status(200).json({
      tours,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('businessId', 'businessName phone email');
    if (!tour) return res.status(404).json({ error: "Tour not found" });
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID or internal error" });
  }
};

export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ error: "Tour not found" });

    const existingReview = tour.reviews.find(
      review => review.userId && review.userId.toString() === userId.toString()
    );

    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this tour" });
    }

    tour.reviews.push({
      userId,
      name: userName,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    });

    const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0);
    tour.avgRating = totalRating / tour.reviews.length;

    await tour.save();
    res.status(200).json({ message: "Review added successfully", tour });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Tour.distinct('category');
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCities = async (req, res) => {
  try {
    const cities = await Tour.distinct('city');
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};