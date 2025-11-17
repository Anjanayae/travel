import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BusinessDashboard = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    rejectedBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch("http://localhost:5000/api/business/bookings/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch("http://localhost:5000/api/business/bookings?limit=5", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecentBookings(data.bookings.slice(0, 5));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      confirmed: "badge-success",
      rejected: "badge-error",
      cancelled: "badge-ghost"
    };
    return badges[status] || "badge-ghost";
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">📊 Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your business control panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-white shadow-lg rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="stat-title">Total Tours</div>
          <div className="stat-value text-primary">{stats.totalTours}</div>
          <div className="stat-desc">
            <Link to="/business/tours" className="link link-primary">View all tours</Link>
          </div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg">
          <div className="stat-figure text-warning">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Pending Requests</div>
          <div className="stat-value text-warning">{stats.pendingBookings}</div>
          <div className="stat-desc">
            <Link to="/business/bookings/pending" className="link link-warning">Review requests</Link>
          </div>
        </div>

        <div className="stat bg-white shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Confirmed Bookings</div>
          <div className="stat-value text-success">{stats.confirmedBookings}</div>
          <div className="stat-desc">Active bookings</div>
        </div>

        <div className="stat bg-gradient-to-br from-primary to-secondary text-white shadow-lg rounded-lg">
          <div className="stat-figure opacity-80">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title text-white opacity-80">Total Revenue</div>
          <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-desc text-white opacity-80">From confirmed bookings</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/business/tours/create" className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="card-body items-center text-center">
            <div className="text-5xl mb-4">➕</div>
            <h2 className="card-title">Add New Tour</h2>
            <p>Create a new tour listing</p>
          </div>
        </Link>

        <Link to="/business/bookings/pending" className="card bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="card-body items-center text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="card-title">Pending Requests</h2>
            <p>{stats.pendingBookings} awaiting review</p>
          </div>
        </Link>

        <Link to="/business/tours" className="card bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-xl hover:shadow-2xl transition-all">
          <div className="card-body items-center text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="card-title">Manage Tours</h2>
            <p>Edit your tour listings</p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="card bg-white shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title text-2xl">📋 Recent Bookings</h2>
            <Link to="/business/bookings" className="btn btn-primary btn-sm">
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-4">📭</div>
              <p>No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Tour</th>
                    <th>People</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div>
                          <div className="font-bold">{booking.customerName}</div>
                          <div className="text-sm opacity-50">{booking.customerEmail}</div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={booking.tourId?.photo} alt={booking.tourId?.title} />
                            </div>
                          </div>
                          <div className="font-semibold">{booking.tourId?.title}</div>
                        </div>
                      </td>
                      <td>{booking.numberOfPeople}</td>
                      <td className="font-semibold text-success">₹{booking.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;