import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save, CheckCircle, Database } from "lucide-react";
import { AI_SERVICE_URL } from "../../config";

const SettingsModal = ({ isOpen, onClose }) => {
  const [selectedModel, setSelectedModel] = useState("llama3:8b");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    // Load saved model from local storage
    const savedModel = localStorage.getItem("preferred_model");
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("preferred_model", selectedModel);
    alert("Settings saved successfully!");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/ingest`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus({ type: "success", message: `Successfully ingested ${data.chunks_processed} chunks from ${file.name}!` });
        setFile(null); // clear file input
      } else {
        const err = await response.json();
        setUploadStatus({ type: "error", message: `Upload failed: ${err.detail || "Unknown error"}` });
      }
    } catch (error) {
      setUploadStatus({ type: "error", message: `Network error: Could not reach AI service.` });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="settings-modal-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          style={{
            background: "#fff",
            borderRadius: "15px",
            padding: "2rem",
            width: "90%",
            maxWidth: "600px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            position: "relative"
          }}
        >
          <button 
            onClick={onClose}
            style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} color="#8898aa" />
          </button>

          <h2 style={{ color: "#32325d", fontWeight: "800", marginBottom: "1.5rem" }}>Settings</h2>

          <div className="mb-4">
            <h4 style={{ color: "#525f7f", fontWeight: "bold" }}>AI Model Configuration</h4>
            <p className="text-muted small mb-2">Select the Ollama model the AI Tutor will use.</p>
            <select 
              className="form-select" 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "10px" }}
            >
              <option value="llama3:8b">Llama 3 (8B) - Recommended</option>
              <option value="mistral">Mistral (7B) - Balanced</option>
              <option value="phi3">Phi-3 (3.8B) - Fast</option>
              <option value="qwen:0.5b">Qwen (0.5B) - Ultra Lightweight</option>
            </select>
            <button 
              className="btn btn-primary mt-3 d-flex align-items-center"
              onClick={handleSaveSettings}
              style={{ padding: "8px 20px", borderRadius: "8px" }}
            >
              <Save size={18} className="me-2" /> Save Settings
            </button>
          </div>

          <hr className="my-4" />

          <div>
            <h4 style={{ color: "#525f7f", fontWeight: "bold", display: "flex", alignItems: "center" }}>
              <Database size={20} className="me-2" /> Feed New Data
            </h4>
            <p className="text-muted small mb-3">
              Upload PDF or Text documents to add them to the AI's Knowledge Base. 
              The AI Tutor will use this information to answer questions.
            </p>
            
            <div className="d-flex align-items-center gap-3">
              <input 
                type="file" 
                className="form-control" 
                accept=".txt,.pdf"
                onChange={handleFileChange}
                style={{ borderRadius: "10px" }}
              />
              <button 
                className="btn btn-success d-flex align-items-center"
                onClick={handleUpload}
                disabled={!file || isUploading}
                style={{ padding: "8px 20px", borderRadius: "8px", minWidth: "120px", justifyContent: "center" }}
              >
                {isUploading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <><Upload size={18} className="me-2" /> Upload</>
                )}
              </button>
            </div>

            {uploadStatus && (
              <div className={`mt-3 p-3 rounded d-flex align-items-center ${uploadStatus.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                {uploadStatus.type === 'success' ? <CheckCircle size={20} className="me-2" /> : <X size={20} className="me-2" />}
                {uploadStatus.message}
              </div>
            )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;
