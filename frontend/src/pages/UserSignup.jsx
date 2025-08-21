import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/usercontext";

function UserSignup() {
  const [step, setStep] = useState('details'); // 'details' or 'verify'
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const newuser = {
      fullname: { firstname, lastname },
      email,
      password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE}/users/register`, newuser);
      setMessage(response.data.message);
      setStep('verify');
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE}/users/verify-email`, { email, otp });
      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/start");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt=""
        />

        {step === 'details' ? (
          <form onSubmit={handleDetailsSubmit}>
            <h3 className="text-base font-medium mb-2"> What's Your Name</h3>
            <div className="flex gap-4 mb-4">
              <input
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                type="text"
                placeholder="first name"
              />
              <input
                className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                type="text"
                placeholder="last name"
              />
            </div>
            <h3 className="text-base font-medium mb-2">Your Email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />
            <h3 className="text-base font-medium mb-2">Enter Password</h3>
            <input
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="password"
            />
             {message && <p className="text-center text-sm mb-3">{message}</p>}
            <button type="submit" className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg">
              Create Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit}>
            <h3 className="text-base font-medium mb-2">Verify Your Email</h3>
            <p className="text-sm text-gray-600 mb-4">An OTP has been sent to {email}.</p>
            <input
              className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              type="text"
              placeholder="Enter 6-digit OTP"
            />
            {message && <p className="text-center text-sm mb-3">{message}</p>}
            <button type="submit" className="bg-green-600 text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg">
              Verify & Sign Up
            </button>
          </form>
        )}
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
}

export default UserSignup;
