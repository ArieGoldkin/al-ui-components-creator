#!/bin/bash

# AI Form Creator Development Environment Startup Script

echo "🚀 Starting AI Form Creator Development Environment..."
echo ""

# Check if virtual environment exists
if [ ! -d "augment" ]; then
    echo "❌ Virtual environment 'augment' not found!"
    echo "Please run: python3 -m venv augment"
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment 'augment'..."
source augment/bin/activate

# Show environment info
echo "🐍 Python: $(python --version)"
echo "📦 pip: $(pip --version | cut -d' ' -f1-2)"

# Check if backend dependencies are installed
if [ ! -f "backend/app.py" ]; then
    echo "❌ Backend not found!"
    exit 1
fi

# Start Flask backend
echo "🔧 Starting Flask backend on localhost:5001..."
cd backend
python app.py
