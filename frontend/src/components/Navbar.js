import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-base-100 shadow px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:scale-105 transition-transform duration-200"
          >
            TourEase
          </Link>

          <div className="hidden md:flex gap-4">
            <Link
              to="/"
              className="hover:text-primary text-gray-700 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/tours"
              className="hover:text-primary text-gray-700 transition duration-200"
            >
              Tours
            </Link>
            {user && (
              <Link
                to="/bookings"
                className="hover:text-primary text-gray-700 transition duration-200"
              >
                My Bookings
              </Link>
            )}
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline-block text-sm text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="btn btn-outline btn-error btn-sm hover:scale-105 transition-transform"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-secondary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
