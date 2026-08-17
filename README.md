# ✈️ SkySafar — World Flight Ticket Booking (MERN)

This project is a conversion of the original **Flask + MySQL** online ticket
booking app into a full **MERN** stack application:

- **M**ongoDB — database storing world-flight information
- **E**xpress — REST API backend
- **R**eact — frontend (landing page + ticket information page)
- **N**ode.js — runtime

The app lets a visitor search worldwide flights, book a ticket, and view their
e-ticket — with a sign-up / login flow.

---

## 📁 Project structure

```
Online_Ticket_Booking/
├── server/                 # Express + MongoDB backend
│   ├── server.js           # entry point
│   ├── seed.js             # CLI script: generates random world-flight data
│   ├── seedData.js         # reusable seed logic (used by server + seed.js)
│   ├── randomData.js       # world airports / airlines / flight generator
│   ├── config/db.js        # Mongoose connection
│   ├── dal/                # data-access layer
│   │   ├── index.js        # backend dispatcher
│   │   ├── mongoDal.js     # MongoDB (Mongoose) implementation
│   │   └── memoryDal.js    # in-memory fallback (zero-setup demo)
│   ├── models/             # Flight, Booking, User Mongoose models
│   ├── routes/             # flights, bookings, users API routes
│   └── .env                # configuration
│
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── App.jsx         # routing
│   │   ├── AuthContext.jsx # login/signup state
│   │   ├── api.js          # API wrapper (relative URLs, uses Vite proxy)
│   │   ├── components/     # Header, FlightCard, AuthModal
│   │   └── pages/
│   │       ├── Landing.jsx     # landing page
│   │       ├── Booking.jsx     # search + book a flight
│   │       └── TicketInfo.jsx  # ticket information page
│   ├── vite.config.js      # dev server + /api proxy
│   └── index.html
│
└── legacy-flask/           # original Flask/MySQL app (kept for reference)
```

---

## 🚀 Running the app

### 1. Backend (Express + MongoDB)

```bash
cd server
npm install
npm start        # or: npm run dev   (nodemon)
```

By default (`server/.env` has `MONGO_URI` commented out) the server runs in a
**zero-setup demo mode** using an in-memory store and auto-seeds ~120 random
world flights — no MongoDB install needed.

**To use a real MongoDB**, uncomment `MONGO_URI` in `server/.env` and point it
at your local MongoDB or Atlas connection string:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/world_flights
# or
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/world_flights
```

### 2. Generate random flight data (optional)

```bash
cd server
node seed.js        # seeds 120 random world flights
node seed.js 300    # custom count
```

> When running against a real MongoDB, the server also auto-seeds once on
> first start if the database is empty.

### 3. Frontend (React)

```bash
cd client
npm install
npm run dev
```

Open the printed URL (default `http://localhost:5173`). The Vite dev server
proxies `/api` to the backend, so the browser never needs a hard-coded address.

---

## 🧭 Pages

| Route                 | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `/`                   | **Landing page** — hero, flight search, featured flights, features |
| `/book`               | **Booking** — search world flights, select, enter passenger details, confirm |
| `/ticket`             | **Ticket information** — look up a ticket by booking reference |
| `/ticket/:ref`        | **Ticket** — full e-ticket for a booking reference      |

---

## 🔌 API endpoints

| Method | Endpoint              | Description                                    |
| ------ | --------------------- | ---------------------------------------------- |
| GET    | `/api/health`         | Health check                                   |
| GET    | `/api/flights`        | List flights (`?origin=&destination=&date=&airline=&cabinClass=`) |
| GET    | `/api/flights/airports` | Unique airports for dropdowns                |
| GET    | `/api/flights/:id`    | Single flight                                  |
| POST   | `/api/bookings`       | Create a booking / issue a ticket              |
| GET    | `/api/bookings`       | List bookings                                  |
| GET    | `/api/bookings/:ref`  | Fetch a ticket by booking reference            |
| POST   | `/api/users/signup`   | Register a user                                |
| POST   | `/api/users/login`    | Log in                                         |

---

## 🛢️ Data model

- **Flight** — `flightNumber`, `airline`, `origin`/`destination`
  (`city`, `country`, IATA `code`, `airport`), `departureTime`, `arrivalTime`,
  `durationMinutes`, `price`, `cabinClass`, `seatsAvailable`, `gate`.
- **Booking** — `bookingRef`, flight snapshot, `passenger`, `fareType`
  (one-way / round-trip), `seatsBooked`, `totalPrice`, `status`.
- **User** — name, username, email, password, phone.

> **Security note:** the demo stores passwords in plain text for parity with the
> original app. For a real deployment, hash passwords with `bcrypt` before saving.

---

## 🧰 Tech stack

- **Backend:** Node.js, Express, Mongoose, dotenv, cors, nanoid
- **Frontend:** React 18, React Router 6, Vite
- **Database:** MongoDB (Mongoose), with an in-memory fallback for zero-setup demos
