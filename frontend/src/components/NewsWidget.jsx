import React, { useState, useEffect } from 'react';

const NewsWidget = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const generateNews = () => {
            const tickers = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT", "RELIANCE", "TCS"];
            const actions = ["falls", "rallies", "surges", "dips", "steady"];
            const reasons = ["after CEO comments", "due to global trends", "on strong earnings", "amid market uncertainty", "following new product launch"];

            const newArticles = Array.from({ length: 5 }).map((_, i) => {
                const ticker = tickers[Math.floor(Math.random() * tickers.length)];
                const action = actions[Math.floor(Math.random() * actions.length)];
                const reason = reasons[Math.floor(Math.random() * reasons.length)];

                return {
                    id: i,
                    source: ["Bloomberg", "Reuters", "CNBC", "Financial Times"][Math.floor(Math.random() * 4)],
                    headline: `${ticker} ${action} ${reason}`,
                    time: `${Math.floor(Math.random() * 59) + 1}m ago`,
                    sentiment: (action === "surges" || action === "rallies") ? "positive" : "negative"
                };
            });
            setNews(newArticles);
        };

        generateNews();
        const interval = setInterval(generateNews, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-card h-full flex flex-col p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="font-bold text-[var(--text-primary)]">Market News 📰</h2>
                <span className="text-xs text-[var(--text-secondary)]">LIVE FEED</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {news.map((item) => (
                    <div key={item.id} className={`flex flex-col pl-3 border-l-2 ${item.sentiment === 'positive' ? 'border-[var(--success)]' : 'border-[var(--danger)]'}`}>
                        <div className="text-sm font-medium mb-1 text-[var(--text-primary)] line-clamp-2">
                            {item.headline}
                        </div>
                        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                            <span className="font-semibold">{item.source}</span>
                            <span>{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsWidget;
