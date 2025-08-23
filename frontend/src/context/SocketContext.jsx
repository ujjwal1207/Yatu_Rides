import React, { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

// Use the new environment variable that points to your live backend
const socket = io(import.meta.env.VITE_BASE);

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;