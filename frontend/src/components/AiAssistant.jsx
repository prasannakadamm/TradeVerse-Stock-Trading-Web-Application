import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! **TradeBot** here. \n\nI can analyze your **Portfolio**, suggest **Strategies**, or teach you **Trading Concepts**. How can I help?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "Analyze my Portfolio",
        "Suggest a Strategy",
        "Market Outlook (India)",
        "Explain RSI"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading, isOpen]);

    // Context-aware greeting
    useEffect(() => {
        if (location.pathname.includes("/company")) {
            const params = new URLSearchParams(location.search);
            const symbol = params.get("symbol");
            if (symbol) {
                setMessages(prev => [...prev, { role: "ai", text: `I see you are looking at **${symbol}**. Would you like a technical analysis?` }]);
            }
        }
    }, [location]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        const userMsg = { role: "user", text: text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token"); // Retrieve auth token

            // Updated to use relative path (proxied by Vite)
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Send token to backend
                },
                body: JSON.stringify({
                    message: text,
                    // Filter out the initial greeting (index 0) or ensures history starts with user
                    history: messages.slice(1).map(m => ({
                        role: m.role === 'ai' ? 'assistant' : 'user',
                        content: m.text
                    }))
                })
            });

            if (response.status === 401) {
                setMessages(prev => [...prev, { role: "ai", text: "Please log in to use the AI Assistant." }]);
                setLoading(false);
                return;
            }

            if (!response.ok) throw new Error("Backend API Error");

            const data = await response.json();
            if (data.reply) {
                setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
            } else {
                throw new Error("Invalid Format");
            }
        } catch (error) {
            console.error("AI API Failed:", error);
            setMessages(prev => [...prev, { role: "ai", text: `[SYSTEM] Connection to AI Service failed. Please ensure the backend is running and SARVAM_API_KEY is configured.` }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-widget">
            <style>{`
        .ai-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }
        
        .chat-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-color) 0%, #7c3aed 100%);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chat-button:hover { 
            transform: scale(1.1) rotate(5deg); 
            box-shadow: 0 0 30px rgba(124, 58, 237, 0.8);
        }
        
        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 400px;
          height: 600px;
          max-height: calc(100vh - 120px);
          max-width: calc(100vw - 40px);
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom right;
        }

        /* Markdown Styles */
        .markdown-content p { margin-bottom: 0.5rem; }
        .markdown-content ul { padding-left: 1.2rem; margin-bottom: 0.5rem; }
        .markdown-content li { margin-bottom: 0.25rem; }
        .markdown-content strong { color: #fff; font-weight: 600; }
        .markdown-content h3 { font-size: 1.1rem; margin-top: 0.8rem; margin-bottom: 0.4rem; color: var(--accent-color); }
        
        .msg {
           padding: 12px 16px;
           border-radius: 16px;
           font-size: 0.95rem;
           line-height: 1.6;
           max-width: 85%;
           word-wrap: break-word;
           animation: fadeInMsg 0.3s ease-out;
        }
        
        /* ... Mobile Styles ... */
        @media (max-width: 480px) {
            .chat-window {
                width: calc(100vw - 32px);
                right: -10px;
                bottom: 70px;
                height: 500px;
            }
        }
        
        @keyframes slideUp {
           from { opacity: 0; transform: scale(0.9) translateY(20px); }
           to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .chat-header {
           padding: 1.2rem;
           background: linear-gradient(to right, rgba(255,255,255,0.05), transparent);
           border-bottom: 1px solid rgba(255,255,255,0.1);
           display: flex;
           justify-content: space-between;
           align-items: center;
        }
        
        .chat-body {
           flex: 1;
           padding: 1.2rem;
           overflow-y: auto;
           display: flex;
           flex-direction: column;
           gap: 1.2rem;
           scrollbar-width: thin;
           scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        
        @keyframes fadeInMsg {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .msg.ai {
           background: rgba(255,255,255,0.08);
           color: #e2e8f0;
           align-self: flex-start;
           border-bottom-left-radius: 4px;
           border: 1px solid rgba(255,255,255,0.05);
        }
        
        .msg.user {
           background: linear-gradient(135deg, var(--accent-color), #7c3aed);
           color: white;
           align-self: flex-end;
           border-bottom-right-radius: 4px;
           box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .suggestions {
            display: flex;
            gap: 8px;
            padding: 0 1.2rem 1.2rem;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .suggestion-chip {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 0.8rem;
            color: #ccc;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }

        .suggestion-chip:hover {
            background: rgba(255,255,255,0.2);
            color: white;
            border-color: var(--accent-color);
        }
        
        .chat-input-area {
           padding: 1.2rem;
           background: rgba(0,0,0,0.2);
           border-top: 1px solid rgba(255,255,255,0.1);
           display: flex;
           gap: 0.8rem;
        }
        
        .chat-input {
           flex: 1;
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.1);
           border-radius: 12px;
           padding: 10px 16px;
           color: white;
           outline: none;
           font-family: inherit;
           transition: all 0.2s;
        }
        
        .chat-input:focus {
            background: rgba(255,255,255,0.1);
            border-color: var(--accent-color);
        }
        
        .send-btn {
           background: var(--accent-color);
           border: none;
           border-radius: 12px;
           width: 42px;
           height: 42px;
           color: white;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: transform 0.2s;
        }
        
        .send-btn:hover {
            transform: scale(1.05);
            background: var(--accent-hover);
        }
      `}</style>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", letterSpacing: "0.5px" }}>TradeBot AI</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: '1.2rem', padding: '4px' }}>✕</button>
                    </div>

                    <div className="chat-body">
                        {messages.map((m, i) => (
                            <div key={i} className={`msg ${m.role} ${m.role === 'ai' ? 'markdown-content' : ''}`}>
                                {m.role === 'ai' ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {m.text}
                                    </ReactMarkdown>
                                ) : (
                                    m.text
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="msg ai" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', animation: 'bounce 1s infinite 0s' }}></span>
                                <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                                <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                                <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="suggestions">
                        {suggestedQuestions.map((q, i) => (
                            <button key={i} className="suggestion-chip" onClick={() => handleSend(q)}>
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input
                            className="chat-input"
                            placeholder="Ask about markets..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button className="send-btn" onClick={() => handleSend()}>
                            ➤
                        </button>
                    </div>
                </div>
            )}

            <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "💬" : "🤖"}
            </button>
        </div>
    );
}
