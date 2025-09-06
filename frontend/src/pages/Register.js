import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth(); // update context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);

      // ✅ Update user context
      login(data.user);

      // ✅ Navigate
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-8 shadow-xl rounded-xl bg-white">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="form-control">
            <label className="label">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="form-control">
            <label className="label">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="form-control">
            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
