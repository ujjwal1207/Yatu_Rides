import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [step, setStep] = useState('email'); // 'email', 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is for a captain or a regular user based on the URL
  const isCaptain = location.pathname.includes('captain');
  const userType = isCaptain ? 'captain' : 'user';
  const apiEndpoint = isCaptain ? 'captains' : 'users';
  const loginRoute = isCaptain ? '/captain-login' : '/login';

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE}/${apiEndpoint}/forgot-password`, { email });
      setMessage(response.data.message);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || `Error sending OTP.`);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE}/${apiEndpoint}/reset-password`, { email, otp, password });
      setMessage(response.data.message + ' You will be redirected to login.');
      setTimeout(() => navigate(loginRoute), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <img
          className="w-16 mb-6 mx-auto"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt="Logo"
        />
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">Reset password for your {userType} account.</p>

        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Enter your email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-blue-700 transition-colors">
              Send Reset OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit}>
             <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6-digit OTP"
                required
              />
            </div>
             <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Enter New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New Password"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white font-semibold rounded-lg px-4 py-3 text-base hover:bg-green-700 transition-colors">
              Reset Password
            </button>
          </form>
        )}
        <div className="text-center mt-6">
          <Link to={loginRoute} className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
