import React, { useEffect, useState } from "react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-10">Loading your bookings...</div>;
  if (bookings.length === 0) return <div className="text-center py-10">No bookings found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-primary">My Bookings</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div key={booking._id} className="card bg-white shadow-lg rounded-lg overflow-hidden">
            <figure>
              <img
                src={booking.tour?.photo}
                alt={booking.tour?.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{booking.tour?.title}</h2>
              <p className="text-gray-600">{booking.tour?.city}</p>
              <p className="text-success font-semibold">₹{booking.tour?.price}</p>
              <p className="text-sm text-gray-500">Booking ID: {booking._id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
