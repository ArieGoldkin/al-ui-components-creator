#!/bin/bash

# Supabase MCP Setup Script for AI Component Builder
# This script helps configure Supabase MCP for various AI development tools

set -e

echo "🚀 AI Component Builder - Supabase MCP Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        print_error "npx is required but not installed. Please install npm/npx first."
        exit 1
    fi
    
    print_status "Requirements check passed"
}

# Get user input for configuration
get_user_input() {
    echo ""
    print_info "Please provide the following information:"
    echo ""
    
    # Get project reference
    while [[ -z "$PROJECT_REF" ]]; do
        read -p "Enter your Supabase Project Reference: " PROJECT_REF
        if [[ -z "$PROJECT_REF" ]]; then
            print_warning "Project reference cannot be empty"
        fi
    done
    
    # Get personal access token
    while [[ -z "$ACCESS_TOKEN" ]]; do
        read -s -p "Enter your Supabase Personal Access Token: " ACCESS_TOKEN
        echo ""
        if [[ -z "$ACCESS_TOKEN" ]]; then
            print_warning "Access token cannot be empty"
        fi
    done
    
    echo ""
    print_status "Configuration details collected"
}

# Update configuration files
update_config_files() {
    print_info "Updating MCP configuration files..."
    
    # Update .cursor/mcp.json
    if [[ -f ".cursor/mcp.json" ]]; then
        sed -i.bak "s/YOUR_PROJECT_REF_HERE/$PROJECT_REF/g" .cursor/mcp.json
        sed -i.bak "s/YOUR_PERSONAL_ACCESS_TOKEN_HERE/$ACCESS_TOKEN/g" .cursor/mcp.json
        rm .cursor/mcp.json.bak
        print_status "Updated .cursor/mcp.json"
    fi
    
    # Update .vscode/mcp.json
    if [[ -f ".vscode/mcp.json" ]]; then
        sed -i.bak "s/YOUR_PROJECT_REF_HERE/$PROJECT_REF/g" .vscode/mcp.json
        rm .vscode/mcp.json.bak
        print_status "Updated .vscode/mcp.json"
    fi
    
    # Update .mcp.json
    if [[ -f ".mcp.json" ]]; then
        sed -i.bak "s/YOUR_PROJECT_REF_HERE/$PROJECT_REF/g" .mcp.json
        sed -i.bak "s/YOUR_PERSONAL_ACCESS_TOKEN_HERE/$ACCESS_TOKEN/g" .mcp.json
        rm .mcp.json.bak
        print_status "Updated .mcp.json"
    fi
}

# Test the MCP server connection
test_connection() {
    print_info "Testing MCP server connection..."
    
    # Try to run the MCP server to verify it works
    if npx -y @supabase/mcp-server-supabase@latest --help > /dev/null 2>&1; then
        print_status "MCP server package is accessible"
    else
        print_warning "Could not verify MCP server package. Check your internet connection."
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 Supabase MCP Setup Complete!"
    echo "================================"
    echo ""
    print_info "Next steps:"
    echo ""
    echo "1. Restart your AI development tool (Cursor, VS Code, etc.)"
    echo "2. Check MCP server status in your tool's settings"
    echo "3. Test the connection by asking your AI assistant:"
    echo "   - 'Can you show me the tables in my Supabase database?'"
    echo "   - 'What's the current configuration of my Supabase project?'"
    echo ""
    print_info "Configuration files updated:"
    echo "   - .cursor/mcp.json (for Cursor IDE)"
    echo "   - .vscode/mcp.json (for VS Code Copilot)"
    echo "   - .mcp.json (for Claude Code and other tools)"
    echo ""
    print_info "Documentation:"
    echo "   - See docs/SUPABASE_MCP_SETUP.md for detailed instructions"
    echo "   - Visit https://supabase.com/docs/guides/getting-started/mcp for more info"
    echo ""
    print_warning "Security reminder: Only use with development databases, never production!"
}

# Main execution
main() {
    check_requirements
    get_user_input
    update_config_files
    test_connection
    show_next_steps
}

# Run the script
main
