# 🎬 CineBook — Movie Ticket Booking App

> A full-stack, real-time movie ticket booking web application built with **React**, **Convex**, **Node.js**, **Socket.IO**, and **TailwindCSS**.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-Database-F26522?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Application Routes](#-application-routes)
- [API & Real-Time Events](#-api--real-time-events)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

---

## 🌟 Overview

**CineBook** is a modern, full-stack movie ticket booking platform. Users can browse movies that are currently playing or upcoming, view showtimes at various theatres, select seats in real-time (with live seat locking to prevent double-booking), proceed to checkout, and download/view their booking confirmation with a QR code.

The application supports **Google OAuth** and **JWT-based email/password** authentication. An **Admin Dashboard** allows privileged users to manage movies, theatres, and showtimes.

---

## ✨ Features

### 🎟️ User-Facing
| Feature | Description |
|---|---|
| 🏠 **Home Page** | Browse "Now Playing" and "Upcoming" movies fetched from Convex |
| 🎞️ **Movie Details** | View poster, backdrop, overview, release date, genres, runtime, and rating |
| 🕒 **Showtimes** | Browse showtimes by theatre and date for a specific movie |
| 💺 **Seat Selection** | Interactive grid seat map with real-time locking; booked/locked seats shown live |
| 🛒 **Checkout** | Order summary, total price calculation, and booking confirmation |
| 👤 **User Profile** | View profile info and full booking history with QR codes |
| 🎫 **QR Code Tickets** | Each confirmed booking generates a downloadable QR code ticket |

### 🔐 Authentication
- **Google OAuth** via `@react-oauth/google`
- **Email + Password** login (JWT-based)
- Role-based access control: `user` and `admin` roles

### 🛡️ Admin Dashboard
- Manage Movies (add, edit, view)
- Manage Theatres
- Manage Showtimes (assign movie, theatre, screen, seats layout, time & price)

### ⚡ Real-Time Features
- **Live seat locking** via Socket.IO — when a user starts selecting seats, those seats are temporarily locked for others
- Locks auto-expire after **5 minutes** via a server-side interval cleanup

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **TailwindCSS 3** | Utility-first CSS styling |
| **React Router DOM v7** | Client-side routing |
| **Convex** | Real-time database & backend functions |
| **Socket.IO Client** | Real-time seat locking |
| **@react-oauth/google** | Google OAuth integration |
| **jwt-decode** | Decoding JWT tokens on the client |
| **qrcode.react** | Generating QR codes for booking tickets |
| **lucide-react** | Icon library |
| **axios** | HTTP client for backend API calls |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | HTTP web framework |
| **Socket.IO 4** | WebSocket server for real-time seat locking |
| **jsonwebtoken** | JWT token generation & verification |
| **bcryptjs** | Password hashing |
| **google-auth-library** | Verifying Google OAuth tokens on the server |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing middleware |
| **nodemon** | Auto-restart during development |

### Database
| Technology | Purpose |
|---|---|
| **Convex** | Primary cloud database — stores users, movies, theatres, showtimes, and bookings |

---

## 📁 Project Structure

```
Movie ticket booking/
├── backend/                        # Node.js + Express + Socket.IO server
│   ├── middleware/                 # Auth middleware (JWT verification)
│   ├── models/                     # Mongoose models (legacy/reference)
│   │   ├── Booking.js
│   │   ├── Movie.js
│   │   ├── Showtime.js
│   │   ├── Theatre.js
│   │   └── User.js
│   ├── routes/                     # Express route handlers
│   ├── server.js                   # Main server entry point (Socket.IO + Express)
│   ├── seed.js                     # Database seeding script
│   ├── package.json
│   └── .env                        # Backend environment variables
│
└── frontend/                       # React + Vite + Convex frontend
    ├── convex/                     # Convex backend functions & schema
    │   ├── schema.js               # Database schema definition
    │   ├── movies.js               # Movie queries and mutations
    │   ├── theatres.js             # Theatre queries and mutations
    │   ├── showtimes.js            # Showtime queries and mutations
    │   ├── bookings.js             # Booking queries and mutations
    │   ├── users.js                # User queries and mutations
    │   └── seed.js                 # Convex data seeding
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx          # Top navigation bar
    │   ├── context/                # React context (Auth, etc.)
    │   ├── pages/
    │   │   ├── Home.jsx            # Movie listing (Now Playing / Upcoming)
    │   │   ├── MovieDetails.jsx    # Single movie detail view
    │   │   ├── Showtimes.jsx       # Showtimes for a movie
    │   │   ├── SeatSelection.jsx   # Interactive seat map
    │   │   ├── Checkout.jsx        # Booking summary & confirmation
    │   │   ├── Profile.jsx         # User profile & booking history
    │   │   └── AdminDashboard.jsx  # Admin panel
    │   ├── App.jsx                 # Root component with routes
    │   ├── main.jsx                # React + Convex provider entry point
    │   └── index.css               # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── .env.local                  # Frontend environment variables
```

---

## 🗄️ Database Schema

The Convex schema defines **5 collections**:

### `users`
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Display name |
| `email` | `string` | Email address (indexed) |
| `password` | `string?` | Hashed password (optional, not set for Google users) |
| `googleId` | `string?` | Google OAuth ID (indexed) |
| `role` | `"user" \| "admin"` | Access level |
| `avatar` | `string?` | Profile avatar URL |

### `movies`
| Field | Type | Description |
|---|---|---|
| `title` | `string` | Movie title |
| `tmdbId` | `number?` | TMDB API ID |
| `overview` | `string?` | Movie synopsis |
| `posterPath` | `string?` | Poster image URL |
| `backdropPath` | `string?` | Backdrop image URL |
| `releaseDate` | `string?` | Release date string |
| `rating` | `number?` | Average rating |
| `genres` | `string[]?` | Array of genre names |
| `runtime` | `number?` | Runtime in minutes |
| `status` | `"Now Playing" \| "Upcoming"` | Display status |

### `theatres`
| Field | Type | Description |
|---|---|---|
| `name` | `string` | Theatre name |
| `location` | `string` | Full address |
| `city` | `string?` | City name |
| `totalScreens` | `number?` | Number of screens |

### `showtimes`
| Field | Type | Description |
|---|---|---|
| `movieId` | `Id<"movies">` | Reference to a movie |
| `theatreId` | `Id<"theatres">` | Reference to a theatre |
| `screen` | `string` | Screen identifier (e.g., "Screen 1") |
| `startTime` | `string` | ISO date-time string |
| `basePrice` | `number` | Ticket base price in ₹ |
| `layout` | `{ rows, cols }` | Seat grid dimensions |

### `bookings`
| Field | Type | Description |
|---|---|---|
| `userId` | `string` | The user who booked |
| `showtimeId` | `string` | The showtime booked |
| `movieTitle` | `string?` | Denormalized movie title |
| `theatreName` | `string?` | Denormalized theatre name |
| `seats` | `Seat[]` | Array of `{ row, col, seatId, price }` |
| `totalAmount` | `number` | Total booking amount in ₹ |
| `status` | `"Pending" \| "Confirmed" \| "Cancelled"` | Booking status |
| `paymentId` | `string?` | Payment reference ID |

---

## 🛣️ Application Routes

### Frontend (React Router)
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Browse all movies |
| `/movie/:id` | `MovieDetails` | Details for a specific movie |
| `/movie/:id/showtimes` | `Showtimes` | Showtimes for a movie |
| `/showtime/:id/seats` | `SeatSelection` | Choose seats for a showtime |
| `/checkout` | `Checkout` | Booking confirmation & payment |
| `/profile` | `Profile` | User profile & booking history |
| `/admin` | `AdminDashboard` | Admin-only management panel |

### Backend (Express)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |

---

## 📡 API & Real-Time Events

### Socket.IO Events

The backend (`server.js`) manages real-time seat locking using Socket.IO rooms — one room per `showtimeId`.

| Event (Client → Server) | Payload | Description |
|---|---|---|
| `join_showtime` | `showtimeId` | Join a showtime room to receive seat updates |
| `lock_seat` | `{ showtimeId, seatId, userId }` | Temporarily lock a seat during selection |
| `unlock_seat` | `{ showtimeId, seatId, userId }` | Release a previously locked seat |

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `initial_locked_seats` | `{ [seatId]: { userId, timestamp } }` | Sends current locked seats when joining |
| `seat_locked` | `{ showtimeId, seatId, userId }` | Broadcast when a seat is locked |
| `seat_unlocked` | `{ showtimeId, seatId }` | Broadcast when a seat is released |
| `seat_lock_failed` | `{ seatId, message }` | Sent if a seat is already locked |

> **Auto-expiry**: Seat locks older than **5 minutes** are automatically cleared by a server-side `setInterval` running every 60 seconds.

---

## 🔑 Environment Variables

### Backend — `backend/.env`
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend — `frontend/.env.local`
```env
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and **npm** installed
- A **Convex** account → [convex.dev](https://convex.dev)
- A **Google OAuth 2.0** Client ID from [Google Cloud Console](https://console.cloud.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/movie-ticket-booking.git
cd "movie-ticket-booking"
```

### 2. Setup the Backend
```bash
cd backend
npm install
# Create and fill in backend/.env (see Environment Variables above)
npm run dev
```
The backend server starts on **http://localhost:5000**.

### 3. Setup Convex
```bash
cd frontend
npm install
npx convex dev
```
This will prompt you to log in to Convex and link/create a project. It will populate `VITE_CONVEX_URL` in `.env.local` automatically.

### 4. Seed Initial Data (Optional)
```bash
# Inside the frontend directory, with convex dev running
node convex/seed.js
```

### 5. Start the Frontend
```bash
# In a new terminal, inside the frontend directory
npm run dev
```
The frontend starts on **http://localhost:5173** (Vite default).

---

## 📜 Scripts

### Frontend (`frontend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npx convex dev` | Start Convex dev server (sync functions & watch) |

### Backend (`backend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start backend with nodemon (auto-restart) |
| `npm start` | Start backend with node (production) |

---

## ☁️ Deployment

| Layer | Platform | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Set `VITE_CONVEX_URL` and `VITE_BACKEND_URL` in Vercel env vars |
| **Backend** | [Render](https://render.com) | Set `PORT`, `JWT_SECRET`, `GOOGLE_CLIENT_ID` in Render env vars |
| **Database** | [Convex Cloud](https://convex.dev) | Deploy Convex functions with `npx convex deploy` |

### Deploying Convex Functions
```bash
cd frontend
npx convex deploy
```

### Vercel Frontend Deployment
1. Push your code to GitHub.
2. Import the repo on Vercel, set the **Root Directory** to `frontend`.
3. Set all `VITE_*` environment variables.
4. Deploy.

### Render Backend Deployment
1. Create a new **Web Service** on Render, pointing to the `backend/` folder.
2. Set the **Start Command** to `npm start`.
3. Add all required environment variables.
4. Deploy.

---

## 🧩 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  React 19 + Vite + TailwindCSS + React Router + qrcode.react    │
│                                                                   │
│   ┌──────────────────────┐    ┌──────────────────────────────┐  │
│   │  Convex React Hooks  │    │   Socket.IO Client           │  │
│   │  (useQuery/          │    │   Real-Time Seat Locking     │  │
│   │   useMutation)       │    │                              │  │
│   └──────────┬───────────┘    └──────────────┬───────────────┘  │
└──────────────┼─────────────────────────────── ┼────────────────-┘
               │ HTTPS                           │ WebSocket
               ▼                                 ▼
┌──────────────────────────┐    ┌──────────────────────────────┐
│    CONVEX CLOUD           │    │  NODE.JS + EXPRESS BACKEND   │
│  (Real-time Database)     │    │  (Socket.IO Server)          │
│                           │    │                              │
│  • movies                 │    │  • /api/health               │
│  • theatres               │    │  • JWT Auth                  │
│  • showtimes              │    │  • Google OAuth verify       │
│  • bookings               │    │  • In-memory seat locks      │
│  • users                  │    │                              │
└──────────────────────────┘    └──────────────────────────────┘
```

---

## 👤 Author

**Swaraj Babu**
- GitHub: [@Swarajbabu](https://github.com/Swarajbabu)

---

## 📄 License

This project is licensed under the **ISC License**.

---

> Made with ❤️ and lots of ☕
