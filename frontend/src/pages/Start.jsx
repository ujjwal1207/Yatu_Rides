import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useContext } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitingforRider from "../components/WaitingforRider";
import LookingforRider from "../components/LookingforRider";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/usercontext";
import { useNavigate } from "react-router-dom";

function Start() {
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclepanelopenref = useRef(null);
  const ConfirmRidePanelref = useRef(null);
  const LookingforRiderPanelref = useRef(null);
  const WaitingforRiderPanelref = useRef(null);

  const [Pickup, setPickup] = useState("");
  const [Destination, setDestination] = useState("");
  const [PickupSuggestions, setPickupSuggestions] = useState([]);
  const [DestinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setride] = useState(null);

  const [panel, setpanel] = useState(false);
  const [vehiclepanelopen, setvehiclepanelopen] = useState(false);
  const [ConfirmRidePanel, setConfirmRidePanel] = useState(false);
  const [LookingforRiderPanel, setLookingforRiderPanel] = useState(false);
  const [WaitingforRiderPanel, setWaitingforRiderPanel] = useState(false);

  const { socket } = React.useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && user && user._id) {
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
    }
  }, [user]);

  socket.on("ride-confirmed", (ride) => {
    setWaitingforRiderPanel(true);
    setConfirmRidePanel(false);
    setLookingforRiderPanel(false);
    setride(ride);
  });

  socket.on("ride-started", (ride) => {
    setWaitingforRiderPanel(false);
    setLookingforRiderPanel(false);
    navigate("/riding", { state: { ride: ride } });
  });

  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get("/maps/get-suggestions",
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        "/maps/get-suggestions",
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  const Submithandler = (e) => {
    e.preventDefault();
    if (!ride || !ride.user || !ride.user._id) {
      console.error("Missing ride.user data", ride);
      return;
    }
  };

  // GSAP panels
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panel ? "70%" : "0%",
      padding: panel ? 24 : 0,
    });
    gsap.to(panelCloseRef.current, {
      opacity: panel ? 1 : 0,
    });
  }, [panel]);

  useGSAP(() => {
    gsap.to(vehiclepanelopenref.current, {
      transform: vehiclepanelopen ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehiclepanelopen]);

  useGSAP(() => {
    gsap.to(ConfirmRidePanelref.current, {
      transform: ConfirmRidePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ConfirmRidePanel]);

  useGSAP(() => {
    gsap.to(LookingforRiderPanelref.current, {
      transform: LookingforRiderPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [LookingforRiderPanel]);

  useGSAP(() => {
    gsap.to(WaitingforRiderPanelref.current, {
      transform: WaitingforRiderPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [WaitingforRiderPanel]);

  async function findtrip() {
    if (!Pickup || !Destination) {
      alert("Please enter both Pickup and Destination locations.");
      return;
    }
    setvehiclepanelopen(true);
    setpanel(false);
    try {
      const response = await axios.get(
        "/rides/get-fare",
        {
          params: {
            Pickup: Pickup,
            Destination: Destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setFare(response.data.fare);
    } catch (error) {
      console.error("Error fetching fare:", error);
      alert("Failed to fetch fare. Please check your locations and try again.");
    }
  }

  async function CreateRide(Vehicletype) {
    try {
      const response = await axios.post("/rides/create",
        {
          Pickup: Pickup,
          Destination: Destination,
          rideType: Vehicletype,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* This block will now only show when the panel is closed */}
      {!panel && (
        <div className="flex justify-between items-center">
          <div className="absolute top-2 left-4 z-10 flex items-center gap-4">
            <img
              className="w-20"
              src="/zipride user.png"
              alt="Uber Logo"
            />
          </div>
          <div className="absolute top-4 right-4 z-10">
            <Link
              to="/user-profile"
              className="bg-white rounded-full p-2 shadow-md flex items-center justify-center h-12 w-12"
            >
              <i className="ri-user-line text-2xl"></i>
            </Link>
          </div>
        </div>
      )}

      <div className="h-screen w-screen">
        <img
          className="h-full w-full object-cover"
          src="https://i0.wp.com/www.medianama.com/wp-content/uploads/2018/06/Screenshot_20180619-112715.png.png?fit=493%2C383&ssl=1"
          alt="Map"
        />
      </div>

      <div className="flex flex-col justify-end h-screen w-full top-0 absolute">
        <div className="relative h-[30%] bg-white p-5">
          <h5
            ref={panelCloseRef}
            onClick={() => setpanel(false)}
            className="absolute top-6 right-6 w-4"
          >
            <img
              src="https://www.iconpacks.net/icons/2/free-arrow-down-icon-3101-thumb.png"
              alt="Close Panel"
            />
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={Submithandler}>
            <div className="line absolute h-16 w-1 top-[56%] -translate-y-1/2 left-10 bg-gray-700 rounded-full"></div>

            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Add Pickup location"
              value={Pickup}
              onClick={() => {
                setpanel(true);
                setActiveField("pickup");
              }}
              onChange={handlePickupChange}
            />

            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Add Destination"
              value={Destination}
              onClick={() => {
                setpanel(true);
                setActiveField("destination");
              }}
              onChange={handleDestinationChange}
            />
          </form>
          <button
            onClick={findtrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full cursor-pointer hover:bg-gray-800 transition-colors duration-300"
          >
            Find my ride
          </button>
        </div>

        <div ref={panelRef} className="bg-white h-0">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? PickupSuggestions
                : DestinationSuggestions
            }
            setPanelOpen={setpanel}
            setVehiclePanel={setvehiclepanelopen}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      <div
        ref={vehiclepanelopenref}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          selectVehicleType={setVehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setvehiclepanelopen={setvehiclepanelopen}
          fare={fare}
          Pickup={Pickup}
          Destination={Destination}
        />
      </div>

      <div
        ref={ConfirmRidePanelref}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          fare={fare}
          CreateRide={CreateRide}
          Pickup={Pickup}
          Destination={Destination}
          vehicleType={vehicleType}
          setLookingforRiderPanel={setLookingforRiderPanel}
          setConfirmRidePanel={setConfirmRidePanel}
        />
      </div>

      <div
        ref={LookingforRiderPanelref}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <LookingforRider
          CreateRide={CreateRide}
          ride={ride}
          Pickup={Pickup}
          Destination={Destination}
          vehicleType={vehicleType}
          setLookingforRiderPanel={setLookingforRiderPanel}
          setWaitingforRiderPanel={setWaitingforRiderPanel}
        />
      </div>

      <div
        ref={WaitingforRiderPanelref}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <WaitingforRider
          ride={ride}
          setWaitingforRiderPanel={setWaitingforRiderPanel}
          setLookingforRiderPanel={setLookingforRiderPanel}
        />
      </div>
    </div>
  );
}

export default Start;