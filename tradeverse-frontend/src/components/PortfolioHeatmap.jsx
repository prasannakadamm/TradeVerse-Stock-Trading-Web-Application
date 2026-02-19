import React from 'react';

const PortfolioHeatmap = ({ holdings, prices }) => {
    if (!holdings || Object.keys(holdings).length === 0) {
        return <div className="text-slate-500 text-sm text-center py-4">No holdings to display</div>;
    }

    // Calculate total value to determine box sizes (simplified as equal size for now for grid, or weight based)
    // For a visual heatmap, we'll sort by performance

    // Convert holdings object to array [ {symbol, ...data}, ... ]
    const data = Object.entries(holdings).map(([symbol, data]) => {
        const change = prices[symbol]?.changePercent || 0;
        return { symbol, ...data, change };
    }).sort((a, b) => b.change - a.change); // Best performers first


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 h-full">
            {data.map((item) => {
                const isPositive = item.change >= 0;
                const opacity = Math.min(Math.abs(item.change) / 3, 1) * 0.8 + 0.2; // Opacity based on magnitude, min 0.2
                const colorBase = isPositive ? '16, 185, 129' : '239, 68, 68'; // Emerald or Red

                return (
                    <div
                        key={item.symbol}
                        className="rounded-md p-2 flex flex-col justify-center items-center relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02] hover:z-10"
                        style={{
                            backgroundColor: `rgba(${colorBase}, ${opacity})`,
                            minHeight: '80px'
                        }}
                    >
                        <span className="text-white font-bold text-sm z-10 drop-shadow-md">{item.symbol}</span>
                        <span className="text-white/90 text-xs font-mono z-10 drop-shadow-md">
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default PortfolioHeatmap;
