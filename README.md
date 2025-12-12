# Trip Coach Backend - REST API for Travel Platform

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

## Setup Instructions

1. Clone the repository:

