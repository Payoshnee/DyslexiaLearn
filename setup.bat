@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo     DyslexiaLearn Setup Script (Windows)
echo ==========================================
echo.

:: 1. Check Requirements
echo --^> Checking System Requirements...

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please download and install Node.js from https://nodejs.org/
    exit /b 1
) else (
    echo [OK] Node.js is installed.
)

:: Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed.
    echo Please download and install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    exit /b 1
) else (
    echo [OK] Python is installed.
)

:: Check Java
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed.
    echo Please install Java JDK 17 (or higher) from https://adoptium.net/
    echo Make sure JAVA_HOME is set.
    exit /b 1
) else (
    echo [OK] Java is installed.
)

:: Check Maven
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven (mvn) is not installed.
    echo Please download and install Apache Maven from https://maven.apache.org/
    echo Make sure to add it to your system PATH.
    exit /b 1
) else (
    echo [OK] Maven is installed.
)

:: Check Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed.
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    exit /b 1
) else (
    echo [OK] Docker is installed.
)

echo.
echo --^> All requirements met! Setting up environments...
echo.

:: 2. Setup and Start Database via Docker
echo --^> Starting PostgreSQL Database in Docker...
cd docker
docker-compose up -d
if %errorlevel% neq 0 (
    docker compose up -d
)
echo Waiting for database to be ready...
timeout /t 5 /nobreak >nul
cd ..
echo [OK] Database started successfully.
echo.

:: 3. Setup Python AI Service
echo --^> Setting up Python AI Microservice...
cd ai-service
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install fastapi uvicorn langchain langchain-community chromadb requests pypdf python-multipart python-dotenv
call venv\Scripts\deactivate.bat
cd ..
echo [OK] AI Service setup complete.
echo.

:: 4. Setup React Frontend
echo --^> Setting up React Frontend...
cd frontend
call npm install
cd ..
echo [OK] Frontend setup complete.
echo.

:: 5. Setup Java Backend
echo --^> Setting up Java Spring Boot Backend...
cd backend
call mvn clean install -DskipTests
cd ..
echo [OK] Backend setup complete.
echo.

:: 6. Detect System RAM & Select Ollama Model
echo --^> Checking System Memory for AI Models...

for /f %%a in ('powershell -command "[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB)"') do set RAM_GB=%%a

echo Detected RAM: %RAM_GB%GB
echo.
echo Select the AI Model to use for DyslexiaLearn:
echo 1) llama3:8b   (Requires 8GB+ RAM) - Recommended for good PCs
echo 2) mistral     (Requires 8GB+ RAM) - Alternative to Llama 3
echo 3) phi3        (Requires 4GB+ RAM) - Recommended for older PCs
echo 4) qwen:0.5b   (Requires 2GB+ RAM) - Very lightweight, fastest
echo.

if %RAM_GB% LSS 6 (
    echo [NOTE] Based on your RAM, we recommend option 3 (phi3) or 4 (qwen:0.5b).
) else (
    echo [NOTE] Based on your RAM, we recommend option 1 (llama3:8b).
)

echo.
set /p MODEL_CHOICE="Enter your choice [1-4] (default 1): "

if "%MODEL_CHOICE%"=="2" (
    set SELECTED_MODEL=mistral
) else if "%MODEL_CHOICE%"=="3" (
    set SELECTED_MODEL=phi3
) else if "%MODEL_CHOICE%"=="4" (
    set SELECTED_MODEL=qwen:0.5b
) else (
    set SELECTED_MODEL=llama3:8b
)

echo You selected: %SELECTED_MODEL%

echo --^> Saving configuration...
echo OLLAMA_MODEL=%SELECTED_MODEL%> ai-service\.env
echo OLLAMA_EMBEDDING_MODEL=nomic-embed-text>> ai-service\.env

echo --^> Pulling required AI Models (This may take a while)...
echo Pulling %SELECTED_MODEL%...
ollama pull %SELECTED_MODEL%
echo Pulling nomic-embed-text...
ollama pull nomic-embed-text
echo [OK] AI Models ready.
echo.

echo ==========================================
echo   Setup Complete! You are ready to go.
echo ==========================================
echo.
echo To start the application, open 3 Command Prompts:
echo 1. Frontend: cd frontend ^&^& npm start
echo 2. Backend: cd backend ^&^& mvn spring-boot:run
echo 3. AI Service: cd ai-service ^&^& venv\Scripts\activate ^&^& uvicorn main:app --reload
pause
