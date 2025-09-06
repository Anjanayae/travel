import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setBookings([]); // clear bookings on logout
  };

  const bookTour = (tour) => {
    setBookings((prev) => [...prev, tour]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, bookings, bookTour }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
