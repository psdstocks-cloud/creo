#!/bin/bash

# Creo SaaS Platform Deployment Script
# This script helps deploy the application to Vercel with proper environment setup

set -e

echo "🚀 Starting Creo SaaS Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    print_success "All requirements are met!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully!"
}

# Build the application
build_app() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully!"
}

# Check environment variables
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found. Creating from example..."
        if [ -f "env.example" ]; then
            cp env.example .env.local
            print_warning "Please edit .env.local with your actual values before deploying!"
        else
            print_error "env.example file not found. Please create .env.local manually."
            exit 1
        fi
    fi
    
    # Check for required variables
    source .env.local
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        print_error "NEXT_PUBLIC_SUPABASE_URL is not set in .env.local"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        print_error "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_NEHTW_API_KEY" ]; then
        print_error "NEXT_PUBLIC_NEHTW_API_KEY is not set in .env.local"
        exit 1
    fi
    
    print_success "Environment variables are properly configured!"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if already linked to Vercel
    if [ ! -f ".vercel/project.json" ]; then
        print_status "Linking to Vercel project..."
        vercel link
    fi
    
    # Deploy
    vercel --prod
    
    print_success "Deployment completed successfully!"
}

# Main deployment function
main() {
    echo "🎯 Creo SaaS Platform Deployment Script"
    echo "======================================"
    
    check_requirements
    install_dependencies
    check_env_vars
    build_app
    deploy_to_vercel
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Set up your Supabase project with the required tables"
    echo "2. Configure your NEHTW API keys"
    echo "3. Test the application functionality"
    echo "4. Set up monitoring and analytics"
    echo ""
    echo "For detailed setup instructions, see ENVIRONMENT_SETUP.md"
}

# Run main function
main "$@"
