import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";


const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [distance, setDistance] = useState(null);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

  return (
    <div className="h-screen relative flex flex-col justify-end">
      {/* Full-screen movable map */}
      <div className="absolute inset-0">
        <LiveTracking
          pickup={rideData?.pickup}
          destination={rideData?.destination}
          onDistanceChange={setDistance} // Pass the callback to update distance to destination
        />
      </div>

      {/* Bottom ride panel */}
      <div
        className="relative bg-yellow-400 pointer-events-auto cursor-pointer"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-7 bg-yellow-400 rounded-t-xl flex justify-center items-center">
          <i className="text-3xl text-black ri-arrow-up-s-line"></i>
        </div>

        <div className="p-6 pt-5 flex items-center justify-between">
            <h4 className="text-xl font-semibold">
                {distance !== null ? `${distance.toFixed(1)} Km` : "Calculating..."}
            </h4>
            <button className="bg-green-600 text-white font-semibold p-3 px-5 rounded-lg">
              Complete Ride
            </button>
        </div>
      </div>


      {/* Finish Ride Slide-Up Panel */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-6 pointer-events-auto"
      >
        <FinishRide distance={distance} ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
