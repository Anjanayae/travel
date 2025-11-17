import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar bg-white shadow-lg sticky top-0 z-50 px-4">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Left: Logo + Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-3xl font-bold text-primary hover:scale-105 transition-transform duration-200 flex items-center gap-2"
          >
            🌟 TourEase
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition duration-200 font-medium ${
                isActive('/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:text-primary hover:bg-base-200'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/tours"
              className={`px-3 py-2 rounded-lg transition duration-200 font-medium ${
                isActive('/tours') || location.pathname.startsWith('/tours/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:text-primary hover:bg-base-200'
              }`}
            >
              🗺️ Tours
            </Link>
            {user && (
              <Link
                to="/bookings"
                className={`px-3 py-2 rounded-lg transition duration-200 font-medium ${
                  isActive('/bookings') 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:text-primary hover:bg-base-200'
                }`}
              >
                🎫 My Bookings
              </Link>
            )}
          </div>
        </div>

        {/* Right: Auth Buttons (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                  <div className="bg-primary text-white rounded-full w-10">
                    <span className="text-lg font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52">
                  <li className="menu-title">
                    <span>Hello, {user.name || user.email}!</span>
                  </li>
                  <li>
                    <Link to="/bookings" className="flex items-center gap-2">
                      🎫 My Bookings
                    </Link>
                  </li>
                  <li>
                    <a onClick={handleLogout} className="flex items-center gap-2 text-error">
                      🚪 Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="btn btn-outline btn-primary btn-sm hover:scale-105 transition-transform"
              >
                🔑 Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-sm hover:scale-105 transition-transform"
              >
                ✨ Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-ghost btn-circle"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t z-40">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition duration-200 font-medium ${
                isActive('/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-base-200'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              to="/tours"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition duration-200 font-medium ${
                isActive('/tours') || location.pathname.startsWith('/tours/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-base-200'
              }`}
            >
              🗺️ Tours
            </Link>
            {user && (
              <Link
                to="/bookings"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition duration-200 font-medium ${
                  isActive('/bookings') 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-base-200'
                }`}
              >
                🎫 My Bookings
              </Link>
            )}

            <div className="divider my-2"></div>

            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-sm text-gray-600">
                  Hello, {user.name || user.email}!
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-error hover:bg-red-50 transition duration-200 font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-base-200 transition duration-200 font-medium"
                >
                  🔑 Traveller Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary-focus transition duration-200 font-medium"
                >
                  ✨ Sign Up
                </Link>
                <div className="divider my-1"></div>
                <Link
                  to="/business/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-secondary text-white hover:bg-secondary-focus transition duration-200 font-medium"
                >
                  🏢 Business Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;