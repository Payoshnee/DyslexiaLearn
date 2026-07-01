# DyslexiaLearn 🚀

**DyslexiaLearn** is an AI-powered, highly interactive educational platform specifically designed to assist children with dyslexia. The platform uses beautiful, gamified interfaces alongside cutting-edge open-source AI models (running locally or in the cloud) to provide a deeply personalized learning experience.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=DyslexiaLearn+Dashboard)

---

## ✨ Core Features

1. **🎙️ Pronunciation Trainer**: Uses the Web Speech API to provide real-time voice recognition. Students listen to the correct pronunciation of a word and practice speaking it, receiving instant visual feedback.
2. **🤖 Socratic AI Tutor**: A Retrieval-Augmented Generation (RAG) chatbot powered by Llama 3 (or other Ollama models) that acts as a patient tutor. It guides the student to the answer instead of just giving it away.
3. **📚 Custom Knowledge Base (RAG)**: Teachers or parents can upload custom PDF or text documents via the **Settings Panel**. The AI ingests these files and uses them to answer the student's questions accurately.
4. **🎮 Interactive Quizzes**: Fun, colorful multiple-choice quizzes to test the student's learning progress, complete with instant animations.
5. **🏆 Leaderboard & Profile**: A gamified rewards system that tracks points and quizzes passed, displayed in a gorgeous UI.

---

## 🏗️ System Architecture

DyslexiaLearn is built using a modern 3-tier microservice architecture:
- **Frontend**: React.js (with Framer Motion for beautiful animations and Reactstrap for UI components).
- **Backend Core**: Java Spring Boot (handles user authentication, PostgreSQL database interaction, and routes AI requests).
- **AI Microservice**: Python FastAPI (handles document chunking, ChromaDB vector storage, and communicates with Ollama for local LLM inference).
- **Database**: PostgreSQL (containerized via Docker) storing user credentials and progress.

---

## 💻 Local Setup Instructions

We've provided automated setup scripts for both Mac/Linux and Windows that will automatically detect your System RAM, recommend the best AI model, download it, and configure the project.

### Prerequisites
Before running the setup script, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [Python 3](https://www.python.org/downloads/) (with `pip`)
- [Java JDK 17+](https://adoptium.net/) & [Maven](https://maven.apache.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Must be running)
- [Ollama](https://ollama.com/) (Must be installed and running in the background)

### Option A: Mac / Linux
1. Open your terminal and navigate to the project root.
2. Make the script executable: `chmod +x setup.sh`
3. Run the script: `./setup.sh`
4. Follow the on-screen prompts to select your AI Model based on your RAM.

### Option B: Windows
1. Open Command Prompt (or PowerShell) and navigate to the project root.
2. Run the script: `setup.bat`
3. Follow the on-screen prompts to select your AI Model based on your RAM.

### Running the Application Locally
Once setup is complete, you need to start the three services in separate terminal windows:

**1. Start the Frontend:**
```bash
cd frontend
npm start
```
*(Runs on http://localhost:3000)*

**2. Start the Java Backend:**
```bash
cd backend
mvn spring-boot:run
```
*(Runs on http://localhost:8080)*

**3. Start the Python AI Service:**
```bash
cd ai-service
# On Mac/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
uvicorn main:app --reload
```
*(Runs on http://localhost:8000)*

---

## ⚙️ Dashboard Controls

On the **Student Dashboard**, you will find two action buttons in the bottom corners:
- **⚙️ Settings (Bottom Left)**: Opens the configuration modal. Here you can change the AI Model dynamically (e.g., switch from `llama3:8b` to `phi3`) and **upload new PDF/Text documents** to the AI's Knowledge Base.
- **🚪 Logout (Bottom Right)**: Securely clears your session and returns you to the login screen.

---

## ☁️ How to Deploy for Free

You can host this entire stack online completely for free using the following platforms:

### 1. Database (PostgreSQL) -> **Supabase** or **Neon**
- Create a free PostgreSQL database on [Supabase](https://supabase.com/) or [Neon.tech](https://neon.tech/).
- Copy the provided Connection URL.
- Update `backend/src/main/resources/application.properties` with the new cloud database credentials.

### 2. Java Backend -> **Render** or **Railway**
- Push your code to GitHub.
- Create a Web Service on [Render](https://render.com/) or [Railway](https://railway.app/).
- Connect your repository and select the `backend` folder.
- Build Command: `mvn clean install -DskipTests`
- Start Command: `java -jar target/DyslexiLearn-0.0.1-SNAPSHOT.jar`
- Render free web services can spin down after inactivity. To reduce cold starts, add a GitHub repository secret named `RENDER_BACKEND_URL` with your backend URL, for example `https://your-service.onrender.com`. The included `.github/workflows/keep-render-awake.yml` workflow pings `/health` every 10 minutes.

### 3. Frontend -> **Vercel** or **Netlify**
- Create a free account on [Vercel](https://vercel.com/).
- Import your GitHub repository.
- Set the Root Directory to `frontend`.
- Click Deploy! Vercel will automatically build and host the React app.

### 4. AI Service -> **HuggingFace Spaces** or **Google Colab (Ngrok)**
Running LLMs requires significant RAM/GPU power, which isn't free on typical cloud providers.
- **Option A (Google Colab)**: You can run the FastAPI and Ollama inside a free Google Colab notebook. Use `ngrok` to expose the port to the public internet, and update your Java backend to point to the Ngrok URL.
- **Option B (HuggingFace Spaces)**: Create a Docker Space on [HuggingFace](https://huggingface.co/spaces). You can write a Dockerfile that installs Ollama, pulls the model, and runs your FastAPI script. HuggingFace provides a free 16GB RAM CPU tier which is enough for lightweight models like `qwen:0.5b` or `phi3`.

---

## 💡 Troubleshooting
- **Microphone not working?** The Web Speech API requires Google Chrome or Safari. Browsers like Arc or Brave block Google's speech recognition servers.
- **Login fails?** Ensure Docker is running and the database is active.
- **AI is slow?** Open the Settings panel on the dashboard and switch to a lighter model like `phi3` or `qwen:0.5b`.
