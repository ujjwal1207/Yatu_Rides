import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedWrapper = ({ children }) => {
  const captaintoken = localStorage.getItem("captaintoken");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!captaintoken) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${captaintoken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCaptain(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("captaintoken");
        navigate("/login");
      });
  }, [captaintoken, setCaptain, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
