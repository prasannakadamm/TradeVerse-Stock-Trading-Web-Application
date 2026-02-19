import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StockSelector from "../components/StockSelector";
import CandlestickChart from "../components/CandlestickChart";
import TradePanel from "../components/TradePanel";
import { usePrices } from "../context/PriceContext";

export default function Charts() {
  const [searchParams] = useSearchParams();
  const selectedSymbol = searchParams.get("symbol") || "RELIANCE";
  const [timeframe, setTimeframe] = useState("1D");

  const { getPrice } = usePrices();
  const currentPrice = getPrice(selectedSymbol) || 0;

  return (
    <div className="h-[calc(100vh-80px)] p-6 max-w-[1920px] mx-auto overflow-hidden flex flex-col gap-4">
      {/* TOOLBAR */}
      {/* TOOLBAR */}
      <div className="glass-card p-2 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg border border-[var(--text-muted)]/10 shadow-sm">
            <span className="font-bold text-[var(--text-primary)]">{selectedSymbol}</span>
            <span className="text-xs font-bold text-[var(--text-secondary)] px-1.5 py-0.5 rounded bg-[var(--text-primary)]/5">NSE</span>
          </div>
          <div className="h-6 w-px bg-[var(--text-muted)]/20"></div>
          <div className="flex gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--text-muted)]/10">
            {['1m', '5m', '15m', '1h', '4h', 'D', 'W'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-bold rounded transition-all ${timeframe === tf ? 'bg-[var(--primary)] text-white shadow-md shadow-blue-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5'}`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pr-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors border border-transparent hover:border-[var(--text-muted)]/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Indicators
          </button>
          <button className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--text-muted)]/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 flex-1 min-h-0">
        {/* LEFT: SELECTOR */}
        <div className="glass-card p-0 overflow-hidden flex flex-col h-full">
          <div className="p-3 border-b border-white/5 font-medium text-slate-300">Instruments</div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <StockSelector />
          </div>
        </div>

        {/* CENTER: CHART */}
        <div className="glass-card p-0 relative overflow-hidden h-full flex flex-col bg-slate-900/50">
          {/* Floating Info */}
          <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
            <span className="text-3xl font-bold font-mono text-white/90">
              {["IBM", "TSLA", "AAPL", "NVDA"].includes(selectedSymbol) ? "$" : "₹"}
              {currentPrice.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-emerald-400">+1.25% (Today)</span>
          </div>

          <div className="flex-1 w-full relative">
            {/* Pass currentPrice to chart to update the last candle */}
            <CandlestickChart key={selectedSymbol} symbol={selectedSymbol} currentPrice={currentPrice} />
          </div>
        </div>

        {/* RIGHT: TRADE PANEL */}
        <div className="glass-card p-0 overflow-hidden h-full flex flex-col">
          <div className="p-3 border-b border-white/5 font-medium text-slate-300">Place Order</div>
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <TradePanel symbol={selectedSymbol} />
          </div>

          {/* Market Depth Placeholder */}
          <div className="h-1/3 border-t border-white/5 p-4 bg-black/20">
            <div className="text-xs font-bold text-slate-500 mb-2 uppercase">Market Depth</div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Bid</span>
              <span>Ask</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between">
                  <span className="text-emerald-500/80">{currentPrice - i * 0.05}</span>
                  <span className="text-red-500/80">{currentPrice + i * 0.05}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
