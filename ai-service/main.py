from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List
import requests
import os
import tempfile

from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.prompts import PromptTemplate

app = FastAPI(title="DyslexiaLearn AI Service", version="1.0.0")

# --- Configuration ---
from dotenv import load_dotenv
load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "llama3:8b")
EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
CHROMA_PERSIST_DIR = "./chroma_db"

# --- Embeddings & Vector Store Setup ---
# Initialize Ollama Embeddings
embeddings = OllamaEmbeddings(model=EMBEDDING_MODEL, base_url=OLLAMA_BASE_URL)

# Initialize ChromaDB Vector Store
vector_store = Chroma(
    collection_name="dyslexia_content",
    embedding_function=embeddings,
    persist_directory=CHROMA_PERSIST_DIR
)

# --- Pydantic Models ---
class QueryRequest(BaseModel):
    question: str
    model: str = DEFAULT_MODEL

class ContextQueryRequest(BaseModel):
    context: str
    question: str
    model: str = DEFAULT_MODEL

class SynonymRequest(BaseModel):
    word: str
    sentence: str
    model: str = DEFAULT_MODEL

# --- Helper to query Ollama directly for Generation ---
def generate_from_ollama(prompt: str, model: str = DEFAULT_MODEL):
    try:
        response = requests.post(f"{OLLAMA_BASE_URL}/api/generate", json={
            "model": model,
            "prompt": prompt,
            "stream": False
        })
        response.raise_for_status()
        return response.json().get("response", "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)}")

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "AI Service is running", "vector_store": "ChromaDB initialized"}

@app.post("/api/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """
    Ingests a document (PDF or Text), chunks it, and stores it in ChromaDB using Ollama embeddings.
    """
    try:
        # Save uploaded file to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as temp_file:
            temp_file.write(await file.read())
            temp_path = temp_file.name

        # Load Document
        if file.filename.endswith(".pdf"):
            loader = PyPDFLoader(temp_path)
        else:
            loader = TextLoader(temp_path)
            
        documents = loader.load()

        # Split Document
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_documents(documents)

        # Store in ChromaDB
        vector_store.add_documents(chunks)
        
        # Clean up temp file
        os.remove(temp_path)

        return {"status": "success", "chunks_processed": len(chunks), "message": f"Successfully ingested {file.filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/rag/ask")
def ask_with_rag(request: QueryRequest):
    """
    Standard RAG Query: Searches ChromaDB for relevant context, then asks Ollama.
    """
    # 1. Retrieve Context from ChromaDB
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(request.question)
    context = "\n\n".join([doc.page_content for doc in docs])

    # 2. Formulate Prompt
    prompt = f"""You are a patient, encouraging AI tutor for a student with dyslexia. 
Use extremely simple words, short sentences, and be highly encouraging. 
Answer the question based STRICTLY on the context provided. If the answer is not in the context, gently say you don't know.

Context:
{context}

Question: {request.question}

Answer:"""

    # 3. Generate Answer
    answer = generate_from_ollama(prompt, request.model)
    return {"answer": answer, "sources": [doc.metadata for doc in docs]}

@app.post("/api/features/synonym")
def contextual_synonym(request: SynonymRequest):
    """
    Dyslexia Feature: Contextual Synonym Finder
    Finds a simpler synonym for a hard word based on the context of the sentence.
    """
    prompt = f"""You are helping a child with dyslexia understand a difficult word.
The word they are struggling with is: "{request.word}"
The sentence it appears in is: "{request.sentence}"

Provide:
1. A much simpler, highly common synonym that fits perfectly in that exact sentence.
2. An emoji that represents the word.
3. A very short, child-friendly explanation of what the word means.

Format your response exactly like this:
Synonym: [simple word] [emoji]
Meaning: [short meaning]
"""
    answer = generate_from_ollama(prompt, request.model)
    return {"response": answer}

@app.post("/api/features/socratic")
def socratic_tutor(request: ContextQueryRequest):
    """
    Dyslexia Feature: Socratic Concept Checker
    Instead of giving the answer, guide the child to it.
    """
    prompt = f"""You are a gentle Socratic tutor for a child with dyslexia.
The child has asked: "{request.question}"
The context containing the answer is: "{request.context}"

DO NOT GIVE THE DIRECT ANSWER.
Instead, ask 1 very simple, guiding question to help the child figure out the answer themselves.
Use encouraging, warm language.
"""
    answer = generate_from_ollama(prompt, request.model)
    return {"response": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

