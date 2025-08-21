import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import Captainlogin from "./pages/Captainlogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";
import { UserContextProvider } from "./context/usercontext.jsx";
import Start from "./pages/Start.jsx";
import UserProtectWrapper from "./pages/UserProtectedWrapper.jsx";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper.jsx";
import CaptainContextProvider from "./context/CaptainContext.jsx";
import Riding from "./pages/Riding.jsx";
import CaptainStart from "./pages/CaptainStart.jsx";
import CaptainRiding from "./pages/CaptainRiding.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import CaptainProfile from "./pages/CaptainProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx"; // Import the new page

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <UserLogin /> },
      { path: "captain-login", element: <Captainlogin /> },
      { path: "signup", element: <UserSignup /> },
      { path: "captain-signup", element: <CaptainSignup /> },
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
      {
        path: "captain-profile",
        element: (
          <CaptainProtectedWrapper>
            <CaptainProfile />
          </CaptainProtectedWrapper>
        ),
      },
      {
        path: "user-profile",
        element: (
          <UserProtectWrapper>
            <UserProfile />
          </UserProtectWrapper>
        ),
      },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "forgot-password-captain", element: <ForgotPassword /> },
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
