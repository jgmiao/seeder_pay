#!/bin/bash

# Kill any existing processes running on port 3000 (frontend) or 8080 (backend)
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null

echo "======================================"
echo "Starting Seeder Pay Services..."
echo "======================================"

echo "[1/2] Starting Backend (Go)..."
cd backend
go mod tidy
# Start backend in background
go run main.go &
BACKEND_PID=$!
cd ..

echo "[2/2] Starting Frontend (Next.js)..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "======================================"
echo "✅ Seeder Pay is successfully running!"
echo "📡 Backend API: http://localhost:8080"
echo "🌐 Frontend UI: http://localhost:3000"
echo "======================================"
echo "Press Ctrl+C to stop all services."

# Wait for Ctrl+C
trap 'echo -e "\nStopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait
