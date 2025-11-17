import React, { useEffect, useState } from "react";

const BusinessProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch("http://localhost:5000/api/business/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      }));
    } else if (name.startsWith('businessAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        businessAddress: {
          ...prev.businessAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("businessToken");
      const res = await fetch("http://localhost:5000/api/business/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data.business);
        setIsEditing(false);
        alert("Profile updated successfully!");
        
        const businessData = JSON.parse(localStorage.getItem("businessData"));
        localStorage.setItem("businessData", JSON.stringify({
          ...businessData,
          ...data.business
        }));
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">🏢 Business Profile</h1>
        <p className="text-gray-600">Manage your business information</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-6">
              <div className="avatar placeholder">
                <div className="bg-white text-primary rounded-full w-24 h-24">
                  <span className="text-4xl font-bold">
                    {profile?.businessName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile?.businessName}</h2>
                <p className="opacity-90">Contact Person: {profile?.contactPerson}</p>
                <p className="opacity-90">📧 {profile?.email}</p>
                <p className="opacity-90">📱 {profile?.phone}</p>
                <div className="mt-2">
                  <span className={`badge ${
                    profile?.status === 'approved' ? 'badge-success' :
                    profile?.status === 'pending' ? 'badge-warning' : 'badge-error'
                  } badge-lg`}>
                    {profile?.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">📋 Business Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="font-bold text-lg mb-3">Basic Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Business Name</label>
                      <p className="font-semibold">{profile?.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Contact Person</label>
                      <p className="font-semibold">{profile?.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-semibold">{profile?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-semibold">{profile?.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">GST Number</label>
                      <p className="font-semibold">{profile?.gstNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-bold text-lg mb-3">Business Address</h4>
                  <p className="text-gray-700">
                    {profile?.businessAddress?.street}, {profile?.businessAddress?.city}<br />
                    {profile?.businessAddress?.state}, {profile?.businessAddress?.country} - {profile?.businessAddress?.zipCode}
                  </p>
                </div>

                {/* Description */}
                {profile?.description && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">About Business</h4>
                    <p className="text-gray-700">{profile?.description}</p>
                  </div>
                )}

                {/* Social Links */}
                {(profile?.socialLinks?.website || profile?.socialLinks?.facebook || 
                  profile?.socialLinks?.instagram || profile?.socialLinks?.twitter) && (
                  <div>
                    <h4 className="font-bold text-lg mb-3">Social Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile?.socialLinks?.website && (
                        <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" 
                           className="btn btn-sm btn-outline">
                          🌐 Website
                        </a>
                      )}
                      {profile?.socialLinks?.facebook && (
                        <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                           className="btn btn-sm btn-outline">
                          📘 Facebook
                        </a>
                      )}
                      {profile?.socialLinks?.instagram && (
                        <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                           className="btn btn-sm btn-outline">
                          📸 Instagram
                        </a>
                      )}
                      {profile?.socialLinks?.twitter && (
                        <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                           className="btn btn-sm btn-outline">
                          🐦 Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Basic Info (Read-only) */}
                  <div>
                    <h4 className="font-bold text-lg mb-3">Basic Details (Contact Admin to Change)</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label"><span className="label-text">Business Name</span></label>
                        <input type="text" className="input input-bordered" value={profile?.businessName} disabled />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">Contact Person</span></label>
                        <input type="text" className="input input-bordered" value={profile?.contactPerson} disabled />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" className="input input-bordered" value={profile?.email} disabled />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">Phone</span></label>
                        <input
                          type="tel"
                          name="phone"
                          className="input input-bordered"
                          value={formData?.phone || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div>
                    <h4 className="font-bold text-lg mb-3">Business Description</h4>
                    <textarea
                      name="description"
                      className="textarea textarea-bordered w-full h-24"
                      placeholder="Tell customers about your business..."
                      value={formData?.description || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-3">Logo & Banner URLs</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label"><span className="label-text">Logo URL</span></label>
                        <input
                          type="url"
                          name="logo"
                          className="input input-bordered"
                          placeholder="https://example.com/logo.png"
                          value={formData?.logo || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">Banner URL</span></label>
                        <input
                          type="url"
                          name="banner"
                          className="input input-bordered"
                          placeholder="https://example.com/banner.jpg"
                          value={formData?.banner || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-3">Social Links</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label"><span className="label-text">🌐 Website</span></label>
                        <input
                          type="url"
                          name="socialLinks.website"
                          className="input input-bordered"
                          placeholder="https://yourwebsite.com"
                          value={formData?.socialLinks?.website || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">📘 Facebook</span></label>
                        <input
                          type="url"
                          name="socialLinks.facebook"
                          className="input input-bordered"
                          placeholder="https://facebook.com/yourpage"
                          value={formData?.socialLinks?.facebook || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">📸 Instagram</span></label>
                        <input
                          type="url"
                          name="socialLinks.instagram"
                          className="input input-bordered"
                          placeholder="https://instagram.com/yourhandle"
                          value={formData?.socialLinks?.instagram || ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text">🐦 Twitter</span></label>
                        <input
                          type="url"
                          name="socialLinks.twitter"
                          className="input input-bordered"
                          placeholder="https://twitter.com/yourhandle"
                          value={formData?.socialLinks?.twitter || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className={`btn btn-primary flex-1 ${saving ? 'loading' : ''}`}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;