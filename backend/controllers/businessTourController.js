import Tour from "../models/Tour.js";

export const getBusinessTours = async (req, res) => {
  try {
    const tours = await Tour.find({ businessId: req.business._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      tours,
      total: tours.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBusinessTour = async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      businessId: req.business._id
    };

    const newTour = new Tour(tourData);
    const savedTour = await newTour.save();

    res.status(201).json({
      message: "Tour created successfully",
      tour: savedTour
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBusinessTourById = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      _id: req.params.id,
      businessId: req.business._id
    });

    if (!tour) {
      return res.status(404).json({ error: "Tour not found or access denied" });
    }

    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBusinessTour = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.businessId;

    const tour = await Tour.findOneAndUpdate(
      { _id: req.params.id, businessId: req.business._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!tour) {
      return res.status(404).json({ error: "Tour not found or access denied" });
    }

    res.status(200).json({
      message: "Tour updated successfully",
      tour
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBusinessTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndDelete({
      _id: req.params.id,
      businessId: req.business._id
    });

    if (!tour) {
      return res.status(404).json({ error: "Tour not found or access denied" });
    }

    res.status(200).json({
      message: "Tour deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleTourVisibility = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      _id: req.params.id,
      businessId: req.business._id
    });

    if (!tour) {
      return res.status(404).json({ error: "Tour not found or access denied" });
    }

    tour.isActive = !tour.isActive;
    await tour.save();

    res.status(200).json({
      message: `Tour ${tour.isActive ? 'enabled' : 'disabled'} successfully`,
      tour
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};