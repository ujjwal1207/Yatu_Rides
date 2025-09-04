import React from "react";

function splitAddress(address) {
  if (!address) return ["", ""];
  const [headline, ...rest] = address.split(",");
  return [headline.trim(), rest.join(",").trim()];
}

function WaitingforRider(props) {
  const [pickupHeadline, pickupDetails] = splitAddress(props.ride?.pickup);
  const [destinationHeadline, destinationDetails] = splitAddress(
    props.ride?.destination
  );

  return (
    <div>
      <h5
        onClick={() => {
          props.setWaitingforRiderPanel(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <div className="flex items-center justify-between">
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.captain.fullname.firstname}
          </h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">
            {props.ride?.captain.vehicle.number}
          </h4>
          <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          <h1 className="text-lg font-semibold"> {props.ride?.otp} </h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{pickupHeadline}</h3>
              <p className="text-sm -mt-1 text-gray-600">{pickupDetails}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">{destinationHeadline}</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {destinationDetails}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare} </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash/Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingforRider;
