import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BusinessRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    password: '',
    phone: '',
    gstNumber: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        businessAddress: {
          ...prev.businessAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/business/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/business/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🏢 Business Registration</h1>
          <p className="text-gray-600">Join TourEase as a Tour Operator</p>
        </div>

        <div className="card bg-white shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary mb-4">Business Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Business Name *</span>
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="ABC Tours & Travels"
                      className="input input-bordered"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Contact Person *</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      placeholder="John Doe"
                      className="input input-bordered"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Email Address *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="business@example.com"
                      className="input input-bordered"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Password *</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="input input-bordered"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Phone Number *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 9876543210"
                      className="input input-bordered"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">GST Number *</span>
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      placeholder="22AAAAA0000A1Z5"
                      className="input input-bordered"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary mb-4">Business Address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-semibold">Street Address *</span>
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      placeholder="123, Main Street"
                      className="input input-bordered"
                      value={formData.businessAddress.street}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">City *</span>
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      placeholder="Mumbai"
                      className="input input-bordered"
                      value={formData.businessAddress.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">State *</span>
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      placeholder="Maharashtra"
                      className="input input-bordered"
                      value={formData.businessAddress.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Country *</span>
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      className="input input-bordered"
                      value={formData.businessAddress.country}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">ZIP Code *</span>
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      placeholder="400001"
                      className="input input-bordered"
                      value={formData.businessAddress.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <button
                type="submit"
                className={`btn btn-primary w-full btn-lg ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Registering...' : '🚀 Register Business'}
              </button>

              <p className="text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <Link to="/business/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister;