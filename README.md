# Maqsad Backend API

Express.js backend for **Maqsad**, a B2B marketplace platform that connects beneficiaries with service providers through RFPs, proposals, provider profiles, messaging, notifications, and dashboard views.

The backend is aligned with the provided ERD schema and uses local email/password authentication with role-based access control.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Main Features](#main-features)
- [User Roles](#user-roles)
- [Database Models](#database-models)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Example Auth Payloads](#example-auth-payloads)
- [Database Notes](#database-notes)
- [Development Notes](#development-notes)
- [Current Status](#current-status)

---

## Overview

Maqsad Backend provides the API layer for a marketplace workflow where beneficiaries can publish RFPs and providers can submit proposals.

The system supports the following flow:

1. Users register or log in using email and password.
2. Users are assigned roles such as beneficiary, provider, or admin.
3. Beneficiaries create and manage RFPs.
4. Providers browse available RFPs.
5. Providers submit proposals to relevant RFPs.
6. Beneficiaries review proposals and update their statuses.
7. Dashboard endpoints provide summaries, feeds, and notifications.
8. Supporting entities such as message threads, messages, profile views, and matching scores are modeled for future frontend integration.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **Sequelize ORM**
- **SQLite**
- **express-session**
- **bcrypt**
- **dotenv**
- **uuid**

---

## Main Features

- Local email/password authentication
- Session-based login and logout
- Role-based access control
- Beneficiary and provider profile management
- RFP creation, browsing, updating, and proposal submission
- Proposal management and proposal status updates
- Dashboard summary, feed, and notifications
- ERD-aligned Sequelize models
- SQLite database persistence
- Message thread and notification models ready for frontend integration

---

## User Roles

The backend supports the following roles:

| Role | Description |
|---|---|
| `beneficiary` | Can create RFPs, manage own requests, and review proposals |
| `provider` | Can manage provider profile, browse RFPs, and submit proposals |
| `admin` | Can manage users and role-related operations |

> Note: User registration currently supports beneficiary and provider roles. Admin role management is handled through protected user role endpoints.

---

## Database Models

The backend data layer is aligned with the Maqsad ERD and includes the following models:

- `User`
- `EmailVerification`
- `PasswordReset`
- `BeneficiaryProfile`
- `ProviderProfile`
- `RFP`
- `Proposal`
- `MessageThread`
- `Message`
- `Notification`
- `ProfileView`
- `MatchingScore`

---

## Project Structure

```txt
Maqsad_DEPI/
│
├── src/
│   ├── app.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── serviceRequest.js
│   │   ├── proposal.js
│   │   ├── provider.js
│   │   ├── beneficiaryProfile.js
│   │   ├── emailVerification.js
│   │   ├── passwordReset.js
│   │   ├── messageThread.js
│   │   ├── message.js
│   │   ├── notification.js
│   │   ├── profileView.js
│   │   └── matchingScore.js
│   │
│   └── routes/
│       ├── auth.js
│       ├── requests.js
│       ├── providers.js
│       ├── proposals.js
│       ├── users.js
│       └── dashboard.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sherifahmedeisa/Maqsad_DEPI.git
cd Maqsad_DEPI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Copy `.env.example` into a new `.env` file.

On Windows PowerShell:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

### 4. Start the server

```bash
npm start
```

The backend should run on:

```txt
http://localhost:4000
```

You can test that the server is running by opening:

```txt
http://localhost:4000/
```

Expected response:

```json
{
  "message": "Maqsad backend is running."
}
```

---

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`.

Recommended local configuration:

```env
PORT=4000
SESSION_SECRET=replace-with-a-secure-secret
BASE_URL=http://localhost:4000
```

The current `.env.example` may still include old OAuth variables:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

These variables are not required for the current local email/password authentication flow unless OAuth login is added again later.

---

## Available Scripts

### Start the server

```bash
npm start
```

### Start development mode

```bash
npm run dev
```

> `npm run dev` uses `nodemon`, so make sure dev dependencies are installed if needed.

---

## API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in using email and password |
| `POST` | `/auth/logout` | Log out the current user |
| `GET` | `/auth/status` | Check current authentication status |
| `POST` | `/auth/request-password-reset` | Request password reset token |
| `POST` | `/auth/reset-password` | Reset password using token |
| `POST` | `/auth/verify-email` | Verify user email using token |

---

## Requests / RFPs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/requests` | Get all available RFPs |
| `GET` | `/api/requests/me` | Get RFPs created by the logged-in beneficiary |
| `POST` | `/api/requests` | Create a new RFP |
| `GET` | `/api/requests/:id` | Get RFP details by ID |
| `PUT` | `/api/requests/:id` | Update an existing RFP |
| `POST` | `/api/requests/:id/proposals` | Submit a proposal to an RFP |
| `GET` | `/api/requests/:id/proposals` | Get proposals submitted to an RFP |

---

## Providers

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/providers` | Get all provider profiles |
| `GET` | `/api/providers/me` | Get current provider profile |
| `PUT` | `/api/providers/me` | Update current provider profile |
| `GET` | `/api/providers/:id` | Get provider profile by ID |

---

## Proposals

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/proposals/mine` | Get proposals submitted by the logged-in provider |
| `GET` | `/api/proposals/:id` | Get proposal details by ID |
| `PUT` | `/api/proposals/:id` | Update a proposal |
| `PATCH` | `/api/proposals/:id/status` | Update proposal status |
| `GET` | `/api/proposals/rfp/:rfpId` | Get all proposals for a specific RFP |

---

## Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/summary` | Get dashboard statistics |
| `GET` | `/api/dashboard/feed` | Get activity feed |
| `GET` | `/api/dashboard/notifications` | Get user notifications |

---

## Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/me` | Get current logged-in user data |
| `PUT` | `/api/users/me` | Update current logged-in user data |
| `PUT` | `/api/users/:id/role` | Update a user's role |

---

## Example Auth Payloads

### Register

```json
{
  "fullName": "Example User",
  "email": "user@example.com",
  "password": "StrongPassword123",
  "role": "beneficiary"
}
```

Allowed registration roles:

```txt
beneficiary
provider
```

### Login

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

### Request Password Reset

```json
{
  "email": "user@example.com"
}
```

### Reset Password

```json
{
  "token": "reset-token-here",
  "password": "NewStrongPassword123"
}
```

### Verify Email

```json
{
  "token": "verification-token-here"
}
```

---

## Database Notes

This project currently uses **SQLite**, which is a relational SQL database.

The backend uses **Sequelize** as the ORM layer to define:

- Models
- Associations
- Database synchronization
- Query operations

The SQLite database file is generated locally inside the project during development.

During startup, the app initializes the database and attempts to sync the schema. In development, the sync logic can rebuild the schema if an old incompatible SQLite table structure causes migration issues.

> Important: Rebuilding the database can delete local development data. This is acceptable during development but should not be used in production with real user data.

---

## ERD Relationships

The backend models include relationships such as:

- User → Email Verifications
- User → Password Resets
- User → Beneficiary Profile
- User → Provider Profile
- User → RFPs
- User → Proposals
- User → Notifications
- User → Profile Views
- RFP → Proposals
- RFP → Message Threads
- RFP → Matching Scores
- Message Thread → Messages

These associations make the backend easier to query and keep the implementation aligned with the ERD.

---

## Development Notes

Before committing code, make sure the following files and folders are ignored:

```txt
node_modules/
.env
*.sqlite
*.db
```

Recommended Git workflow:

```bash
git status
git add .
git commit -m "Update Maqsad backend implementation"
git push origin main
```

For README-only changes:

```bash
git add README.md
git commit -m "Improve README documentation"
git push origin main
```

---

## Current Status

- Backend starts successfully on `http://localhost:4000`
- Local email/password authentication is implemented
- Session-based login/logout is implemented
- Role-based access control is available
- ERD-aligned Sequelize models are created
- RFP, proposal, provider, user, and dashboard APIs are available
- SQLite database persistence is configured
- Backend is ready for frontend integration and API testing

---

