# Seeder Pay

A modern, comprehensive subscription and digital product management platform, serving as a functional application based on the Seeder.tw (formerly Recur) concept.

## 📁 Project Structure

This project follows a monorepo structure separating the frontend and backend applications to ensure high cohesion and loose coupling:

- `/frontend`: Next.js 15 application using React 19, Tailwind CSS v4, and Shadcn UI.
- `/backend`: Go application using Gin web framework and Gorm with SQLite.
- `/.agents`: Automation and workflow scripts.

## 🛠 Prerequisites

- **Node.js** (v20 or higher)
- **Go** (1.25.6 or higher)

## 🚀 Quick Start

You can use the provided startup script to magically run both frontend and backend concurrently:

```bash
chmod +x start.sh
./start.sh
```

Alternatively, you can manually start them in separate terminal windows:

**1. Backend:**
```bash
cd backend
go mod tidy
go run main.go
```

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ✨ Features

- **Product Management:** Create and manage distinct products, digital goods, and subscription tiers.
- **Subscription Management:** Manage billing intervals (monthly/yearly), pricing models, and ongoing revenue.
- **Customer Portal:** Easily manage user records, active subscriptions, and payment history.
- **Checkout Experience:** High-converting, secure checkout pages optimized for digital products.

## 💻 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Shadcn UI
- **Backend:** Go, Gin, Gorm, SQLite
- **Architecture:** Clean Architecture principles in Go, Component-Driven Design in React.
