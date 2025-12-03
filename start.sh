#!/bin/bash

# Smart Grid IoT - Start Script for Mac/Linux

echo ""
echo "========================================"
echo "  Smart Grid IoT System"
echo "========================================"
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./start.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  docker-up        Start all services with Docker"
    echo "  docker-down      Stop all services"
    echo "  docker-logs      View service logs"
    echo "  docker-rebuild   Rebuild from scratch"
    echo "  docker-ps        Show running containers"
    echo "  backend          Start backend only"
    echo "  frontend         Start frontend only"
    echo "  generator        Start generator only"
    echo "  help             Show this message"
    echo ""
    exit 0
fi

case "$1" in
    docker-up)
        echo "Starting services..."
        docker-compose up -d
        sleep 3
        echo ""
        echo "Services started!"
        echo "Dashboard: http://localhost:3000"
        echo "API: http://localhost:5000"
        echo "MongoDB: localhost:27017"
        echo "MQTT: localhost:1883"
        echo ""
        ;;
    docker-down)
        echo "Stopping services..."
        docker-compose down
        echo "Services stopped."
        ;;
    docker-logs)
        docker-compose logs -f
        ;;
    docker-rebuild)
        echo "Rebuilding from scratch..."
        docker-compose down -v
        docker-compose up -d --build
        sleep 3
        echo "Services rebuilt and started!"
        ;;
    docker-ps)
        docker-compose ps
        ;;
    backend)
        echo "Starting backend..."
        cd backend
        npm install
        npm start
        ;;
    frontend)
        echo "Starting frontend..."
        cd frontend
        npm install
        npm run dev
        ;;
    generator)
        echo "Starting generator..."
        cd generator
        npm install
        npm start
        ;;
    help)
        echo "Smart Grid IoT - Available Commands"
        echo ""
        echo "Docker Commands:"
        echo "  ./start.sh docker-up      Start all services"
        echo "  ./start.sh docker-down    Stop all services"
        echo "  ./start.sh docker-logs    View logs"
        echo "  ./start.sh docker-rebuild Full reset"
        echo "  ./start.sh docker-ps      Show containers"
        echo ""
        echo "Local Development:"
        echo "  ./start.sh backend        Start backend only"
        echo "  ./start.sh frontend       Start frontend only"
        echo "  ./start.sh generator      Start generator only"
        echo ""
        echo "Other:"
        echo "  ./start.sh help           Show this message"
        echo ""
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use: ./start.sh help"
        exit 1
        ;;
esac
