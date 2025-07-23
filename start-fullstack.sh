#!/bin/bash

# AI Form Creator Full-Stack Development Environment Startup Script

echo "🚀 Starting AI Form Creator Full-Stack Development Environment..."
echo ""

# Check if virtual environment exists
if [ ! -d "augment" ]; then
    echo "❌ Virtual environment 'augment' not found!"
    echo "Please run: python3 -m venv augment"
    exit 1
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not found!"
    echo "Please run: cd frontend && pnpm install"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🔧 Starting Flask backend on localhost:5001..."
source augment/bin/activate
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

echo "⚛️  Starting React frontend on localhost:3000..."
cd frontend
source ~/.zshrc
pnpm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development environment started successfully!"
echo ""
echo "📍 Backend:  http://localhost:5001"
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait
