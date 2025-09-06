import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-primary">Explore the World with Us</h1>
        <p className="text-lg text-gray-600">
          Discover and book amazing tours across the globe. Hassle-free planning, exclusive packages, and memorable journeys await you.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/tours" className="btn btn-primary btn-lg">
            Browse Tours
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Login to Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
