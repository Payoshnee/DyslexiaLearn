import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, Sparkles } from "lucide-react";
import { Card, CardHeader, CardBody, Input, Button } from "reactstrap";
import { API_BASE_URL } from "../../config";

const AITutorFeature = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! I'm your AI Tutor. What would you like to learn today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const preferredModel = localStorage.getItem("preferred_model") || "llama3:8b";
      const response = await fetch(`${API_BASE_URL}/api/ai/rag/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: input, model: preferredModel })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...newMessages, { sender: "ai", text: data.answer || data.response }]);
      } else {
        setMessages([...newMessages, { sender: "ai", text: "Oops! I'm having trouble connecting right now." }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([...newMessages, { sender: "ai", text: "Sorry, I couldn't reach the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: "100%" }}
    >
      <Card className="glass-panel shadow border-0" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardHeader className="bg-transparent border-0 d-flex align-items-center">
          <div className="icon-shape bg-info text-white rounded-circle shadow me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} />
          </div>
          <h3 className="mb-0 text-white d-flex align-items-center gap-2">
            AI Tutor <Sparkles size={16} className="text-warning" />
          </h3>
        </CardHeader>

        <CardBody style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", padding: "1rem" }}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "rgba(94, 114, 228, 0.9)" : "rgba(255, 255, 255, 0.9)",
                color: msg.sender === "user" ? "white" : "#32325d",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "80%",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {msg.sender === "ai" && <Bot size={16} className="text-info" />}
              <span style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>{msg.text}</span>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "12px 20px",
                borderRadius: "20px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Bot size={16} className="text-info me-2" />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                style={{ width: "8px", height: "8px", backgroundColor: "#11cdef", borderRadius: "50%" }}
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                style={{ width: "8px", height: "8px", backgroundColor: "#11cdef", borderRadius: "50%" }}
              />
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                style={{ width: "8px", height: "8px", backgroundColor: "#11cdef", borderRadius: "50%" }}
              />
            </motion.div>
          )}
        </CardBody>

        <div style={{ padding: "15px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            style={{ display: "flex", gap: "10px" }}
          >
            <Input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ borderRadius: "20px", backgroundColor: "rgba(255,255,255,0.8)" }}
            />
            <Button 
              color="info" 
              className="rounded-circle p-2" 
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default AITutorFeature;
