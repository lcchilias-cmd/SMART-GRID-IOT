#!/bin/bash

# Smart Grid IoT - Verification Script

echo ""
echo "=========================================="
echo "   Smart Grid IoT - System Verification"
echo "=========================================="
echo ""

PASS="✓"
FAIL="✗"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}${PASS}${NC} $1 installed"
        return 0
    else
        echo -e "${RED}${FAIL}${NC} $1 NOT found"
        return 1
    fi
}

check_port() {
    if nc -z localhost "$1" 2>/dev/null; then
        echo -e "${GREEN}${PASS}${NC} Port $1 is open"
        return 0
    else
        echo -e "${RED}${FAIL}${NC} Port $1 is closed"
        return 1
    fi
}

check_url() {
    if curl -s "$1" > /dev/null; then
        echo -e "${GREEN}${PASS}${NC} $1 is responding"
        return 0
    else
        echo -e "${RED}${FAIL}${NC} $1 is not responding"
        return 1
    fi
}

echo "1. Checking Prerequisites..."
echo "================================"

check_command "docker"
check_command "docker-compose"

echo ""
echo "2. Checking Project Structure..."
echo "================================"

files=(
    "docker-compose.yml"
    "README.md"
    "backend/server.js"
    "frontend/pages/index.js"
    "generator/generator.js"
    "mosquitto/config/mosquitto.conf"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}${PASS}${NC} $file exists"
    else
        echo -e "${RED}${FAIL}${NC} $file missing"
    fi
done

echo ""
echo "3. Checking Docker Services..."
echo "================================"

services=(
    "smartgrid-mosquitto"
    "smartgrid-mongodb"
    "smartgrid-backend"
    "smartgrid-frontend"
    "smartgrid-generator"
)

for service in "${services[@]}"; do
    if docker ps -a | grep -q "$service"; then
        if docker ps | grep -q "$service"; then
            echo -e "${GREEN}${PASS}${NC} $service is running"
        else
            echo -e "${YELLOW}⚠${NC}  $service exists but not running"
        fi
    else
        echo -e "${RED}${FAIL}${NC} $service not found"
    fi
done

echo ""
echo "4. Checking Service Ports..."
echo "================================"

check_port 1883  # Mosquitto MQTT
check_port 9001  # Mosquitto WebSocket
check_port 27017 # MongoDB
check_port 5000  # Backend
check_port 3000  # Frontend

echo ""
echo "5. Checking Service URLs..."
echo "================================"

check_url "http://localhost:3000"
check_url "http://localhost:5000/api/homes"

echo ""
echo "6. Checking Environment Files..."
echo "================================"

env_files=(
    "backend/.env"
    "frontend/.env.local"
    "generator/.env"
)

for file in "${env_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}${PASS}${NC} $file configured"
    else
        echo -e "${YELLOW}⚠${NC}  $file not configured"
    fi
done

echo ""
echo "=========================================="
echo "   Verification Complete"
echo "=========================================="
echo ""

echo "Recommendations:"
echo "1. Start services: docker-compose up -d"
echo "2. View logs: docker-compose logs -f"
echo "3. Access dashboard: http://localhost:3000"
echo "4. Check API: http://localhost:5000/api/homes"
echo ""
