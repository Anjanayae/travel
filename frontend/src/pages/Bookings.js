import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to see your bookings.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBookings(data);
      } else {
        alert(data.message || "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Booking fetch error:", err);
      alert("Server error while fetching bookings.");
    } finally {
      setLoading(false);
    }
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

  if (bookings.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🎫</div>
        <h2 className="text-3xl font-bold text-gray-600 mb-4">No Bookings Yet</h2>
        <p className="text-gray-500 mb-8">Start exploring amazing destinations and book your first tour!</p>
        <Link to="/tours" className="btn btn-primary btn-lg">
          🔍 Browse Tours
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">My Bookings</h1>
          <p className="text-xl text-gray-600">Your travel adventures await!</p>
          <div className="divider divider-primary max-w-xs mx-auto"></div>
        </div>

        {/* Bookings Stats */}
        <div className="stats shadow bg-white mb-8 w-full">
          <div className="stat place-items-center">
            <div className="stat-title">Total Bookings</div>
            <div className="stat-value text-primary">{bookings.length}</div>
            <div className="stat-desc">Adventures booked</div>
          </div>
          
          <div className="stat place-items-center">
            <div className="stat-title">Total Spent</div>
            <div className="stat-value text-success">
              ₹{bookings.reduce((total, booking) => total + (booking.tour?.price || 0), 0).toLocaleString()}
            </div>
            <div className="stat-desc">On amazing experiences</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Next Adventure</div>
            <div className="stat-value text-secondary">Soon!</div>
            <div className="stat-desc">Keep exploring</div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <div key={booking._id} className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <figure className="relative">
                <img
                  src={booking.tour?.photo}
                  alt={booking.tour?.title}
                  className="w-full h-48 object-cover"
                />
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className="badge badge-success text-white font-bold">✅ BOOKED</span>
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="badge badge-primary text-white">{booking.tour?.category}</span>
                </div>
              </figure>

              <div className="card-body">
                <h2 className="card-title text-xl font-bold line-clamp-1">
                  {booking.tour?.title}
                </h2>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>📍</span> {booking.tour?.city}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>⏱️</span> {booking.tour?.duration}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>👥</span> {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>📅</span> Booked on {formatDate(booking.createdAt)}
                  </p>
                </div>

                <div className="divider my-2"></div>

                {/* Price and Actions */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-success">
                      ₹{booking.tour?.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 block">per person</span>
                  </div>
                  <div className="card-actions">
                    <Link 
                      to={`/tours/${booking.tour?._id}`} 
                      className="btn btn-primary btn-sm"
                    >
                      View Tour
                    </Link>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="mt-3 p-2 bg-base-200 rounded text-center">
                  <p className="text-xs text-gray-500">Booking ID</p>
                  <p className="font-mono text-sm text-gray-700">{booking._id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Exploring */}
        <div className="text-center mt-12">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl max-w-2xl mx-auto">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-2xl mb-4">🌟 Ready for Your Next Adventure?</h3>
              <p className="mb-6">
                Discover more amazing destinations and create unforgettable memories with our curated tours.
              </p>
              <div className="card-actions">
                <Link to="/tours" className="btn btn-warning btn-lg text-black font-bold">
                  🗺️ Explore More Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;