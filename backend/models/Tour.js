import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  maxGroupSize: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Adventure', 'Beach', 'Cultural', 'Historical', 'Nature', 'Urban', 'Religious', 'Mountain', 'Desert', 'Wildlife']
  },
  duration: {
    type: String,
    required: true,
    default: '1 Day'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging'],
    default: 'Easy'
  },
  includes: [{
    type: String
  }],
  excludes: [{
    type: String
  }],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  avgRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  images: [{
    type: String
  }]
}, { timestamps: true });

// Update totalReviews before saving
tourSchema.pre('save', function(next) {
  if (this.reviews) {
    this.totalReviews = this.reviews.length;
  }
  next();
});

export default mongoose.model("Tour", tourSchema);