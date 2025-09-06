import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchTour();
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to book!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tourId: tour._id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Booking successful!");
      } else {
        alert(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading tour details...</div>;
  if (!tour) return <div className="text-center py-10">Tour not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <img src={tour.photo} alt={tour.title} className="rounded-lg w-full mb-6" />
      <h1 className="text-3xl font-bold text-primary mb-2">{tour.title}</h1>
      <p className="text-gray-600 mb-2">Location: {tour.city}</p>
      <p className="text-lg mb-4">{tour.description}</p>
      <p className="text-xl font-bold mb-6 text-success">₹{tour.price}</p>

      <button onClick={handleBooking} className="btn btn-primary">
        Book Now
      </button>
    </div>
  );
};

export default TourDetails;
