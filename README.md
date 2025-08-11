# YATURIDES- Ride Booking Platform 

A modern, real-time ride booking application built with the MERN stack (MongoDB, Express, React, Node.js), Vite, Socket.IO, and Google Maps.

---

## Tech Stack

- **React** – For building the user interface and managing state
- **Vite** – For fast development and build tooling
- **Tailwind CSS** – For utility-first, responsive styling
- **Express.js** – Backend API server
- **MongoDB** – Database for users, rides, and captains
- **Socket.IO** – Real-time communication for ride updates and notifications
- **Google Maps API** – For location search, suggestions, and live tracking
- **JWT Authentication** – Secure user and captain login

---

## Features

- User and Captain authentication (signup, login, logout)
- Book a ride by selecting pickup and destination locations
- Live ride tracking with real-time location updates
- Fare calculation based on distance and vehicle type
- Captain dashboard for accepting and completing rides
- Real-time notifications for new rides (Socket.IO)
- Google Maps integration for address suggestions and route display
- Route protection for authenticated actions
- Responsive and modern UI with Tailwind CSS

---

## How It Works

### Authentication

- Users and captains can sign up, log in, and log out.
- JWT tokens are used for secure authentication and route protection.

### Ride Booking

- Users enter pickup and destination addresses (with Google Maps suggestions).
- Fare is calculated and displayed for different vehicle types.
- On confirmation, a ride is created and nearby captains are notified in real-time.

### Live Tracking

- Once a captain accepts a ride, both user and captain can track the ride live on Google Maps.
- The route from pickup to destination is highlighted, with markers for both points.

### Captain Panel

- Captains receive ride requests in real-time.
- Can accept, start, and complete rides.
- See live user location and route.

---

## Key React Concepts Used

- **React Context & Hooks:** For authentication, socket, and user/captain state.
- **Custom Components:** Modular UI with reusable components (LiveTracking, ConfirmRide, etc).
- **React Router:** For client-side routing and route protection.

---

## Usage

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd MERN