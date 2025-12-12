# Trip Coach Backend - REST API for Travel Platform

This is a trip booking platform where tourists can search and book travel packages offered by local guides.

## 🚀 Live Demo

> [Trip Coach](https://0337-trip-coach-frontend-assignment.vercel.app)

> Frontend: [Trip Coach Client](https://github.com/Md-Firoz-Mahmud-Nur/0337-Trip_Coach_Frontend-Assignment_08-L2_M08_m_073-A_08-D_29_11_2025)

> Backend: [Trip Coach Server](https://github.com/Md-Firoz-Mahmud-Nur/0336-Trip_Coach_Backend-Assignment_08-L2_M08_m_073-A_08-D_29_11_2025)


## Features

*   Authentication & Authorization
    +   User registration and login with secure password handling.
    +   Role-based access control for ADMIN, GUIDE, and TOURIST.
    +   Protected routes for admin dashboards and guide-only actions.

*   User & Guide Management
    +   CRUD operations for users (admin only).
    +   Guide application endpoint (/user/apply-guide) with validation.
    +   Pending guide list, approve (/user/approve/:id) and reject (/user/reject/:id) endpoints.

*   Tour Packages
    +   CRUD APIs for travel packages.
    +   Get all packages, single package, and guide-specific packages (/package/my/:guideId).
    +   Fields for pricing, dates, itinerary, amenities, tags, and package types.

*   Bookings & Payments
    +   Booking creation and status management (PENDING, CONFIRMED, etc.).
    +   User-specific bookings and admin access to all bookings.
    +   Basic revenue-related fields (e.g., totalAmount, paymentStatus).

*   Validation & Error Handling
    +   Request validation using schemas (e.g., Zod/Joi/class-validator, depending on implementation).
    +   Standardized error responses for validation, auth, and server errors.

## Technology Stack

*   Runtime & Framework
    +   Node.js
    +   Express.js (or similar HTTP framework) for REST API routing.

*   Database & ORM/ODM
    +   MongoDB with Mongoose (or your chosen database/ORM - adjust to match your codebase).

*   Authentication & Security
    +   JSON Web Tokens (JWT) or cookie-based auth for protected routes.
    +   Role-based middleware (e.g., requireAuth, requireRole("ADMIN")).

*   Validation & Utilities
    +   Schema validation (Zod/Joi/class-validator).
    +   Centralized error handling middleware.

*   Tooling
    +   TypeScript for type safety (if configured).
    +   Nodemon / ts-node-dev for local development.
       

## API Endpoints

### Auth Routes

| Method | Endpoint                       | Description                   | Access        | 
|--------|--------------------------------|-------------------------------|---------------|
| POST   | `/api/v1/auth/login`           | login                         | Public        |
| POST   | `/api/v1/auth/refresh-token`   | Get new access token          | Public        |
| POST   | `/api/v1/auth/logout`          | logout                        | Authenticated |
| POST   | `/api/v1/auth/reset-password`  | Change user password          | Authenticated |

### User Routes

| Method | Endpoint                       | Description                   | Access        |
|--------|--------------------------------|-------------------------------|---------------|
| POST   | `/api/v1/user/register`        | Register a new user           | Public        |
| GET    | `/api/v1/user/all-users`       | Get all users                 | Admin         |
| GET    | `/api/v1/user/:id`             | Get a single user by ID       | Admin         |
| GET    | `/api/v1/user/me`              | Get current logged-in user    | Authenticated |
| PATCH  | `/api/v1/user/:id`             | Update user by ID             | Authenticated |

### Package Routes

| Method | Endpoint                        | Description                       | Access                  |
|--------|---------------------------------|-----------------------------------|-------------------------|
| POST   | `/api/v1/package/create-parcel` | Create a new package              | Sender                  |
| GET    | `/api/v1/package/all-parcel`    | Get all package                   | Admin                   |
| GET    | `/api/v1/package/mine`          | Get package created by guide      | Sender                  |
| GET    | `/api/v1/package/incoming`      | Get package destined for tourist  | Receiver                |
| GET    | `/api/v1/package/:trackingId`   | Get package by trackingId         | Admin & Authenticated   |
| PATCH  | `/api/v1/package/:trackingId`   | Update package status             | Admin & Sender          |

--- 


##  Local Setup

### 1️⃣ Clone & Install

```
git clone https://github.com/Md-Firoz-Mahmud-Nur/0336-Trip_Coach_Backend-Assignment_08-L2_M08_m_073-A_08-D_29_11_2025.git
cd 0336-Trip_Coach_Backend-Assignment_08-L2_M08_m_073-A_08-D_29_11_2025
npm install
```

### 2️⃣ Run Locally

```
npm run dev
```

## Environment Variables

Create a `.env` file in the project root and configure:

```bash
MONGO_DB_USER=
MONGO_DB_SECRET_KEY=
MONGO_DB_URI_SECRET_KEY=
PORT=5000
NODE_ENV=development
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRE=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRE=
BCRYPT_SALT_ROUND=
ADMIN_EMAIL=
ADMIN_PASSWORD=
FRONTEND_URL=http://localhost:3000
```

## 👨‍💻 Developed by

### Md. Firoz Mahmud Nur

Full-Stack Web Developer

> 📧 firoznur5@gmail.com

> 📧 [Portfolio](https://nurweb.dev)
 
> 🔗 [LinkedIn](https://www.linkedin.com/in/md-firoz-mahmud-nur)
