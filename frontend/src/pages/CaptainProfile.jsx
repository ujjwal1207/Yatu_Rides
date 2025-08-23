import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

function CaptainProfile() {
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [captainDetails, setCaptainDetails] = useState({
    firstname: captain?.fullname?.firstname || "",
    lastname: captain?.fullname?.lastname || "",
    email: captain?.email || "",
  });
  const [vehicleDetails, setVehicleDetails] = useState({
    color: captain?.vehicle?.color || "",
    number: captain?.vehicle?.number || "",
    capacity: captain?.vehicle?.capacity || "",
    type: captain?.vehicle?.type || "car",
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(
    captain?.profilePicture ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (captain?.profilePicture) {
      setPreview(captain.profilePicture);
    }
  }, [captain]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleCaptainChange = (e) => {
    setCaptainDetails({ ...captainDetails, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (e) => {
    setVehicleDetails({ ...vehicleDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCaptainSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASE}/captains/details`, captainDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
        },
      });
      setCaptain(response.data.captain);
      setMessage("Captain details updated successfully!");
      setError("");
    } catch (error) {
      setError("Failed to update captain details.");
      setMessage("");
      console.error("Error updating captain details:", error);
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASE}/captains/vehicle`, vehicleDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
        },
      });
      setCaptain(response.data.captain);
      setMessage("Vehicle details updated successfully!");
      setError("");
    } catch (error) {
      setError("Failed to update vehicle details.");
      setMessage("");
      console.error("Error updating vehicle details:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE}/captains/change-password`,
        passwordDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
          },
        }
      );
      setMessage("Password changed successfully!");
      setError("");
      setPasswordDetails({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
      setMessage("");
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setError("Please select a picture to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const response = await axios.post(
       `${import.meta.env.VITE_BASE}/captains/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
          },
        }
      );
      setCaptain(response.data.captain);
      setMessage("Profile picture updated!");
      setError("");
    } catch (err) {
      setError("Failed to upload picture.");
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8 text-center">
          <Link
            to="/captain-start"
            className="absolute top-0 left-0 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
            <span>Back to Dashboard</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Manage Profile</h2>
        </div>

        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-center"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Captain Details Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <img
                className="h-16 w-16 rounded-full object-cover mr-4"
                src={preview}
                alt="Profile"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </h3>
                <p className="text-gray-500">{captain?.email}</p>
              </div>
            </div>

            <form onSubmit={handlePictureSubmit} className="mb-6">
              <label className="text-sm font-medium text-gray-600">
                Update Profile Picture
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePictureChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex-grow bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-300 text-sm"
                >
                  Choose Image
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-600 text-sm"
                >
                  Upload
                </button>
              </div>
            </form>
            <hr className="my-6" />

            <form onSubmit={handleCaptainSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={captainDetails.firstname}
                  onChange={handleCaptainChange}
                  className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={captainDetails.lastname}
                  onChange={handleCaptainChange}
                  className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={captainDetails.email}
                  onChange={handleCaptainChange}
                  className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-blue-700 transition-colors"
              >
                Update Personal Details
              </button>
            </form>
          </div>

          {/* Vehicle and Password Forms */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Vehicle Details
              </h3>
              <form onSubmit={handleVehicleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={vehicleDetails.color}
                    onChange={handleVehicleChange}
                    className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={vehicleDetails.number}
                    onChange={handleVehicleChange}
                    className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={vehicleDetails.capacity}
                    onChange={handleVehicleChange}
                    className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Type
                  </label>
                  <select
                    name="type"
                    value={vehicleDetails.type}
                    onChange={handleVehicleChange}
                    className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-green-700 transition-colors"
                >
                  Update Vehicle Details
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Old Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordDetails.oldPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordDetails.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password-captain"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Old Password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-red-700 transition-colors"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaptainProfile;
