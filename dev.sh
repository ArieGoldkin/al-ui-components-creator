#!/bin/bash

# AI Form Creator Development Script
# Alternative to npm run dev for users who prefer shell scripts

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to setup the project
setup_project() {
    print_status "Setting up AI Form Creator project..."

    # Check prerequisites
    if ! command_exists python3; then
        print_error "Python 3 is required but not installed."
        exit 1
    fi

    if ! command_exists node; then
        print_error "Node.js is required but not installed."
        exit 1
    fi

    # Check Node.js version
    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_NODE_VERSION="18.12.0"
    if ! command_exists pnpm; then
        print_error "pnpm is required but not installed."
        print_status "Node.js version: $NODE_VERSION (required: >= $REQUIRED_NODE_VERSION)"
        if [[ $(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1) != "$REQUIRED_NODE_VERSION" ]]; then
            print_error "Node.js version $NODE_VERSION is too old. Please upgrade to >= $REQUIRED_NODE_VERSION"
            print_status "You can upgrade Node.js from: https://nodejs.org/"
            exit 1
        fi
        print_status "Install pnpm with: npm install -g pnpm"
        print_status "Or use corepack: corepack enable && corepack prepare pnpm@latest --activate"
        exit 1
    fi
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "augment" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv augment
    fi
    
    # Activate virtual environment and install backend dependencies
    print_status "Installing backend dependencies..."
    source augment/bin/activate
    pip install -r backend/requirements.txt
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend && pnpm install && cd ..

    print_success "Project setup completed!"
}

# Function to start development servers
start_dev() {
    print_status "Starting AI Form Creator development environment..."

    # Check if ports are available
    if port_in_use 3000; then
        print_warning "Port 3000 is already in use. Frontend may not start properly."
    fi

    if port_in_use 5001; then
        print_warning "Port 5001 is already in use. Backend may not start properly."
    fi

    # Check if virtual environment exists
    if [ ! -d "augment" ]; then
        print_error "Virtual environment not found. Running setup first..."
        setup_project
    fi

    # Check if node_modules exists
    if [ ! -d "frontend/node_modules" ]; then
        print_error "Frontend dependencies not found. Installing..."
        cd frontend && pnpm install && cd ..
    fi

    print_status "Starting both backend and frontend servers..."
    print_status "Backend will be available at: http://localhost:5001"
    print_status "Frontend will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop both servers"

    # Use pnpm run dev which uses concurrently
    pnpm run dev
}

# Function to start only backend
start_backend() {
    print_status "Starting only the backend server..."
    
    if [ ! -d "augment" ]; then
        print_error "Virtual environment not found. Running setup first..."
        setup_project
    fi
    
    source augment/bin/activate
    cd backend && python app.py
}

# Function to start only frontend
start_frontend() {
    print_status "Starting only the frontend server..."

    if [ ! -d "frontend/node_modules" ]; then
        print_error "Frontend dependencies not found. Installing..."
        cd frontend && pnpm install && cd ..
    fi

    cd frontend && pnpm run dev
}

# Function to show help
show_help() {
    echo "AI Form Creator Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev, start          Start both backend and frontend servers (default)"
    echo "  backend             Start only the backend server"
    echo "  frontend            Start only the frontend server"
    echo "  setup               Set up the project (install dependencies)"
    echo "  clean               Clean build artifacts and caches"
    echo "  reset               Clean everything and setup from scratch"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Start development environment"
    echo "  $0 dev              # Start development environment"
    echo "  $0 backend          # Start only backend"
    echo "  $0 frontend         # Start only frontend"
    echo "  $0 setup            # Setup project"
    echo ""
}

# Function to clean the project
clean_project() {
    print_status "Cleaning project..."
    
    # Clean frontend
    if [ -d "frontend/node_modules" ]; then
        print_status "Removing frontend node_modules..."
        rm -rf frontend/node_modules
    fi
    
    if [ -d "frontend/dist" ]; then
        print_status "Removing frontend dist..."
        rm -rf frontend/dist
    fi
    
    # Clean backend
    print_status "Removing Python cache files..."
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
    
    print_success "Project cleaned!"
}

# Function to reset the project
reset_project() {
    print_status "Resetting project..."
    clean_project
    
    if [ -d "augment" ]; then
        print_status "Removing virtual environment..."
        rm -rf augment
    fi
    
    print_status "Setting up project from scratch..."
    setup_project
    
    print_success "Project reset completed!"
}

# Main script logic
case "${1:-dev}" in
    "dev"|"start"|"")
        start_dev
        ;;
    "backend")
        start_backend
        ;;
    "frontend")
        start_frontend
        ;;
    "setup")
        setup_project
        ;;
    "clean")
        clean_project
        ;;
    "reset")
        reset_project
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
