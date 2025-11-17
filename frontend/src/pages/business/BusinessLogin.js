import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BusinessLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/business/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("businessToken", data.token);
        localStorage.setItem("businessData", JSON.stringify(data.business));
        alert(data.message);
        navigate("/business/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🏢 Business Login</h1>
          <p className="text-gray-600">Access your Tour Operator Dashboard</p>
        </div>

        <div className="card bg-white shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Email Address</span>
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

              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full btn-lg ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : '🔑 Login to Dashboard'}
              </button>

              <div className="divider">OR</div>

              <p className="text-center text-gray-600">
                Don't have a business account?{" "}
                <Link to="/business/register" className="text-primary font-semibold hover:underline">
                  Register here
                </Link>
              </p>

              <p className="text-center text-sm text-gray-500 mt-4">
                Looking for customer login?{" "}
                <Link to="/login" className="text-secondary hover:underline">
                  Click here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin;