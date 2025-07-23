# Development Guide

This guide explains how to use the unified development environment for the AI Form Creator project.

## 🚀 Quick Start

The project now has a unified root-level `package.json` that provides convenient scripts for managing both the frontend and backend from a single location.

### Option 1: Using pnpm scripts (Recommended)

```bash
# Start the complete development environment
pnpm run dev

# This will start both:
# - Backend server at http://localhost:5001
# - Frontend server at http://localhost:3000
```

### Option 2: Using the shell script

```bash
# Make the script executable (first time only)
chmod +x dev.sh

# Start development environment
./dev.sh

# Or with specific commands
./dev.sh backend    # Backend only
./dev.sh frontend   # Frontend only
./dev.sh setup      # Setup project
```

## 📋 Complete Script Reference

### Core Development Scripts

| Script                       | Description                         | Usage                       |
| ---------------------------- | ----------------------------------- | --------------------------- |
| `pnpm run dev`               | Start both servers with live reload | Primary development command |
| `pnpm run dev:backend-only`  | Start only Python Flask backend     | Backend development         |
| `pnpm run dev:frontend-only` | Start only React frontend           | Frontend development        |
| `pnpm start`                 | Alias for `pnpm run dev`            | Quick start                 |

### Setup & Installation Scripts

| Script                      | Description                        | When to Use           |
| --------------------------- | ---------------------------------- | --------------------- |
| `pnpm run setup`            | Complete project setup             | First time setup      |
| `pnpm run install:all`      | Install all dependencies           | After pulling changes |
| `pnpm run install:backend`  | Install Python dependencies        | Backend changes       |
| `pnpm run install:frontend` | Install Node.js dependencies       | Frontend changes      |
| `pnpm run backend:setup`    | Create venv + install backend deps | Backend setup         |

### Build & Production Scripts

| Script             | Description                   | Usage                 |
| ------------------ | ----------------------------- | --------------------- |
| `pnpm run build`   | Build frontend for production | Before deployment     |
| `pnpm run preview` | Preview production build      | Test production build |

### Code Quality Scripts

| Script                | Description               | Usage              |
| --------------------- | ------------------------- | ------------------ |
| `pnpm run lint`       | Run ESLint on frontend    | Check code quality |
| `pnpm run lint:fix`   | Auto-fix ESLint issues    | Fix formatting     |
| `pnpm run format`     | Format code with Prettier | Code formatting    |
| `pnpm run type-check` | TypeScript type checking  | Verify types       |
| `pnpm run test`       | Run frontend tests        | Test functionality |

### Maintenance Scripts

| Script                 | Description                     | When to Use      |
| ---------------------- | ------------------------------- | ---------------- |
| `pnpm run clean`       | Clean build artifacts           | Fix build issues |
| `pnpm run clean:all`   | Clean everything including venv | Major cleanup    |
| `pnpm run reset`       | Complete reset and setup        | Start fresh      |
| `pnpm run deps:update` | Update all dependencies         | Maintenance      |
| `pnpm run deps:audit`  | Security audit                  | Security check   |

### Monitoring Scripts

| Script                    | Description                  | Usage           |
| ------------------------- | ---------------------------- | --------------- |
| `pnpm run check:health`   | Check if servers are running | Health check    |
| `pnpm run check:backend`  | Check backend server         | Backend status  |
| `pnpm run check:frontend` | Check frontend server        | Frontend status |
| `pnpm run logs:backend`   | View backend logs            | Debug backend   |
| `pnpm run info`           | Show server URLs             | Quick reference |

## 🔧 Development Workflows

### Daily Development Workflow

```bash
# 1. Start development environment
pnpm run dev

# 2. Make changes to code
# Both servers will automatically reload

# 3. Check code quality (optional)
pnpm run lint
pnpm run type-check

# 4. Run tests (optional)
pnpm run test
```

### First Time Setup Workflow

#### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone repository
git clone <repository-url>
cd AiFormCreator

# 2. Run automated setup script
./setup.sh

# 3. Start development
pnpm run dev

# 4. Open in browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:5001
```

#### Option 2: Manual Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd AiFormCreator

# 2. Check prerequisites
node --version    # Should be >= 18.12.0
pnpm --version    # Should be >= 8.0.0
python3 --version # Should be >= 3.9.0

# 3. Complete setup
pnpm run setup

# 4. Start development
pnpm run dev

# 5. Open in browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:5001
```

### Troubleshooting Workflow

```bash
# 1. Check if servers are running
pnpm run check:health

# 2. View backend logs
pnpm run logs:backend

# 3. Clean and restart if needed
pnpm run clean
pnpm run dev

# 4. Complete reset if major issues
pnpm run reset
```

### Pre-commit Workflow

```bash
# 1. Run linting and fix issues
pnpm run lint:fix

# 2. Format code
pnpm run format

# 3. Type check
pnpm run type-check

# 4. Run tests
pnpm run test

# 5. Build to ensure no build errors
pnpm run build
```

## 🏗️ Architecture Overview

The unified development environment uses:

- **concurrently**: Runs multiple processes simultaneously
- **Cross-platform scripts**: Work on Windows, macOS, and Linux
- **Virtual environment**: Isolated Python dependencies
- **Hot reload**: Both frontend and backend reload on changes
- **Unified logging**: Color-coded output for easy debugging

## 🔍 Debugging Tips

### Backend Issues

```bash
# Check backend logs
pnpm run logs:backend

# Start backend only for focused debugging
pnpm run dev:backend-only

# Check if backend dependencies are installed
source augment/bin/activate && pip list
```

### Frontend Issues

```bash
# Start frontend only
pnpm run dev:frontend-only

# Check frontend dependencies
cd frontend && pnpm list

# Clear frontend cache
pnpm run clean:frontend && pnpm run install:frontend
```

### Port Conflicts

If you get port conflicts:

```bash
# Check what's using the ports
lsof -i :3000  # Frontend port
lsof -i :5001  # Backend port

# Kill processes if needed
kill -9 <PID>
```

### Environment Issues

```bash
# Complete environment reset
pnpm run reset

# Check system requirements
node --version    # Should be >= 18.12.0
pnpm --version    # Should be >= 8.0.0
python3 --version # Should be >= 3.9.0
```

## 🚀 Advanced Usage

### Custom Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend configuration
FLASK_ENV=development
FLASK_DEBUG=1
ANTHROPIC_API_KEY=your_api_key_here

# Frontend configuration (prefix with VITE_)
VITE_API_URL=http://localhost:5001
```

### Running with Different Ports

Modify the scripts in `package.json` or use environment variables:

```bash
# Frontend port
PORT=3001 pnpm run dev:frontend-only

# Backend port (modify backend/app.py)
```

### Production Deployment

```bash
# Build for production
pnpm run build

# The built files will be in frontend/dist/
# Deploy these files to your web server
```

## 🤝 Contributing

When contributing to the project:

1. **Always run the pre-commit workflow** before committing
2. **Use the unified scripts** instead of navigating to individual directories
3. **Test both frontend and backend** with `pnpm run dev`
4. **Update documentation** if you add new scripts or workflows

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** for common workflows
2. **Run health checks** with `pnpm run check:health`
3. **Try a reset** with `pnpm run reset`
4. **Check the logs** with `pnpm run logs:backend`
5. **Open an issue** on GitHub with error details
