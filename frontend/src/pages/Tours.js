import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/tours");
        const data = await res.json();
        setTours(data);
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <div className="text-center py-10">Loading tours...</div>;
  if (tours.length === 0) return <div className="text-center py-10">No tours available.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Available Tours</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <div key={tour._id} className="card bg-white shadow-xl rounded-xl overflow-hidden">
            <figure>
              <img src={tour.photo} alt={tour.title} className="h-48 w-full object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-xl font-bold">{tour.title}</h2>
              <p className="text-gray-600">{tour.city}</p>
              <p className="text-success font-semibold">₹{tour.price}</p>
              <div className="card-actions justify-end">
                <Link to={`/tours/${tour._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tours;
