import React, { useState, useEffect } from "react";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Helper function to calculate distance between two coordinates in kilometers
const haversine_distance = (mk1, mk2) => {
  if (!mk1 || !mk2) return 0;
  var R = 6371.0710; // Radius of the Earth in kilometers
  var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
  var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}


const LiveTracking = ({ pickup, destination, onDistanceChange, onDistanceToPickupChange }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [showPickupMarker, setShowPickupMarker] = useState(true);

  // Function to get coordinates from address strings
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE}/maps/get-coordinates`,
        {
          params: { address },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("captaintoken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching coordinates for:", address, error);
      return null;
    }
  };

  // Fetch coordinates for pickup and destination addresses once
  useEffect(() => {
    if (pickup) {
      getCoordinates(pickup).then(setPickupCoords);
    }
    if (destination) {
      getCoordinates(destination).then(setDestinationCoords);
    }
  }, [pickup, destination]);


  // Fetch the route between pickup and destination once coordinates are available
  useEffect(() => {
    if (!pickupCoords || !destinationCoords) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupCoords,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [pickupCoords, destinationCoords]);


  // Watch live location of the captain/user
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

        // Check distance to pickup and hide marker if close
        if (pickupCoords) {
            const distanceToPickup = haversine_distance(newPos, pickupCoords);
            if (onDistanceToPickupChange) {
                onDistanceToPickupChange(distanceToPickup);
            }
            if (distanceToPickup < 0.02) { // Hide if within 20 meters
                setShowPickupMarker(false);
            }
        }
        
        // Calculate distance to destination and pass it to the parent component
        if (destinationCoords && onDistanceChange) {
            const distanceToDestination = haversine_distance(newPos, destinationCoords);
            onDistanceChange(distanceToDestination);
        }
        
      },
      (error) => console.error("Error getting location", error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [pickupCoords, destinationCoords, onDistanceChange, onDistanceToPickupChange]);

  // Determine map center
  const mapCenter = currentPosition || pickupCoords || { lat: 20.5937, lng: 78.9629 };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="relative w-full h-full">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={15}
        >
          {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: true, preserveViewport: true }} />}
          {pickupCoords && showPickupMarker && (
            <Marker
              position={pickupCoords}
              label="P"
              title="Pickup"
            />
          )}
          {destinationCoords && (
            <Marker
              position={destinationCoords}
              label="D"
              title="Destination"
            />
          )}
          {currentPosition && <Marker position={currentPosition} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default LiveTracking;
