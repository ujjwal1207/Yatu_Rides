import React, { useState, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveTracking = ({ destination }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [steps, setSteps] = useState([]);

  // Watch live location & update route
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = { lat: latitude, lng: longitude };
        setCurrentPosition(newPos);

        // Draw/update route when we have destination
        if (destination?.lat && destination?.lng) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: newPos,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);

                // Extract navigation steps
                const routeSteps =
                  result.routes[0].legs[0]?.steps.map((step) => ({
                    instruction: step.instructions,
                    distance: step.distance.text,
                    duration: step.duration.text,
                  })) || [];
                setSteps(routeSteps);
              } else {
                setDirections(null);
                setSteps([]);
              }
            }
          );
        }
      },
      (error) => console.error("Error getting location", error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [destination]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="relative w-full h-full">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || destination}
          zoom={15}
        >
          {/* Current position marker */}
          {currentPosition && <Marker position={currentPosition} />}

          {/* Destination marker */}
          {destination?.lat && destination?.lng && (
            <Marker
              position={destination}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          )}

          {/* Route polyline */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>

        {/* Navigation step panel */}
        {steps.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg max-h-48 overflow-y-auto p-3">
            <h3 className="font-semibold mb-2">Navigation</h3>
            {steps.map((step, idx) => (
              <div key={idx} className="border-b py-2">
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: step.instruction }}
                />
                <div className="text-xs text-gray-500">
                  {step.distance} • {step.duration}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default LiveTracking;
