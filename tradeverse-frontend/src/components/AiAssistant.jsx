import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I am your AI Trading Assistant. Ask me to analyze a stock or help you learn trading concepts." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Context-aware greeting
    useEffect(() => {
        if (location.pathname.includes("/company")) {
            const params = new URLSearchParams(location.search);
            const symbol = params.get("symbol");
            if (symbol) {
                setMessages(prev => [...prev, { role: "ai", text: `I see you are looking at ${symbol}. Would you like a technical analysis?` }]);
            }
        }
    }, [location]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

        // Force Simulation if key is visibly invalid or missing
        // This regex checks for basic structure of a real key or if it's the known placeholder
        const isInvalidKey = !apiKey || apiKey.startsWith("sk-or-v1") || apiKey.length < 20;

        if (isInvalidKey) {
            fallbackToSimulation(input, isInvalidKey);
            return;
        }

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful expert stock trading assistant. Keep answers concise. Focus on technical analysis, stock market concepts, and trading strategies." },
                        ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
                        { role: "user", content: input }
                    ]
                })
            });

            if (!response.ok) throw new Error("API Error");

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                setMessages(prev => [...prev, { role: "ai", text: data.choices[0].message.content }]);
                setLoading(false);
            } else {
                throw new Error("Invalid Format");
            }
        } catch (error) {
            console.error("AI API Failed:", error);
            // Fallback to simulation but notify user if it was an API error
            setMessages(prev => [...prev, { role: "ai", text: `[SYSTEM] Connection to OpenAI failed (${error.message}). Switching to offline simulation mode.` }]);
            fallbackToSimulation(input, true);
        }
    };

    const fallbackToSimulation = (query, isKeyIssue) => {
        setTimeout(() => {
            const aiResponse = generateAiResponse(query);
            // Only warn once per session or be very subtle
            const warning = isKeyIssue ? "[AI SIMULATION MODE] " : "";
            setMessages(prev => [...prev, { role: "ai", text: warning + aiResponse }]);
            setLoading(false);
        }, 800);
    };

    const generateAiResponse = (query) => {
        const q = query.toLowerCase();

        if (q.includes("analyze") || q.includes("buy") || q.includes("sell")) {
            const sentiment = Math.random() > 0.5 ? "BULLISH" : "BEARISH";
            const rsi = Math.floor(Math.random() * 40) + 30; // 30-70
            return `[DEMO MODE] Based on simulated technical indicators, the trend is **${sentiment}**. RSI is currently at ${rsi}. (Add VITE_OPENAI_API_KEY to .env for real AI)`;
        }

        if (q.includes("learn") || q.includes("what is")) {
            return "[DEMO MODE] Trading involves buying and selling financial instruments. RSI (Relative Strength Index) measures momentum. MACD shows trend direction. (Add VITE_OPENAI_API_KEY to .env for real AI)";
        }

        if (q.includes("hello") || q.includes("hi")) {
            return "Hi there! Ready to dominate the markets today?";
        }

        return "[DEMO MODE] I can analyze stocks or explain trading terms. Please configure your OpenAI API Key in frontend/.env to unlock full intelligence.";
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
          width: 380px;
          height: 600px;
          max-height: calc(100vh - 120px); /* Prevent top overflow */
          max-width: calc(100vw - 40px);   /* Prevent side overflow on mobile */
          background: rgba(15, 23, 42, 0.85);
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

        /* Mobile specific adjustments */
        @media (max-width: 480px) {
            .chat-window {
                width: calc(100vw - 32px);
                right: -10px; /* Aligns with button visually */
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
        
        .msg {
           padding: 12px 16px;
           border-radius: 16px;
           font-size: 0.95rem;
           line-height: 1.5;
           max-width: 85%;
           word-wrap: break-word;
           animation: fadeInMsg 0.3s ease-out;
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
                            <div key={i} className={`msg ${m.role}`}>
                                {m.text}
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

                    <div className="chat-input-area">
                        <input
                            className="chat-input"
                            placeholder="Ask about markets..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button className="send-btn" onClick={handleSend}>
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
