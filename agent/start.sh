#!/bin/bash

# Function to handle cleanup on script termination
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

# Start the backend API server
echo "Starting backend API server..."
cd "$(dirname "$0")"
node src/server.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start the frontend development server
echo "Starting frontend development server..."
cd ../frontend
npm run dev -- -p 3001 &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 