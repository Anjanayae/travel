import React, { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";

const BusinessDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const businessData = JSON.parse(localStorage.getItem("businessData") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("businessToken");
    localStorage.removeItem("businessData");
    navigate("/business/login");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/business/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/business/tours", icon: "🗺️", label: "My Tours" },
    { path: "/business/tours/create", icon: "➕", label: "Add Tour" },
    { path: "/business/bookings", icon: "📋", label: "Bookings" },
    { path: "/business/bookings/pending", icon: "⏳", label: "Pending Requests" },
    { path: "/business/profile", icon: "🏢", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navigation Bar */}
      <div className="navbar bg-white shadow-lg sticky top-0 z-50">
        <div className="flex-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="btn btn-ghost btn-circle lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/business/dashboard" className="text-2xl font-bold text-primary ml-2">
            🌟 TourEase Business
          </Link>
        </div>

        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-primary text-white rounded-full w-10">
                <span className="text-lg">
                  {businessData.businessName?.charAt(0)?.toUpperCase() || "B"}
                </span>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span className="text-xs">{businessData.businessName}</span>
              </li>
              <li>
                <Link to="/business/profile">👤 Profile</Link>
              </li>
              <li>
                <a onClick={handleLogout} className="text-error">🚪 Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } bg-white min-h-screen shadow-xl transition-all duration-300 overflow-hidden lg:w-64`}
        >
          <div className="p-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-lg mb-6">
              <h3 className="font-bold text-sm">Welcome back!</h3>
              <p className="text-xs opacity-90">{businessData.contactPerson}</p>
            </div>

            <ul className="menu space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 ${
                      isActive(item.path)
                        ? "bg-primary text-white font-semibold"
                        : "hover:bg-base-200"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="divider"></div>

            <div className="px-4">
              <Link to="/" className="btn btn-outline btn-sm w-full mb-2">
                🌐 View Website
              </Link>
              <button onClick={handleLogout} className="btn btn-error btn-sm w-full">
                🚪 Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboardLayout;