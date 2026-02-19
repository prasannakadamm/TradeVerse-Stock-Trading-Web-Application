import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePrices } from "../context/PriceContext";
import Badge from "./Badge";

export default function StockSelector() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentSymbol = searchParams.get("symbol") || "RELIANCE";
    const [activeExchange, setActiveExchange] = useState("IND");
    const { getPrice } = usePrices();

    const stocks = [
        // IND
        { symbol: "RELIANCE", name: "Reliance Industries", exchange: "IND", basePrice: 2456.00 },
        { symbol: "TCS", name: "Tata Consultancy Svc", exchange: "IND", basePrice: 3890.00 },
        { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "IND", basePrice: 1650.00 },
        { symbol: "INFY", name: "Infosys", exchange: "IND", basePrice: 1450.00 },
        { symbol: "ICICIBANK", name: "ICICI Bank", exchange: "IND", basePrice: 1020.00 },
        { symbol: "SBIN", name: "State Bank of India", exchange: "IND", basePrice: 612.00 },
        { symbol: "BHARTIARTL", name: "Bharti Airtel", exchange: "IND", basePrice: 1120.00 },
        { symbol: "ITC", name: "ITC Limited", exchange: "IND", basePrice: 410.00 },
        // USA
        { symbol: "IBM", name: "IBM Corp", exchange: "USA", basePrice: 160.00 },
        { symbol: "TSLA", name: "Tesla Inc", exchange: "USA", basePrice: 235.00 },
        { symbol: "AAPL", name: "Apple Inc", exchange: "USA", basePrice: 185.00 },
        { symbol: "NVDA", name: "NVIDIA Corp", exchange: "USA", basePrice: 540.00 },
    ];

    const handleSelect = (symbol) => {
        const path = window.location.pathname;
        navigate(`${path}?symbol=${symbol}`);
    };

    const filteredStocks = stocks.filter(s => s.exchange === activeExchange);

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-2 mb-4 shrink-0 px-1">
                {['IND', 'USA'].map(ex => (
                    <button
                        key={ex}
                        onClick={() => setActiveExchange(ex)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeExchange === ex
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10'
                            }`}
                    >
                        {ex} {ex === 'IND' ? '🇮🇳' : '🇺🇸'}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {filteredStocks.map((stock) => {
                    const isActive = currentSymbol === stock.symbol;
                    const livePrice = getPrice(stock.symbol);
                    // Fallback to basePrice if no live price, but ideally we wait for context
                    const displayPrice = livePrice ? Number(livePrice).toFixed(2) : stock.basePrice.toFixed(2);
                    const currency = stock.exchange === 'USA' ? '$' : '₹';

                    // Mock change logic based on price deviation from base (just for demo consistency)
                    const changeVal = livePrice ? ((livePrice - stock.basePrice) / stock.basePrice) * 100 : 0;
                    const changeStr = (changeVal >= 0 ? "+" : "") + changeVal.toFixed(2) + "%";
                    const isPositive = changeVal >= 0;

                    return (
                        <button
                            key={stock.symbol}
                            onClick={() => handleSelect(stock.symbol)}
                            className={`flex justify-between items-center p-3 rounded-lg border transition-all group shrink-0 ${isActive
                                ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20'
                                : 'bg-transparent border-transparent hover:bg-[var(--text-primary)]/5 hover:border-[var(--text-primary)]/5'
                                }`}
                        >
                            <div className="text-left overflow-hidden">
                                <div className={`font-bold text-sm truncate ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                                    {stock.symbol}
                                </div>
                                <div className={`text-xs truncate ${isActive ? 'text-blue-200' : 'text-[var(--text-secondary)]'}`}>
                                    {stock.name}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-xs font-mono font-medium ${isActive ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                                    {currency}{displayPrice}
                                </div>
                                <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'
                                    } ${isActive ? '!text-white/90' : ''}`}>
                                    {changeStr}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
