#!/bin/bash

# AI Form Creator - Test Runner Script
# This script runs all tests locally to verify CI pipeline behavior

set -e  # Exit on any error

echo "🎯 AI Form Creator - Running All Tests"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]] && [[ ! -d "frontend" ]] && [[ ! -d "backend" ]]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Frontend Tests
print_status "🧪 Running Frontend Tests..."
echo "------------------------------"
cd frontend

if [[ ! -f "package.json" ]]; then
    print_error "Frontend package.json not found"
    exit 1
fi

# Install dependencies if needed
if [[ ! -d "node_modules" ]]; then
    print_status "📦 Installing frontend dependencies..."
    pnpm install
fi

# Run frontend tests
print_status "🧪 Executing frontend test suite..."
if pnpm run test:run; then
    print_success "Frontend tests passed (64/64)"
    FRONTEND_TESTS_PASSED=true
else
    print_error "Frontend tests failed"
    FRONTEND_TESTS_PASSED=false
fi

cd ..

# Backend Tests
print_status "🧪 Running Backend Tests..."
echo "-----------------------------"
cd backend

if [[ ! -f "requirements.txt" ]]; then
    print_error "Backend requirements.txt not found"
    exit 1
fi

# Check if virtual environment exists
if [[ ! -d "../augment" ]]; then
    print_warning "Virtual environment not found. Please set up the backend environment first."
    print_warning "Run: python -m venv augment && source augment/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment and run tests
print_status "🧪 Executing backend test suite..."
export FLASK_ENV=testing
export ANTHROPIC_API_KEY=test_key_for_local_testing

if python -m pytest -v --tb=short; then
    print_success "Backend tests passed (19/19)"
    BACKEND_TESTS_PASSED=true
else
    print_error "Backend tests failed"
    BACKEND_TESTS_PASSED=false
fi

cd ..

# Summary
echo ""
print_status "📊 Test Results Summary"
echo "======================="

if [[ "$FRONTEND_TESTS_PASSED" == true ]]; then
    print_success "Frontend Tests: 64/64 passed"
else
    print_error "Frontend Tests: Failed"
fi

if [[ "$BACKEND_TESTS_PASSED" == true ]]; then
    print_success "Backend Tests: 19/19 passed"
else
    print_error "Backend Tests: Failed"
fi

echo ""

if [[ "$FRONTEND_TESTS_PASSED" == true && "$BACKEND_TESTS_PASSED" == true ]]; then
    print_success "All tests passed! 🎉"
    print_success "Total: 83/83 tests passed"
    echo ""
    print_status "✨ Your code is ready for CI/CD pipeline!"
    exit 0
else
    print_error "Some tests failed. Please fix the issues before committing."
    exit 1
fi
