# Connexa Social Media App

A full-stack social media application with real-time chat, friend requests, group management, post feeds, notifications, and media uploads.

## 🚀 Project Overview

This project includes:
- `backend/` — Express.js API server with MongoDB, authentication, file uploads, socket-powered chat, and social features.
- `frontend/` — React + Vite single-page application with Redux state management, Tailwind CSS, routing, and real-time UI updates.

## ✨ Key Features

- User authentication and authorization
- Profile management and edit profile flow
- Friend search, friend requests, and friendship status
- Feed posts with comments and media uploads
- Real-time messaging and conversations using Socket.IO
- Group creation, join requests, membership management, and group chat
- Notification system for friend requests, messages, and group events
- Responsive UI with modern component-based architecture

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT authentication
- Cloudinary integration for media uploads
- Multer for file handling
- Express Validator for request validation
- Helmet and rate limiting for security

### Frontend
- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Socket.IO client
- Axios
- Radix UI components
- React Hook Form
- Sonner notifications

## 📁 Folder Structure

### Root
- `backend/` — API server code
- `frontend/` — React application

### Backend
- `config/` — database and other configuration
- `controllers/` — request handlers for users, posts, messages, notifications, groups, and friends
- `middlewares/` — auth, validation, rate limiting, file upload handling
- `models/` — Mongoose schemas
- `routes/` — API routes definitions
- `socket/` — Socket.IO event handling
- `utils/` — Cloudinary helper and other utilities

### Frontend
- `src/components/` — reusable UI components and feature-specific components
- `src/features/` — feature slices and hooks for auth, friends, messaging, groups, notifications, and posts
- `src/hooks/` — custom React hooks
- `src/lib/` — utility functions
- `src/pages/` — application page views
- `src/redux/` — store setup and root reducer
- `src/services/` — API client and socket client

## ⚙️ Environment Variables

Create a `.env` file in `backend/` using the following values from `.env.example`:

```env
MONGO_URI=/connexa
JWT_SECRET=
FRONTEND_URL=http://localhost:5173
PORT=5000

API_SECRET=
API_KEY=
CLOUD_NAME=
```

> If you use Cloudinary, also add your Cloudinary credentials as required by the upload utility, such as `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.

## 🚧 Setup Instructions

### Backend

```bash
cd backend
npm install
cp .env.example .env
# update .env with your values
npm run dev
```

The backend runs by default on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs by default on `http://localhost:5173`.

## 🧪 Recommended Development Flow

1. Start MongoDB locally or connect to a hosted MongoDB Atlas cluster.
2. Configure backend `.env` values.
3. Start backend server.
4. Start frontend app.
5. Open the frontend URL and use the app features.

## 📌 Notes

- The app uses socket-based real-time messaging and notifications.
- `backend/` contains all API endpoints and socket event handling.
- `frontend/` contains the full client UI, pages, and state management.

## 📚 Useful Scripts

### Backend
- `npm run dev` — start backend with `nodemon`
- `npm start` — run backend with Node.js

### Frontend
- `npm run dev` — start Vite development server
- `npm run build` — build production bundle
- `npm run preview` — preview built frontend
- `npm run lint` — run ESLint checks
