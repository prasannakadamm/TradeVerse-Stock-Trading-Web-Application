import axios from 'axios';

import Portfolio from "../models/Portfolio.js";
import Trade from "../models/Trade.js";

// ... existing imports ...

export const getChatResponse = async (req, res) => {
    const { message, history } = req.body;
    const userId = req.user.id || req.user._id; // Handle both potential JWT structures

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const apiKey = process.env.SARVAM_API_KEY;
        // ... key check ...

        if (!apiKey) {
            // ... error handling ...
            return res.status(500).json({ error: "Server configuration error: API Key missing" });
        }

        // Fetch User Context
        const portfolio = await Portfolio.find({ userId });
        const recentTrades = await Trade.find({ userId }).sort({ createdAt: -1 }).limit(5);

        const portfolioSummary = portfolio.length > 0
            ? portfolio.map(p => `${p.symbol}: ${p.quantity} shares @ $${p.avgPrice}`).join(", ")
            : "No active holdings.";

        const tradesSummary = recentTrades.length > 0
            ? recentTrades.map(t => `${t.type} ${t.quantity} ${t.symbol} @ $${t.price}`).join(", ")
            : "No recent trades.";

        const systemPrompt = `You are TradeBot, an expert AI trading assistant and personal portfolio inspector.
        
        User Context:
        - Current Portfolio: ${portfolioSummary}
        - Recent Trades: ${tradesSummary}
        
        Capabilities & Instructions:
        1. **Personalized Analysis**: Always use the user's portfolio/trades to validate your advice. If they hold a stock, reference it.
        2. **Strategies**: Suggest trading strategies (Swing, Intraday, Long-term) based on current market trends.
        3. **Market Knowledge**: You are an expert in both **Indian (NSE/BSE)** and **US Markets (NYSE/NASDAQ)**. Structure your answers based on the user's focus.
        4. **Education**: Teach trading concepts (RSI, MACD, Candlesticks) when asked.
        5. **Timing**: Explain market timings and best entry/exit points.
        
        **FORMATTING RULES:**
        - Use **Bold** for key terms and stock symbols (e.g., **AAPL**, **RSI**).
        - Use **Lists** (bullet points) for strategies or steps.
        - Use matching **Headings** (###) for sections.
        - Keep answers professional, concise, and actionable. Do NOT use massive blocks of text.
        `;

        // Construct messages array
        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []),
            { role: "user", content: message }
        ];

        // ... existing axios call ...


        // console.log("Sending request to Sarvam with message:", message);

        const response = await axios.post(
            'https://api.sarvam.ai/v1/chat/completions',
            {
                model: "sarvam-m",
                messages: messages,
                max_tokens: 300,
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-subscription-key': apiKey, // Try 'api-subscription-key' header which is common for some enterprise models
                    // 'Authorization': `Bearer ${apiKey}` // Alternative if above fails, can switch back and toggle
                }
            }
        );

        console.log("Sarvam Response Status:", response.status);
        const aiMessage = response.data.choices?.[0]?.message?.content || "No response content";
        console.log("AI Message received:", aiMessage.substring(0, 50) + "...");

        res.json({ reply: aiMessage });

    } catch (error) {
        console.error("Sarvam API Request Failed!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
        res.status(500).json({
            error: "Failed to fetch response from AI provider",
            details: error.response?.data || error.message
        });
    }
};
