import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    featured: ''
  });

  useEffect(() => {
    fetchTours();
    fetchCategories();
    fetchCities();
  }, [filters]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const res = await fetch(`http://localhost:5000/api/tours?${queryParams}`);
      const data = await res.json();
      setTours(data.tours || data);
    } catch (err) {
      console.error("Error fetching tours:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tours/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tours/cities");
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      featured: ''
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="loading loading-spinner loading-lg text-primary"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-primary">Discover Amazing Tours</h1>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="form-control">
            <input
              type="text"
              placeholder="Search tours..."
              className="input input-bordered w-full"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
            >
              <option value="">All Tours</option>
              <option value="true">Featured Only</option>
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Min Price (₹)</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="input input-bordered w-full"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Max Price (₹)</span>
            </label>
            <input
              type="number"
              placeholder="10000"
              className="input input-bordered w-full"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
          <div className="form-control">
            <button
              onClick={clearFilters}
              className="btn btn-outline btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {tours.length} tour{tours.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Tours Grid */}
      {tours.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-400 mb-2">No tours found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <div key={tour._id} className="card bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Featured Badge */}
              {tour.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="badge badge-warning text-white font-bold">FEATURED</span>
                </div>
              )}

              <figure className="relative">
                <img 
                  src={tour.photo} 
                  alt={tour.title} 
                  className="h-48 w-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="badge badge-primary text-white">{tour.category}</span>
                </div>
              </figure>

              <div className="card-body">
                <h2 className="card-title text-xl font-bold line-clamp-1">{tour.title}</h2>
                <p className="text-gray-600 flex items-center gap-1">
                  <span>📍</span> {tour.city}
                </p>
                
                {/* Rating */}
                {tour.avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(tour.avgRating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({tour.avgRating.toFixed(1)}) - {tour.totalReviews} review{tour.totalReviews !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Tour Details */}
                <div className="flex justify-between items-center text-sm text-gray-600 my-2">
                  <span>⏱️ {tour.duration}</span>
                  <span>👥 Max {tour.maxGroupSize}</span>
                  <span className={`badge ${
                    tour.difficulty === 'Easy' ? 'badge-success' :
                    tour.difficulty === 'Moderate' ? 'badge-warning' : 'badge-error'
                  } badge-sm text-white`}>
                    {tour.difficulty}
                  </span>
                </div>

                <p className="text-gray-700 text-sm line-clamp-2">{tour.desc}</p>
                
                <div className="card-actions justify-between items-center mt-4">
                  <div>
                    <span className="text-2xl font-bold text-success">₹{tour.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">per person</span>
                  </div>
                  <Link 
                    to={`/tours/${tour._id}`} 
                    className="btn btn-primary btn-sm hover:btn-primary-focus"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tours;