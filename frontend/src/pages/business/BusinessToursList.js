import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BusinessToursList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch("http://localhost:5000/api/business/tours", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTours(data.tours);
    } catch (err) {
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (tourId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this tour?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch(`http://localhost:5000/api/business/tours/${tourId}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchTours();
        alert("Tour visibility updated successfully!");
      } else {
        alert("Failed to update tour visibility");
      }
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert("Server error");
    }
  };

  const handleDelete = async (tourId) => {
    if (!confirm("Are you sure you want to delete this tour? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch(`http://localhost:5000/api/business/tours/${tourId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchTours();
        alert("Tour deleted successfully!");
      } else {
        alert("Failed to delete tour");
      }
    } catch (err) {
      console.error("Error deleting tour:", err);
      alert("Server error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">🗺️ My Tours</h1>
          <p className="text-gray-600">Manage your tour listings ({tours.length} total)</p>
        </div>
        <Link to="/business/tours/create" className="btn btn-primary btn-lg">
          ➕ Add New Tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="card bg-white shadow-xl">
          <div className="card-body items-center text-center py-16">
            <div className="text-8xl mb-6">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-400 mb-4">No Tours Yet</h2>
            <p className="text-gray-600 mb-8">Start by creating your first tour listing</p>
            <Link to="/business/tours/create" className="btn btn-primary btn-lg">
              ➕ Create First Tour
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <div key={tour._id} className="card bg-white shadow-xl hover:shadow-2xl transition-all">
              <figure className="relative">
                <img src={tour.photo} alt={tour.title} className="h-48 w-full object-cover" />
                {!tour.isActive && (
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-error text-white font-bold">DISABLED</span>
                  </div>
                )}
                {tour.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="badge badge-warning text-white font-bold">⭐ FEATURED</span>
                  </div>
                )}
              </figure>

              <div className="card-body">
                <h2 className="card-title line-clamp-1">{tour.title}</h2>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span>📍</span> {tour.city}, {tour.country}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🏷️</span> {tour.category}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>⏱️</span> {tour.duration}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-success">₹{tour.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">👥 Max {tour.maxGroupSize}</span>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="flex items-center gap-2 text-sm">
                  <span className={`badge ${tour.isActive ? 'badge-success' : 'badge-error'}`}>
                    {tour.isActive ? '✅ Active' : '❌ Inactive'}
                  </span>
                  {tour.avgRating > 0 && (
                    <span className="badge badge-ghost">
                      ⭐ {tour.avgRating.toFixed(1)} ({tour.totalReviews})
                    </span>
                  )}
                </div>

                <div className="card-actions justify-between mt-4">
                  <Link to={`/business/tours/edit/${tour._id}`} className="btn btn-primary btn-sm">
                    ✏️ Edit
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleVisibility(tour._id, tour.isActive)}
                      className={`btn btn-sm ${tour.isActive ? 'btn-warning' : 'btn-success'}`}
                    >
                      {tour.isActive ? '👁️ Hide' : '👁️ Show'}
                    </button>
                    <button
                      onClick={() => handleDelete(tour._id)}
                      className="btn btn-error btn-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessToursList;