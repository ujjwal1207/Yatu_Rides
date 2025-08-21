import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/usercontext";

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [message, setMessage] = useState('');

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setMessage('Please enter your email first.');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BASE}/users/send-otp`, { email });
      setMessage('OTP sent to your email!');
    } catch (error) {
      setMessage('Failed to send OTP. Please check the email.');
      console.error('Error sending OTP:', error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (loginMethod === 'password') {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE}/users/login`, { email, password });
        if (response.status === 200) {
          const data = response.data;
          setUser(data.user);
          localStorage.setItem('token', data.token);
          navigate('/start');
        }
      } catch (error) {
        setMessage('Invalid email or password.');
      }
    } else { // OTP login
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE}/users/login-otp`, { email, otp });
        if (response.status === 200) {
          const data = response.data;
          setUser(data.user);
          localStorage.setItem('token', data.token);
          navigate('/start');
        }
      } catch (error) {
        setMessage('Invalid or expired OTP.');
      }
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

        <form onSubmit={submitHandler}>
          <h3 className="text-base font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-base placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          {loginMethod === 'password' ? (
            <div>
              <h3 className="text-base font-medium mb-2">Enter Password</h3>
              <input
                className="bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-base placeholder:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="password"
              />
              <div className="text-right mt-2 mb-4">
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot Password?
                  </Link>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-medium mb-2">Enter OTP</h3>
              <div className="flex items-center gap-2 mb-7">
                <input
                  className="bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-base placeholder:text-base"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  type="text"
                  placeholder="6-digit OTP"
                />
                <button type="button" onClick={handleSendOtp} className="bg-gray-200 text-black font-semibold rounded-lg px-4 py-2 whitespace-nowrap">
                  Send OTP
                </button>
              </div>
            </div>
          )}

          {message && <p className="text-center text-sm mb-3">{message}</p>}

          <button type="submit" className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-base placeholder:text-base">
            Login
          </button>
        </form>

        <button
          onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
          className="text-center w-full text-blue-600 mt-2"
        >
          {loginMethod === 'password' ? 'Login with OTP' : 'Login with Password'}
        </button>

        <p className="text-center mt-4">
          New here?{" "}
          <Link to="/signup" className="text-blue-600">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Link
          to="/captain-login"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-base placeholder:text-base"
        >
          Sign in as Captain
        </Link>
        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
