import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function UserLogout() {
  const token = localStorage.getItem("token");
    const navigate = useNavigate(); // Store the navigate function

  axios.get("/users/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response)=>{
    if(response.status === 200) {
      localStorage.removeItem("token"); // Remove the token from localStorage
        navigate("/login"); // Redirect to login page
    }
  })

  return <div>UserLogout</div>;
}

export default UserLogout;
