import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CaptainSignup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate(); // Store the navigate function
  const [vehiclecolor, setVehicleColor] = useState("");
  const [vehicletype, setVehicleType] = useState("");
  const [vehiclenumber, setVehicleNumber] = useState("");
  const [vehiclecap, setVehiclecap] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const captaindata = {
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
      vehicle: {
        color: vehiclecolor,
        type: vehicletype,
        number: vehiclenumber,
        capacity: vehiclecap,
      },
    };

    // Remove this line:
    // setCaptain({...})

    // Only set captain after successful response:
    const response = await axios.post(
      `${import.meta.env.VITE_BASE}/captains/register`,
      captaindata
    );
    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("captaintoken", data.token);
      navigate("/captain-home");
    }

    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setVehicleColor("");
    setVehicleType("");
    setVehicleNumber("");
    setVehiclecap("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt=""
        />

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-base font-medium mb-2"> Whats Your Name</h3>

          <div className="flex gap-4 mb-4">
            <input
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              required
              type="text"
              placeholder="first name"
            />
            <input
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              required
              type="text"
              placeholder="last name"
            />
          </div>

          <h3 className="text-base font-medium mb-2">Your Email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-base font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            type="password"
            placeholder="password"
          />

          <h3 className="text-base font-medium mb-2">Vehicle Details</h3>
          <div className="flex gap-4 mb-4">
            <input
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehiclecolor}
              onChange={(e) => setVehicleColor(e.target.value)}
              required
              type="text"
              placeholder="Vehicle Colour"
            />
            <select
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehicletype}
              onChange={(e) => setVehicleType(e.target.value)}
              required
            >
              <option value="">Vehicle Type</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="flex gap-4 mb-4">
            <input
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehiclecap}
              onChange={(e) => setVehiclecap(e.target.value)}
              required
              type="number"
              min="1"
              placeholder="Vehicle Capacity"
            />
            <input
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              value={vehiclenumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
              type="text"
              placeholder="Vehicle Number"
            />
          </div>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
            Create Captain Account
          </button>
        </form>
        <p className="text-center">
          Already a rider?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Sign in as Captain
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

export default CaptainSignup;
