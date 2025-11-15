import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [featuredTours, setFeaturedTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedTours();
    fetchCategories();
  }, []);

  const fetchFeaturedTours = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tours?featured=true&limit=6");
      const data = await res.json();
      setFeaturedTours(data.tours || data);
    } catch (err) {
      console.error("Error fetching featured tours:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tours/categories");
      const data = await res.json();
      setCategories(data.slice(0, 8)); // Show only 8 categories
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const categoryIcons = {
    'Adventure': '🏔️',
    'Beach': '🏖️',
    'Cultural': '🏛️',
    'Historical': '🏺',
    'Nature': '🌿',
    'Urban': '🏙️',
    'Religious': '🕉️',
    'Mountain': '⛰️',
    'Desert': '🏜️',
    'Wildlife': '🦁'
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content relative z-10">
          <div className="max-w-4xl">
            <h1 className="mb-8 text-6xl font-bold leading-tight">
              Explore the World with
              <span className="block text-yellow-300">TourEase</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed opacity-90">
              Discover and book amazing tours across the globe. From adventurous mountain treks 
              to serene beach getaways, we've got the perfect journey waiting for you.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/tours" className="btn btn-warning btn-lg text-black font-bold hover:btn-warning-focus">
                🎯 Browse All Tours
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                🚀 Join TourEase
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20">✈️</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-pulse opacity-20">🗺️</div>
        <div className="absolute top-1/3 right-20 text-5xl animate-bounce delay-300 opacity-20">🎒</div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-white w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Happy Travelers</div>
              <div className="stat-value text-primary">25K+</div>
              <div className="stat-desc">Satisfied customers worldwide</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Tours Available</div>
              <div className="stat-value text-secondary">500+</div>
              <div className="stat-desc">Destinations across the globe</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Countries</div>
              <div className="stat-value text-accent">50+</div>
              <div className="stat-desc">Countries to explore</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Expert Guides</div>
              <div className="stat-value text-info">200+</div>
              <div className="stat-desc">Professional tour guides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600">Find tours that match your interests and adventure level</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/tours?category=${category}`}
                className="group"
              >
                <div className="bg-base-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group-hover:bg-primary group-hover:text-white">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[category] || '🌟'}
                  </div>
                  <h3 className="text-lg font-bold">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Featured Tours</h2>
            <p className="text-xl text-gray-600">Hand-picked tours that offer exceptional experiences</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredTours.map((tour) => (
                <div key={tour._id} className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <figure className="relative">
                    <img src={tour.photo} alt={tour.title} className="h-64 w-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="badge badge-warning text-white font-bold">⭐ FEATURED</span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-primary text-white">{tour.category}</span>
                    </div>
                  </figure>

                  <div className="card-body">
                    <h3 className="card-title text-xl">{tour.title}</h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <span>📍</span> {tour.city}
                    </p>

                    {tour.avgRating > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(tour.avgRating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({tour.avgRating.toFixed(1)})
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>⏱️ {tour.duration}</span>
                      <span>👥 Max {tour.maxGroupSize}</span>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{tour.desc}</p>

                    <div className="card-actions justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-success">₹{tour.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 ml-1">per person</span>
                      </div>
                      <Link to={`/tours/${tour._id}`} className="btn btn-primary btn-sm">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/tours" className="btn btn-primary btn-lg">
              View All Tours 🔍
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Why Choose TourEase?</h2>
            <p className="text-xl text-gray-600">We make your travel dreams come true with our exceptional service</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Secure Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Your bookings are protected with our secure payment system and comprehensive travel insurance options.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-6xl mb-6">👥</div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Expert Guides</h3>
              <p className="text-gray-600 leading-relaxed">
                All our tours are led by certified local guides who know the destinations inside and out.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="text-6xl mb-6">💝</div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Best Value</h3>
              <p className="text-gray-600 leading-relaxed">
                We offer competitive prices with no hidden fees. Get the most value for your travel budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-6">Ready for Your Next Adventure?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of happy travelers who have discovered amazing destinations with TourEase.
              Your perfect trip is just a click away!
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/tours" className="btn btn-warning btn-lg text-black font-bold">
                🎯 Start Exploring
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                📝 Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;