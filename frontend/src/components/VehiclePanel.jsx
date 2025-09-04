import React from "react";

function VehiclePanel(props) {
  if (!props.fare) {
    return <div className="text-center py-8">Loading fares...</div>;
  }

  return (
    <div>
      <h3 className="text-2xl semibold mb-5">Choose a vehicle</h3>
      <div
        onClick={() => {
          props.selectVehicleType('car')
          props.setConfirmRidePanel(true);
          props.setvehiclepanelopen(false);
        }}
        className="flex w-full border-2 border-gray-300 hover:border-black bg-gray-100 hover:bg-gray-200 rounded-xl mb-2 p-3 items-center justify-between"
      >
        <img
          className="h-20"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_851/v1707429809/assets/2a/9fe873-1f16-4c89-ba41-2712211380a9/original/UberBlack.png"
          alt=""
        />
        <div className="ml-1 w-1/2">
          <h4 className="font-medium text-lg">
            ZipzapGo
              <span>
                <i className="ri-user-3-fill"></i> 4
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs mt-1.5 text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.car}</h2>
      </div>
      <div
        onClick={() => {
          props.selectVehicleType('bike')
          props.setConfirmRidePanel(true);
          props.setvehiclepanelopen(false);
        }}
        className="flex w-full border-2 border-gray-300 hover:border-black bg-gray-100 hover:bg-gray-200 rounded-xl mb-2 p-3 items-center justify-between"
      >
        <img
          className="h-20"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
          alt=""
        />
        <div className="ml-1 w-1/2">
          <h4 className="font-medium text-lg">
            Zipbike 
            <span>
              <i className="ri-user-3-fill"></i> 2
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs mt-1.5 text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.bike}</h2>
      </div>
      <div
        onClick={() => {
          props.selectVehicleType('auto')
          props.setConfirmRidePanel(true);
          props.setvehiclepanelopen(false);
        }}
        className="flex w-full border-2 border-gray-300 hover:border-black bg-gray-100 hover:bg-gray-200 rounded-xl mb-2 p-3 items-center justify-between"
      >
        <img
          className="h-20"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
          alt=""
        />
        <div className="ml-1 w-1/2">
          <h4 className="font-medium text-lg">
            ZipAuto
            <span>
              <i className="ri-user-3-fill"></i> 3
            </span>
          </h4>
          <h5 className="font-medium text-sm">2 mins away </h5>
          <p className="font-normal text-xs mt-1.5 text-gray-600">
            Affordable, compact rides
          </p>
        </div>
        <h2 className="text-lg font-semibold">₹{props.fare.auto}</h2>
      </div>
    </div>
  );
}

export default VehiclePanel;
