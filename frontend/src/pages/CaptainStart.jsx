import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import RidePopUp from "../components/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import CaptainDetails from "../components/CaptainDetails";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LiveTracking from "../components/LiveTracking"; // Import LiveTracking

function CaptainStart() {
  const [ridePopuPanel, setRidePopupPanel] = useState(false);
  const [ConfirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const [distanceToPickup, setDistanceToPickup] = useState(null); // State for distance
  const ridePopupPanelRef = useRef(null);
  const ConfirmRidePopupPanelRef = useRef(null);
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!socket || !captain?._id) return;

    socket.emit("join", { userId: captain._id, userType: "captain" });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            captainId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    socket.on("new-ride", (data) => {
      setRide(data);
      setRidePopupPanel(true);
    });

    return () => {
      clearInterval(locationInterval);
      socket.off("new-ride");
    };
  }, [socket, captain]);

  async function confirmRide() {
    if (!ride || !captain?._id) {
      console.error("Ride or captain data is missing");
      return;
    }
    await axios.post(
      "/rides/confirm",
      { rideId: ride._id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("captaintoken")}`,
        },
      }
    );
    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }
  
  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopuPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ridePopuPanel]);

  useGSAP(() => {
    gsap.to(ConfirmRidePopupPanelRef.current, {
      transform: ConfirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [ConfirmRidePopupPanel]);

  return (
    <div className="h-screen">
      {/* Hidden LiveTracking to get distance for the popup */}
      {ride && (ridePopuPanel || ConfirmRidePopupPanel) && (
          <div style={{ display: 'none' }}>
              <LiveTracking 
                pickup={ride.pickup} 
                destination={ride.destination}
                onDistanceToPickupChange={setDistanceToPickup}
              />
          </div>
      )}

      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="/zipride captain.png"
          alt=""
        />
        <div className="flex items-center gap-2">
          <Link
            to="/captain-profile"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
          >
            <i className="text-lg font-medium ri-user-line"></i>
          </Link>
          <Link
            to="/captain-login"
            className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
          >
            <i className="text-lg font-medium ri-logout-box-r-line"></i>
          </Link>
        </div>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
          distance={distanceToPickup} // Pass distance to RidePopUp
        />
      </div>
      <div
        ref={ConfirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
          distance={distanceToPickup} // Pass distance to ConfirmRidePopUp
        />
      </div>
    </div>
  );
}

export default CaptainStart;
