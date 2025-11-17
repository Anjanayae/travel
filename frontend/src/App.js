import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetails from './pages/TourDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import Navbar from './components/Navbar';

import BusinessLogin from './pages/business/BusinessLogin';
import BusinessRegister from './pages/business/BusinessRegister';
import BusinessDashboardLayout from './pages/business/BusinessDashboardLayout';
import BusinessDashboard from './pages/business/BusinessDashboard';
import BusinessToursList from './pages/business/BusinessToursList';
import BusinessCreateTour from './pages/business/BusinessCreateTour';
import BusinessBookingsList from './pages/business/BusinessBookingsList';
import BusinessProfile from './pages/business/BusinessProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/tours" element={<><Navbar /><Tours /></>} />
        <Route path="/tours/:id" element={<><Navbar /><TourDetails /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/bookings" element={<><Navbar /><Bookings /></>} />

        <Route path="/business/login" element={<BusinessLogin />} />
        <Route path="/business/register" element={<BusinessRegister />} />

        <Route path="/business" element={<BusinessDashboardLayout />}>
          <Route path="dashboard" element={<BusinessDashboard />} />
          <Route path="tours" element={<BusinessToursList />} />
          <Route path="tours/create" element={<BusinessCreateTour />} />
          <Route path="tours/edit/:id" element={<BusinessCreateTour />} />
          <Route path="bookings" element={<BusinessBookingsList />} />
          <Route path="bookings/:status" element={<BusinessBookingsList />} />
          <Route path="profile" element={<BusinessProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;