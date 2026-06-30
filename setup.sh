#!/bin/bash

# DyslexiaLearn Mac/Linux Setup Script
# This script checks all dependencies and sets up the project.

echo "=========================================="
echo "    DyslexiaLearn Setup Script (Mac/Linux)"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 1. Check Requirements
echo "--> Checking System Requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✓ Node.js is installed.$(node -v)${NC}"
fi

# Check Python 3
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed.${NC}"
    echo "Please download and install Python 3 from https://www.python.org/downloads/"
    exit 1
else
    echo -e "${GREEN}✓ Python 3 is installed. $(python3 --version)${NC}"
fi

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed.${NC}"
    echo "Please install Java JDK 17 (or higher) from https://adoptium.net/"
    exit 1
else
    echo -e "${GREEN}✓ Java is installed.${NC}"
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven (mvn) is not installed.${NC}"
    echo "Please install Apache Maven. On Mac: 'brew install maven'"
    exit 1
else
    echo -e "${GREEN}✓ Maven is installed.${NC}"
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    exit 1
else
    echo -e "${GREEN}✓ Docker is installed.${NC}"
fi

# Check Docker Compose
if ! docker compose version &> /dev/null && ! docker-compose --version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed.${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Docker Compose is installed.${NC}"
fi

echo ""
echo "--> All requirements met! Setting up environments..."
echo ""

# 2. Setup and Start Database via Docker
echo "--> Starting PostgreSQL Database in Docker..."
cd docker || exit
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

echo "Waiting for database to be ready..."
sleep 5
cd ..
echo -e "${GREEN}✓ Database started successfully.${NC}"
echo ""

# 3. Setup Python AI Service
echo "--> Setting up Python AI Microservice..."
cd ai-service || exit
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install fastapi uvicorn langchain langchain-community chromadb requests pypdf python-multipart python-dotenv
deactivate
cd ..
echo -e "${GREEN}✓ AI Service setup complete.${NC}"
echo ""

# 4. Setup React Frontend
echo "--> Setting up React Frontend..."
cd frontend || exit
npm install
cd ..
echo -e "${GREEN}✓ Frontend setup complete.${NC}"
echo ""

# 5. Setup Java Backend
echo "--> Setting up Java Spring Boot Backend..."
cd backend || exit
mvn clean install -DskipTests
cd ..
echo -e "${GREEN}✓ Backend setup complete.${NC}"
echo ""

# 6. Detect System RAM & Select Ollama Model
echo "--> Checking System Memory for AI Models..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    RAM_BYTES=$(sysctl -n hw.memsize)
    RAM_GB=$(($RAM_BYTES / 1024 / 1024 / 1024))
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    RAM_KB=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
    RAM_GB=$(($RAM_KB / 1024 / 1024))
else
    RAM_GB=8 # Fallback
fi

echo -e "Detected RAM: ${YELLOW}${RAM_GB}GB${NC}"
echo ""
echo "Select the AI Model to use for DyslexiaLearn:"
echo "1) llama3:8b   (Requires 8GB+ RAM) - Recommended for good PCs"
echo "2) mistral     (Requires 8GB+ RAM) - Alternative to Llama 3"
echo "3) phi3        (Requires 4GB+ RAM) - Recommended for older PCs"
echo "4) qwen:0.5b   (Requires 2GB+ RAM) - Very lightweight, fastest"
echo ""

if [ "$RAM_GB" -lt 6 ]; then
    echo -e "${YELLOW}Based on your RAM, we recommend option 3 (phi3) or 4 (qwen:0.5b).${NC}"
else
    echo -e "${GREEN}Based on your RAM, we recommend option 1 (llama3:8b).${NC}"
fi

echo ""
read -p "Enter your choice [1-4] (default 1): " MODEL_CHOICE

case $MODEL_CHOICE in
    2) SELECTED_MODEL="mistral" ;;
    3) SELECTED_MODEL="phi3" ;;
    4) SELECTED_MODEL="qwen:0.5b" ;;
    *) SELECTED_MODEL="llama3:8b" ;;
esac

echo -e "You selected: ${GREEN}${SELECTED_MODEL}${NC}"

echo "--> Saving configuration..."
echo "OLLAMA_MODEL=${SELECTED_MODEL}" > ai-service/.env
echo "OLLAMA_EMBEDDING_MODEL=nomic-embed-text" >> ai-service/.env

echo "--> Pulling required AI Models (This may take a while depending on your internet speed)..."
echo "Pulling ${SELECTED_MODEL}..."
ollama pull $SELECTED_MODEL
echo "Pulling nomic-embed-text..."
ollama pull nomic-embed-text
echo -e "${GREEN}✓ AI Models ready.${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}  Setup Complete! You are ready to go.${NC}"
echo "=========================================="
echo ""
echo "To start the application, you need 3 terminal windows:"
echo "1. Frontend: cd frontend && npm start"
echo "2. Backend: cd backend && mvn spring-boot:run"
echo "3. AI Service: cd ai-service && source venv/bin/activate && uvicorn main:app --reload"
