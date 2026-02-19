import React from 'react';

const SentimentBar = ({ value = 65 }) => {
    // value 0-100. <30 Bearish, 30-70 Neutral, >70 Bullish
    let status = 'Neutral';
    let colorClass = 'bg-blue-500';
    let textClass = 'text-blue-400';

    if (value > 70) {
        status = 'Bullish';
        colorClass = 'bg-emerald-500';
        textClass = 'text-emerald-400';
    } else if (value < 30) {
        status = 'Bearish';
        colorClass = 'bg-red-500';
        textClass = 'text-red-400';
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Market Sentiment</span>
                <span className={`text-xs font-bold ${textClass} uppercase tracking-wider`}>{status}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                <div
                    className={`h-full ${colorClass} transition-all duration-1000 ease-out relative`}
                    style={{ width: `${value}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                </div>

                {/* Markers */}
                <div className="absolute left-[30%] top-0 bottom-0 w-[1px] bg-slate-700"></div>
                <div className="absolute left-[70%] top-0 bottom-0 w-[1px] bg-slate-700"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-mono">
                <span>BEAR</span>
                <span>NEUTRAL</span>
                <span>BULL</span>
            </div>
        </div>
    );
};

export default SentimentBar;
