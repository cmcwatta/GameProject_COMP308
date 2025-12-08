#!/bin/bash

# Docker Startup Script for Gamification Platform
# This script helps manage Docker containers for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
  echo -e "\n${GREEN}================================${NC}"
  echo -e "${GREEN}$1${NC}"
  echo -e "${GREEN}================================${NC}\n"
}

print_info() {
  echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
check_docker() {
  if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
  fi
  print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
  if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
  fi
  print_success "Docker Compose is installed"
}

# Setup environment
setup_env() {
  print_header "Setting up environment"
  
  if [ ! -f .env ]; then
    print_info "Creating .env file from .env.example"
    cp .env.example .env
    print_success ".env file created. Please update with your actual values."
  else
    print_info ".env file already exists"
  fi
}

# Build images
build_images() {
  print_header "Building Docker images"
  docker-compose build
  print_success "Docker images built successfully"
}

# Start services
start_services() {
  print_header "Starting services"
  docker-compose up -d
  
  # Wait for services to be ready
  print_info "Waiting for services to be ready..."
  sleep 10
  
  # Check health
  check_health
}

# Stop services
stop_services() {
  print_header "Stopping services"
  docker-compose down
  print_success "Services stopped"
}

# Remove volumes
remove_volumes() {
  print_header "Removing volumes (WARNING: This will delete data!)"
  read -p "Are you sure? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    print_success "Volumes removed"
  else
    print_info "Cancelled"
  fi
}

# Check service health
check_health() {
  print_header "Checking service health"
  
  services=(
    "http://localhost:5001/health:Auth Service"
    "http://localhost:5002/health:Engagement Service"
    "http://localhost:5003/health:Gamification Service"
    "http://localhost:5004/health:AI Service"
  )
  
  for service in "${services[@]}"; do
    url="${service%:*}"
    name="${service##*:}"
    
    if curl -s "$url" > /dev/null 2>&1; then
      print_success "$name is healthy"
    else
      print_error "$name is not responding"
    fi
  done
}

# View logs
view_logs() {
  print_header "Service Logs"
  
  if [ -z "$1" ]; then
    docker-compose logs -f
  else
    docker-compose logs -f "$1"
  fi
}

# View service list
list_services() {
  print_header "Running Services"
  docker-compose ps
}

# Seed database
seed_database() {
  print_header "Seeding database"
  print_info "Running seed scripts..."
  
  # This will be implemented in the next step
  docker-compose exec gamification-service npm run seed
  
  print_success "Database seeded"
}

# Main menu
show_menu() {
  echo -e "\n${GREEN}Gamification Platform - Docker Manager${NC}"
  echo "========================================"
  echo "1) Setup environment"
  echo "2) Build Docker images"
  echo "3) Start all services"
  echo "4) Stop all services"
  echo "5) Check service health"
  echo "6) View logs"
  echo "7) List running services"
  echo "8) Seed database"
  echo "9) Remove volumes (WARNING: Deletes data)"
  echo "0) Exit"
  echo "========================================"
}

# Handle arguments
if [ $# -eq 0 ]; then
  # Interactive mode
  check_docker
  check_docker_compose
  
  while true; do
    show_menu
    read -p "Enter your choice: " choice
    
    case $choice in
      1) setup_env ;;
      2) build_images ;;
      3) setup_env && start_services ;;
      4) stop_services ;;
      5) check_health ;;
      6) view_logs ;;
      7) list_services ;;
      8) seed_database ;;
      9) remove_volumes ;;
      0) print_success "Exiting"; exit 0 ;;
      *) print_error "Invalid choice" ;;
    esac
  done
else
  # Command mode
  check_docker
  check_docker_compose
  
  case "$1" in
    setup) setup_env ;;
    build) build_images ;;
    start) setup_env && start_services ;;
    stop) stop_services ;;
    health) check_health ;;
    logs) view_logs "$2" ;;
    ps) list_services ;;
    seed) seed_database ;;
    clean) remove_volumes ;;
    *)
      echo "Usage: $0 {setup|build|start|stop|health|logs|ps|seed|clean}"
      exit 1
      ;;
  esac
fi
