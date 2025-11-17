import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BusinessCreateTour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    city: '',
    country: 'India',
    address: '',
    distance: '',
    photo: '',
    desc: '',
    price: '',
    maxGroupSize: '',
    category: 'Adventure',
    duration: '1 Day',
    difficulty: 'Easy',
    includes: [''],
    excludes: [''],
    tags: ['']
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchTour();
    }
  }, [id]);

  const fetchTour = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch(`http://localhost:5000/api/business/tours/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFormData({
        ...data,
        includes: data.includes?.length > 0 ? data.includes : [''],
        excludes: data.excludes?.length > 0 ? data.excludes : [''],
        tags: data.tags?.length > 0 ? data.tags : ['']
      });
    } catch (err) {
      console.error("Error fetching tour:", err);
      alert("Failed to load tour data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length > 0 ? newArray : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("businessToken");
      const cleanedData = {
        ...formData,
        includes: formData.includes.filter(item => item.trim() !== ''),
        excludes: formData.excludes.filter(item => item.trim() !== ''),
        tags: formData.tags.filter(item => item.trim() !== '')
      };

      const url = isEdit
        ? `http://localhost:5000/api/business/tours/${id}`
        : "http://localhost:5000/api/business/tours";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        navigate("/business/tours");
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          {isEdit ? '✏️ Edit Tour' : '➕ Create New Tour'}
        </h1>
        <p className="text-gray-600">Fill in the details to {isEdit ? 'update' : 'create'} your tour listing</p>
      </div>

      <div className="card bg-white shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Tour Title *</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Amazing Beach Paradise Tour"
                    className="input input-bordered"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Category *</span>
                  </label>
                  <select
                    name="category"
                    className="select select-bordered"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option>Adventure</option>
                    <option>Beach</option>
                    <option>Cultural</option>
                    <option>Historical</option>
                    <option>Nature</option>
                    <option>Urban</option>
                    <option>Religious</option>
                    <option>Mountain</option>
                    <option>Desert</option>
                    <option>Wildlife</option>
                    <option>Luxury</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">City *</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    className="input input-bordered"
                    value={formData.city}
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
                    name="country"
                    className="input input-bordered"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Address *</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Main Street, Downtown"
                    className="input input-bordered"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Distance (km) *</span>
                  </label>
                  <input
                    type="number"
                    name="distance"
                    placeholder="25"
                    className="input input-bordered"
                    value={formData.distance}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Photo URL *</span>
                  </label>
                  <input
                    type="url"
                    name="photo"
                    placeholder="https://example.com/image.jpg"
                    className="input input-bordered"
                    value={formData.photo}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tour Details */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary mb-4">Tour Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Price (₹) *</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="999"
                    className="input input-bordered"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Max Group Size *</span>
                  </label>
                  <input
                    type="number"
                    name="maxGroupSize"
                    placeholder="10"
                    className="input input-bordered"
                    value={formData.maxGroupSize}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Duration *</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="3 Days 2 Nights"
                    className="input input-bordered"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-control md:col-span-3">
                  <label className="label">
                    <span className="label-text font-semibold">Difficulty *</span>
                  </label>
                  <div className="flex gap-4">
                    {['Easy', 'Moderate', 'Challenging'].map(level => (
                      <label key={level} className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="difficulty"
                          className="radio radio-primary"
                          value={level}
                          checked={formData.difficulty === level}
                          onChange={handleChange}
                        />
                        <span className="label-text">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-control md:col-span-3">
                  <label className="label">
                    <span className="label-text font-semibold">Description *</span>
                  </label>
                  <textarea
                    name="desc"
                    placeholder="Describe your tour..."
                    className="textarea textarea-bordered h-24"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Includes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-success">✅ What's Included</h3>
                <button
                  type="button"
                  onClick={() => addArrayField('includes')}
                  className="btn btn-success btn-sm"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Hotel accommodation"
                      className="input input-bordered flex-1"
                      value={item}
                      onChange={(e) => handleArrayChange('includes', index, e.target.value)}
                    />
                    {formData.includes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('includes', index)}
                        className="btn btn-error btn-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Excludes */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-error">❌ What's Not Included</h3>
                <button
                  type="button"
                  onClick={() => addArrayField('excludes')}
                  className="btn btn-error btn-sm"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                {formData.excludes.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Flight tickets"
                      className="input input-bordered flex-1"
                      value={item}
                      onChange={(e) => handleArrayChange('excludes', index, e.target.value)}
                    />
                    {formData.excludes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('excludes', index)}
                        className="btn btn-error btn-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">🏷️ Tags</h3>
                <button
                  type="button"
                  onClick={() => addArrayField('tags')}
                  className="btn btn-primary btn-sm"
                >
                  + Add Tag
                </button>
              </div>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., adventure, family-friendly"
                      className="input input-bordered flex-1"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('tags', index)}
                        className="btn btn-error btn-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="divider"></div>

            <div className="flex gap-4">
              <button
                type="submit"
                className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? '💾 Update Tour' : '🚀 Create Tour'}
              </button>
              <button
                type="button"
                onClick={() => navigate("/business/tours")}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessCreateTour;