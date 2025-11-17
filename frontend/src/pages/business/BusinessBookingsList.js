import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BusinessBookingsList = () => {
  const { status } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(status || 'all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("businessToken");
      const url = filter === 'all'
        ? "http://localhost:5000/api/business/bookings"
        : `http://localhost:5000/api/business/bookings?status=${filter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    if (!confirm("Confirm this booking?")) return;

    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch(`http://localhost:5000/api/business/bookings/${bookingId}/confirm`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert("Booking confirmed successfully!");
        fetchBookings();
        setSelectedBooking(null);
      } else {
        alert("Failed to confirm booking");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  const handleReject = async (bookingId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch(`http://localhost:5000/api/business/bookings/${bookingId}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (res.ok) {
        alert("Booking rejected");
        fetchBookings();
        setSelectedBooking(null);
      } else {
        alert("Failed to reject booking");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "badge-warning", icon: "⏳" },
      confirmed: { class: "badge-success", icon: "✅" },
      rejected: { class: "badge-error", icon: "❌" },
      cancelled: { class: "badge-ghost", icon: "🚫" }
    };
    return badges[status] || badges.pending;
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
        <h1 className="text-4xl font-bold text-primary mb-2">📋 Booking Management</h1>
        <p className="text-gray-600">Review and manage booking requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed bg-white shadow mb-6 p-2">
        <button
          className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Bookings
        </button>
        <button
          className={`tab ${filter === 'pending' ? 'tab-active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Pending
        </button>
        <button
          className={`tab ${filter === 'confirmed' ? 'tab-active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          ✅ Confirmed
        </button>
        <button
          className={`tab ${filter === 'rejected' ? 'tab-active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          ❌ Rejected
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="card bg-white shadow-xl">
          <div className="card-body items-center text-center py-16">
            <div className="text-8xl mb-6">📭</div>
            <h2 className="text-3xl font-bold text-gray-400 mb-4">
              No {filter !== 'all' ? filter : ''} bookings found
            </h2>
            <p className="text-gray-600">Bookings will appear here once customers make requests</p>
          </div>
        </div>
      ) : (
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Customer Info</th>
                    <th>Tour Details</th>
                    <th>Booking Info</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const badge = getStatusBadge(booking.status);
                    return (
                      <tr key={booking._id}>
                        <td>
                          <div>
                            <div className="font-bold">{booking.customerName}</div>
                            <div className="text-sm opacity-50">{booking.customerEmail}</div>
                            <div className="text-sm opacity-50">📱 {booking.customerPhone}</div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img src={booking.tourId?.photo} alt={booking.tourId?.title} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{booking.tourId?.title}</div>
                              <div className="text-sm opacity-50">{booking.tourId?.city}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            <div>👥 {booking.numberOfPeople} people</div>
                            <div>📅 {new Date(booking.bookingDate).toLocaleDateString()}</div>
                            <div className="text-xs opacity-50">
                              Requested: {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="font-bold text-success text-lg">
                            ₹{booking.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-xs opacity-50">
                            ₹{booking.tourId?.price} × {booking.numberOfPeople}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${badge.class} font-semibold`}>
                            {badge.icon} {booking.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleConfirm(booking._id)}
                                  className="btn btn-success btn-sm"
                                  title="Confirm Booking"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => handleReject(booking._id)}
                                  className="btn btn-error btn-sm"
                                  title="Reject Booking"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="btn btn-info btn-sm"
                              title="View Details"
                            >
                              👁️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-4">📋 Booking Details</h3>

            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-bold mb-2">👤 Customer Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Name:</strong> {selectedBooking.customerName}</div>
                  <div><strong>Email:</strong> {selectedBooking.customerEmail}</div>
                  <div><strong>Phone:</strong> {selectedBooking.customerPhone}</div>
                  <div><strong>People:</strong> {selectedBooking.numberOfPeople}</div>
                </div>
              </div>

              {/* Tour Info */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-bold mb-2">🗺️ Tour Information</h4>
                <div className="flex gap-4 items-center">
                  <img
                    src={selectedBooking.tourId?.photo}
                    alt={selectedBooking.tourId?.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="text-sm">
                    <div className="font-bold text-lg">{selectedBooking.tourId?.title}</div>
                    <div>📍 {selectedBooking.tourId?.city}</div>
                    <div>💰 ₹{selectedBooking.tourId?.price} per person</div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-base-200 p-4 rounded-lg">
                <h4 className="font-bold mb-2">📅 Booking Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Booking Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</div>
                  <div><strong>Status:</strong> <span className={`badge ${getStatusBadge(selectedBooking.status).class}`}>{selectedBooking.status}</span></div>
                  <div><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount.toLocaleString()}</div>
                  <div><strong>Requested On:</strong> {new Date(selectedBooking.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">📝 Special Requests</h4>
                  <p className="text-sm">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedBooking.rejectionReason && selectedBooking.status === 'rejected' && (
                <div className="bg-error bg-opacity-10 p-4 rounded-lg border border-error">
                  <h4 className="font-bold mb-2 text-error">❌ Rejection Reason</h4>
                  <p className="text-sm">{selectedBooking.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="modal-action">
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleConfirm(selectedBooking._id)}
                    className="btn btn-success"
                  >
                    ✅ Confirm Booking
                  </button>
                  <button
                    onClick={() => handleReject(selectedBooking._id)}
                    className="btn btn-error"
                  >
                    ❌ Reject Booking
                  </button>
                </>
              )}
              <button onClick={() => setSelectedBooking(null)} className="btn">
                Close
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedBooking(null)}></div>
        </div>
      )}
    </div>
  );
};

export default BusinessBookingsList;