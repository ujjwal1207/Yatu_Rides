import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/usercontext';

function UserProfile() {
  const { user, setUser } = useContext(UserDataContext);
  const [userDetails, setUserDetails] = useState({
    firstname: user?.fullname?.firstname || '',
    lastname: user?.fullname?.lastname || '',
    email: user?.email || '',
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || 'https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePicture);
    }
  }, [user]);

  const handleUserChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
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

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASE}/users/details`, userDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(response.data.user);
      setMessage('Details updated successfully!');
      setError('');
    } catch (err) {
      setError('Failed to update details.');
      setMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE}/users/change-password`, passwordDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage('Password changed successfully!');
      setError('');
      setPasswordDetails({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
      setMessage('');
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Please select a picture to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE}/users/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data.user);
      setMessage('Profile picture updated!');
      setError('');
    } catch (err) {
      setError('Failed to upload picture.');
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-8 text-center">
          <Link to="/start" className="absolute top-0 left-0 flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <i className="ri-arrow-left-s-line text-2xl"></i>
            <span>Back to Map</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Your Profile</h2>
        </div>

        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-center">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 text-center">{error}</div>}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Profile Picture</h3>
          <div className="flex items-center gap-6">
            <img src={preview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            <input type="file" ref={fileInputRef} onChange={handlePictureChange} className="hidden" accept="image/*" />
            <button onClick={() => fileInputRef.current.click()} className="bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-300">Choose Image</button>
            <button onClick={handlePictureSubmit} className="bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-700">Upload</button>
          </div>
        </div>


        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Personal Details</h3>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">First Name</label>
                <input type="text" name="firstname" value={userDetails.firstname} onChange={handleUserChange} className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Last Name</label>
                <input type="text" name="lastname" value={userDetails.lastname} onChange={handleUserChange} className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <input type="email" name="email" value={userDetails.email} onChange={handleUserChange} className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-blue-700 transition-colors">Update Details</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Old Password</label>
                <input type="password" name="oldPassword" value={passwordDetails.oldPassword} onChange={handlePasswordChange} className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">New Password</label>
                <input type="password" name="newPassword" value={passwordDetails.newPassword} onChange={handlePasswordChange} className="mt-1 bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot Old Password?
                  </Link>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-red-700 transition-colors">Change Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;