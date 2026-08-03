# LocalFinder

> A modern, full-stack local service discovery and booking platform built with the MERN stack and Next.js.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

---

## 📌 Overview

**LocalFinder** bridges the gap between home service seekers and verified local professionals (plumbers, electricians, cleaners, etc.). It features two dedicated Next.js web applications — one for customers and one for service providers — backed by a RESTful Express server, real-time WebSocket communication, and MongoDB geospatial querying.

---

## 🚀 Key Features

- 📍 **Geospatial Provider Discovery:** Distance-based provider search using MongoDB `2dsphere` indexes and `$geoNear` aggregation sorted by real kilometer distance.
- 💬 **Room-Based Real-Time Chat:** Socket.IO messaging scoped per service request, persisted to MongoDB for complete chat history.
- 📋 **Service Booking & Live Tracking:** Full request status lifecycle (`Pending` → `Assigned` → `In Progress` → `Completed` → `Cancelled`) with live provider location and ETA tracking.
- 🧾 **Itemized Invoicing:** Automatic invoice generation (`INV-XXXX`) with line items, tax rates, and discounts.
- ⭐ **Rating & Review System:** Atomic review submissions updating provider ratings and total job counters.
- 👥 **Dual-Portal Architecture:** Purpose-built Next.js portals for both customers and service providers.
- 🔐 **Role-Based Auth:** Secure stateless authentication using JSON Web Tokens (JWT) and bcrypt password hashing.

---

## 🛠️ Tech Stack

- **Frontend (Customer & Provider Portals):** Next.js 16 (React 19), TypeScript, Tailwind CSS, Leaflet / React-Leaflet, Socket.IO-Client
- **Backend:** Node.js, Express.js (v5), Socket.IO
- **Database:** MongoDB Atlas with Mongoose ODM (`2dsphere` index enabled)
- **Security:** JWT Authentication, Role Middleware, Bcryptjs

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                      Client Layer                      │
│   ┌──────────────────┐        ┌────────────────────┐   │
│   │  Customer Portal │        │  Provider Portal   │   │
│   │   (Next.js 16)   │        │    (Next.js 16)    │   │
│   └────────┬─────────┘        └──────────┬─────────┘   │
└────────────│─────────────────────────────│─────────────┘
             │ HTTP REST / Socket.IO       │ HTTP REST / Socket.IO
┌────────────▼─────────────────────────────▼─────────────┐
│                     Server Layer                       │
│             Node.js / Express API Gateway              │
│   ┌──────────┐   ┌────────────┐   ┌────────────────┐   │
│   │ REST API │   │ Socket.IO  │   │ Auth & Geo     │   │
│   │ Routers  │   │ WebSocket  │   │ Middleware     │   │
│   └──────────┘   └────────────┘   └────────────────┘   │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼─────────────────────────────┐
│                    Database Layer                      │
│                    MongoDB Atlas                       │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
.
├── Backend/                 # Express API server & Socket.IO backend
│   ├── controllers/         # Business logic (address, booking, etc.)
│   ├── middleware/          # JWT authentication & role authorization
│   ├── models/              # Mongoose schemas (User, Provider, Request, Review, Invoice, Chat, Address)
│   ├── routes/              # Express API route endpoints
│   └── server.js            # Main HTTP & Socket.IO server setup
│
└── Frontend/
    ├── nextjs/              # Customer Portal (Provider search, booking, tracking, chat)
    └── serviceprovider/     # Provider Portal (Dashboard, job management, invoices, profile)
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection string (Atlas or Local)

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file inside `Backend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start server:
```bash
node server.js
# Backend runs on http://localhost:5000
```

### 3. Customer Portal Setup
```bash
cd Frontend/nextjs
npm install
npm run dev
# Customer Portal runs on http://localhost:3000
```

### 4. Provider Portal Setup
```bash
cd Frontend/serviceprovider
npm install
npm run dev
# Provider Portal runs on http://localhost:3001
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
