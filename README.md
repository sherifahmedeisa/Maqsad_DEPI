# Maqsad Backend

Express backend for the Maqsad B2B marketplace, aligned to the Maqsad ERD schema.

## Features

- Local email/password authentication
- Role-based access control: `beneficiary`, `provider`, `admin`
- RFP creation and browsing
- Provider profiles and proposal management
- User dashboard summary and notification support
- Sequelize models matching the ERD entities
- SQLite persistence

## Setup

1. Copy `.env.example` to `.env` and set values.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

## Authentication Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/status`
- `POST /auth/request-password-reset`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

## Main API Endpoints

- `GET /api/dashboard/summary`
- `GET /api/dashboard/feed`
- `GET /api/dashboard/notifications`
- `GET /api/requests`
- `GET /api/requests/me`
- `POST /api/requests`
- `GET /api/requests/:id`
- `PUT /api/requests/:id`
- `POST /api/requests/:id/proposals`
- `GET /api/requests/:id/proposals`
- `GET /api/providers`
- `GET /api/providers/me`
- `PUT /api/providers/me`
- `GET /api/providers/:id`
- `GET /api/proposals/mine`
- `GET /api/proposals/:id`
- `PUT /api/proposals/:id`
- `PATCH /api/proposals/:id/status`
- `GET /api/proposals/rfp/:rfpId`
- `GET /api/users/me`
- `PUT /api/users/me`
- `PUT /api/users/:id/role`

## Notes

This backend now uses an ERD-aligned model layer for users, beneficiary/provider profiles, RFPS, proposals, message threads, notifications, profile views, and matching scores.
