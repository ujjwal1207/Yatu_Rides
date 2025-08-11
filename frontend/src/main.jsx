import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import Captainlogin from "./pages/Captainlogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";
import { UserContextProvider } from "./context/usercontext.jsx"; // adjust path as needed
import Start from "./pages/Start.jsx";
import UserProtectWrapper from "./pages/UserProtectedWrapper.jsx";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper.jsx";
import CaptainContextProvider from "./context/CaptainContext.jsx";
import Riding from "./pages/Riding.jsx";
import CaptainStart from "./pages/CaptainStart.jsx";
import CaptainRiding from "./pages/CaptainRiding.jsx";
import SocketProvider from "./context/SocketContext.jsx";

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <UserLogin />,
      },
      {
        path: "captain-login",
        element: <Captainlogin />,
      },
      {
        path: "signup",
        element: <UserSignup />,
      },
      {
        path: "captain-signup",
        element: <CaptainSignup />,
      },
      {
        path: "start",
        element: (
          <UserProtectWrapper>
            <Start />
          </UserProtectWrapper>
        ),
      },
      {
        path: "captain-start",
        element: (
          <CaptainProtectedWrapper>
            <CaptainStart />
          </CaptainProtectedWrapper>
        ),
      },
      {
        path: "riding",
        element: (
          <UserProtectWrapper>
            <Riding />
          </UserProtectWrapper>
        ),
      },
      {
        path: "captain-riding",
        element: (
          <CaptainProtectedWrapper>
            <CaptainRiding />
          </CaptainProtectedWrapper>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <CaptainContextProvider>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </CaptainContextProvider>
  </SocketProvider>
);
