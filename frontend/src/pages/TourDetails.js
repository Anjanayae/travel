import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    numberOfPeople: 1,
    bookingDate: '',
    specialRequests: ''
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tours/${id}`);
      const data = await res.json();
      setTour(data);
    } catch (err) {
      console.error("Error fetching tour:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to book!");
      return;
    }

    setSubmittingBooking(true);

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tourId: tour._id,
          ...bookingData
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Booking request submitted! Please wait for confirmation from the tour operator.");
        setShowBookingModal(false);
        setBookingData({ numberOfPeople: 1, bookingDate: '', specialRequests: '' });
      } else {
        alert(data.error || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to leave a review!");
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await fetch(`http://localhost:5000/api/tours/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review added successfully!");
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        fetchTour();
      } else {
        alert(data.error || "Failed to add review.");
      }
    } catch (err) {
      console.error("Review error:", err);
      alert("Something went wrong.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type={interactive ? "button" : undefined}
        className={`text-2xl ${
          i < rating ? 'text-yellow-500' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
        onClick={interactive ? () => onStarClick(i + 1) : undefined}
        disabled={!interactive}
      >
        ★
      </button>
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-gray-600">Tour not found</h2>
      </div>
    </div>
  );

  const totalPrice = tour.price * bookingData.numberOfPeople;
  const userAlreadyReviewed = tour.reviews?.some(
    review => review.userId === user?._id
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="relative mb-8">
        <img 
          src={tour.photo} 
          alt={tour.title} 
          className="rounded-2xl w-full h-96 object-cover shadow-lg"
        />
        {tour.featured && (
          <div className="absolute top-6 left-6">
            <span className="badge badge-warning text-white font-bold text-lg px-4 py-2">
              ⭐ FEATURED
            </span>
          </div>
        )}
        <div className="absolute top-6 right-6">
          <span className="badge badge-primary text-white font-bold text-lg px-4 py-2">
            {tour.category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-primary mb-4">{tour.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-xl">📍</span>
              <span className="text-lg">{tour.city}, {tour.address}</span>
            </div>
            
            {tour.avgRating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(tour.avgRating)}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {tour.avgRating.toFixed(1)} ({tour.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat bg-base-200 rounded-lg p-4 text-center">
              <div className="stat-title text-sm">Duration</div>
              <div className="stat-value text-lg text-primary">⏱️ {tour.duration}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4 text-center">
              <div className="stat-title text-sm">Group Size</div>
              <div className="stat-value text-lg text-primary">👥 {tour.maxGroupSize}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4 text-center">
              <div className="stat-title text-sm">Difficulty</div>
              <div className={`stat-value text-lg ${
                tour.difficulty === 'Easy' ? 'text-success' :
                tour.difficulty === 'Moderate' ? 'text-warning' : 'text-error'
              }`}>
                {tour.difficulty}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4 text-center">
              <div className="stat-title text-sm">Distance</div>
              <div className="stat-value text-lg text-primary">🚗 {tour.distance}km</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">About This Tour</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{tour.desc}</p>
          </div>

          {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {tour.includes?.length > 0 && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                    ✅ What's Included
                  </h4>
                  <ul className="space-y-2">
                    {tour.includes.map((item, index) => (
                      <li key={index} className="text-green-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tour.excludes?.length > 0 && (
                <div className="bg-red-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                    ❌ What's Not Included
                  </h4>
                  <ul className="space-y-2">
                    {tour.excludes.map((item, index) => (
                      <li key={index} className="text-red-700 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tour.tags?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tour.tags.map((tag, index) => (
                  <span key={index} className="badge badge-outline badge-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card bg-white shadow-xl sticky top-8">
            <div className="card-body">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-success mb-2">
                  ₹{tour.price.toLocaleString()}
                </div>
                <div className="text-gray-600">per person</div>
              </div>

              <button 
                onClick={() => user ? setShowBookingModal(true) : alert("Please login to book")}
                className="btn btn-primary btn-lg w-full mb-4 hover:btn-primary-focus"
              >
                🎫 Book This Tour
              </button>

              <div className="divider">Quick Info</div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Category:</span>
                  <span>{tour.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Available:</span>
                  <span className={tour.available ? 'text-success' : 'text-error'}>
                    {tour.available ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Max Group:</span>
                  <span>{tour.maxGroupSize} people</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold">Reviews ({tour.totalReviews})</h3>
          {user && !userAlreadyReviewed && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-outline btn-primary"
            >
              ✍️ Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="bg-base-200 p-6 rounded-lg mb-8">
            <form onSubmit={handleReviewSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Your Rating</span>
                </label>
                <div className="flex gap-1">
                  {renderStars(reviewData.rating, true, (rating) =>
                    setReviewData(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Your Review</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Share your experience with this tour..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className={`btn btn-primary ${submittingReview ? 'loading' : ''}`}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {tour.reviews?.length > 0 ? (
          <div className="space-y-6">
            {tour.reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-lg">{review.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-200 rounded-lg">
            <div className="text-4xl mb-4">💬</div>
            <h4 className="text-xl font-bold text-gray-600 mb-2">No reviews yet</h4>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">📋 Book {tour.title}</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Number of People *</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={tour.maxGroupSize}
                  className="input input-bordered"
                  value={bookingData.numberOfPeople}
                  onChange={(e) => setBookingData({...bookingData, numberOfPeople: parseInt(e.target.value)})}
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Max {tour.maxGroupSize} people</span>
                </label>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Preferred Date *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={bookingData.bookingDate}
                  onChange={(e) => setBookingData({...bookingData, bookingDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Special Requests (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Any special requirements or requests..."
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                />
              </div>

              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span>Price per person:</span>
                  <span className="font-semibold">₹{tour.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Number of people:</span>
                  <span className="font-semibold">× {bookingData.numberOfPeople}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-bold text-success">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm">Your booking will be sent for review. You'll be notified once confirmed.</span>
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className={`btn btn-primary ${submittingBooking ? 'loading' : ''}`}
                  disabled={submittingBooking}
                >
                  {submittingBooking ? 'Submitting...' : '🚀 Submit Booking Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setShowBookingModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default TourDetails;