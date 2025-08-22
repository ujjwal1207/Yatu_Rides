import React, { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(import.meta.env.VITE_BASE || "http://localhost:3000");

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;