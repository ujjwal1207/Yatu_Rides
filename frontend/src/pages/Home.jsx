import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className=" bg-cover bg-[url(https://images.unsplash.com/photo-1695066584644-5453334ff5ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] pt-8 h-screen w-full bg-red-400 flex flex-col justify-between">
        <img className="w-22 ml-7" src="/zipride user.png" alt="" />
        <div className="bg-white py-4 px-4 pb-7">
            <h2 className=" text-3xl font-bold">Get Started with your ride</h2>
            <Link to="/login" className=" flex justify-center items-center text-xl font-medium w-full bg-black text-white py-3 rounded mt-5 ">Let's Ride</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
