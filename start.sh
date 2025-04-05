#!/bin/bash

# Start the backend API server
echo "Starting the backend API server..."
cd agent
npx ts-node api-server.ts &
BACKEND_PID=$!

# Wait for the backend to start
echo "Waiting for the backend to start..."
sleep 3

# Start the frontend development server
echo "Starting the frontend development server..."
cd ../frontend
npm run dev -- -p 3001 &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Both servers are running. Press Ctrl+C to stop."
echo "Backend API server: http://localhost:3000"
echo "Frontend: http://localhost:3001"
wait 