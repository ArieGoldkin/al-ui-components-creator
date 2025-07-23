#!/bin/bash

# AI Form Creator Setup Script
# Comprehensive setup script that checks prerequisites and installs everything needed

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${CYAN}[SETUP]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare version numbers
version_compare() {
    printf '%s\n' "$1" "$2" | sort -V | head -n1
}

# Function to check Node.js version
check_node_version() {
    local required_version="18.12.0"
    
    if ! command_exists node; then
        print_error "Node.js is not installed."
        print_status "Please install Node.js >= $required_version from: https://nodejs.org/"
        return 1
    fi
    
    local current_version=$(node --version | sed 's/v//')
    print_status "Current Node.js version: $current_version"
    
    if [[ $(version_compare "$required_version" "$current_version") != "$required_version" ]]; then
        print_error "Node.js version $current_version is too old."
        print_status "Required: >= $required_version"
        print_status "Please upgrade Node.js from: https://nodejs.org/"
        return 1
    fi
    
    print_success "Node.js version $current_version meets requirements"
    return 0
}

# Function to install pnpm
install_pnpm() {
    if command_exists pnpm; then
        local pnpm_version=$(pnpm --version)
        print_success "pnpm is already installed (version: $pnpm_version)"
        return 0
    fi
    
    print_status "Installing pnpm..."
    
    # Try corepack first (recommended for Node.js 16.13+)
    if command_exists corepack; then
        print_status "Using corepack to install pnpm..."
        corepack enable
        corepack prepare pnpm@latest --activate
        if command_exists pnpm; then
            print_success "pnpm installed successfully via corepack"
            return 0
        fi
    fi
    
    # Fallback to npm
    if command_exists npm; then
        print_status "Using npm to install pnpm globally..."
        npm install -g pnpm
        if command_exists pnpm; then
            print_success "pnpm installed successfully via npm"
            return 0
        fi
    fi
    
    # Fallback to standalone installer
    print_status "Using standalone installer..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    
    # Source the shell profile to make pnpm available
    if [ -f "$HOME/.bashrc" ]; then
        source "$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        source "$HOME/.zshrc"
    fi
    
    if command_exists pnpm; then
        print_success "pnpm installed successfully via standalone installer"
        return 0
    else
        print_error "Failed to install pnpm. Please install manually from: https://pnpm.io/installation"
        return 1
    fi
}

# Function to check Python version
check_python_version() {
    local required_version="3.9.0"
    
    if ! command_exists python3; then
        print_error "Python 3 is not installed."
        print_status "Please install Python >= $required_version from: https://python.org/"
        return 1
    fi
    
    local current_version=$(python3 --version | sed 's/Python //')
    print_status "Current Python version: $current_version"
    
    if [[ $(version_compare "$required_version" "$current_version") != "$required_version" ]]; then
        print_error "Python version $current_version is too old."
        print_status "Required: >= $required_version"
        print_status "Please upgrade Python from: https://python.org/"
        return 1
    fi
    
    print_success "Python version $current_version meets requirements"
    return 0
}

# Function to setup the project
setup_project() {
    print_header "Setting up AI Form Creator project..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
        print_error "This doesn't appear to be the AI Form Creator project directory."
        print_status "Please run this script from the project root directory."
        exit 1
    fi
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "augment" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv augment
    else
        print_status "Python virtual environment already exists"
    fi
    
    # Activate virtual environment and install backend dependencies
    print_status "Installing backend dependencies..."
    source augment/bin/activate
    pip install --upgrade pip
    pip install -r backend/requirements.txt
    
    # Install root-level dependencies (concurrently)
    print_status "Installing root-level dependencies..."
    pnpm install
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend && pnpm install && cd ..
    
    print_success "Project setup completed successfully!"
    print_status ""
    print_status "🚀 You can now start the development environment with:"
    print_status "   pnpm run dev"
    print_status ""
    print_status "📚 For more information, see:"
    print_status "   - README.md for quick start guide"
    print_status "   - DEVELOPMENT.md for detailed development workflows"
}

# Main setup function
main() {
    print_header "AI Form Creator - Comprehensive Setup"
    print_status "This script will check prerequisites and set up the development environment"
    print_status ""
    
    # Check prerequisites
    print_header "Checking Prerequisites..."
    
    local prerequisites_ok=true
    
    if ! check_node_version; then
        prerequisites_ok=false
    fi
    
    if ! check_python_version; then
        prerequisites_ok=false
    fi
    
    if [ "$prerequisites_ok" = false ]; then
        print_error "Prerequisites check failed. Please install the required software and try again."
        exit 1
    fi
    
    # Install pnpm
    print_header "Setting up pnpm..."
    if ! install_pnpm; then
        print_error "Failed to install pnpm. Please install it manually and try again."
        exit 1
    fi
    
    # Setup project
    print_header "Setting up project..."
    setup_project
    
    print_success "🎉 Setup completed successfully!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Start the development environment: pnpm run dev"
    print_status "2. Open your browser to: http://localhost:3000"
    print_status "3. The backend API will be available at: http://localhost:5001"
}

# Run main function
main "$@"
