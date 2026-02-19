import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CandlestickChart from "../components/CandlestickChart";
import Skeleton from "../components/Skeleton";
import TradePanel from "../components/TradePanel";
import StockSelector from "../components/StockSelector";
import { COMPANY_DATA } from "../utils/mockData";
import { usePrices } from "../context/PriceContext";
import Card from "../components/Card";
import Badge from "../components/Badge";

const FundamentalRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
    <span className="text-slate-400 text-sm font-medium">{label}</span>
    <span className="text-white font-mono font-semibold">{value}</span>
  </div>
);

export default function Company() {
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState("RELIANCE");
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('BUY');
  const [metrics, setMetrics] = useState(null);

  const { getPrice } = usePrices();
  const livePrice = getPrice(symbol);

  useEffect(() => {
    const querySymbol = searchParams.get("symbol");
    if (querySymbol && querySymbol.toUpperCase() !== symbol) {
      setSymbol(querySymbol.toUpperCase());
    }
  }, [searchParams]);

  // Generic Data Generator
  const generateGenericData = (sym) => {
    const seed = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const basePrice = (seed % 1000) + 100;
    const pe = ((seed % 50) + 10).toFixed(1);
    const mcap = ((seed % 100) + 50).toFixed(1);
    const isUS = ["IBM", "TSLA", "AAPL", "NVDA", "GOOGL", "AMZN", "MSFT", "META"].includes(sym);

    return {
      Symbol: sym,
      Name: `${sym} Corporation`,
      Description: `${sym} is a leading entity in its sector, known for robust performance and strong market presence. It operates globally with a diverse portfolio of products and services.`,
      MarketCapitalization: isUS ? `$${mcap}B` : `₹${mcap},000 Cr`,
      PERatio: pe,
      DividendYield: ((seed % 30) / 10).toFixed(2) + "%",
      Sector: (seed % 2 === 0) ? "Technology" : "Finance",
      "52WeekHigh": (basePrice * 1.2).toFixed(2),
      "52WeekLow": (basePrice * 0.8).toFixed(2),
      basePrice: basePrice
    };
  };

  useEffect(() => {
    const fetchFundamentals = async () => {
      setMetrics(null);
      if (COMPANY_DATA[symbol]) {
        setTimeout(() => setMetrics(COMPANY_DATA[symbol]), 500);
        return;
      }
      setTimeout(() => {
        setMetrics(generateGenericData(symbol));
      }, 800);
    };
    fetchFundamentals();
  }, [symbol]);

  const toggleTrade = (type) => {
    setTradeType(type);
    setShowTradeModal(true);
  };

  const currency = ["IBM", "TSLA", "AAPL", "NVDA", "GOOGL", "AMZN", "MSFT", "META"].includes(symbol) ? "$" : "₹";

  const displayPrice = livePrice > 0 ? livePrice : (metrics?.basePrice || 0);
  const change = getPrice(symbol)?.changePercent || 0;

  return (
    <div className="h-[calc(100vh-80px)] p-6 max-w-[1920px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-full">
        {/* LEFT: SELECTOR */}
        <Card className="h-full flex flex-col p-0 overflow-hidden" title="Market Watch">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <StockSelector />
          </div>
        </Card>

        {/* RIGHT: CONTENT */}
        <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* HEADER */}
          <div className="flex justify-between items-end bg-[var(--bg-secondary)]/30 p-6 rounded-2xl border border-white/5 shadow-inner">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase">{symbol}</h1>
                <div className="h-6 w-px bg-white/10 mx-1"></div>
                <div className="flex items-center gap-2">
                  <Badge type="info">NSE</Badge>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE
                  </div>
                </div>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-mono font-bold text-white tracking-tighter">
                  {currency}{displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-xl font-mono font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </span>
              </div>
              <div className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wide">
                {metrics ? metrics.Name : 'Fetching Asset Profile...'}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleTrade('BUY')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                <span>🚀</span> BUY
              </button>
              <button
                onClick={() => toggleTrade('SELL')}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                <span>📉</span> SELL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* CHART & ABOUT */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="h-[600px] p-0 flex flex-col overflow-hidden shadow-2xl shadow-blue-500/5 ring-1 ring-white/10" title="Technical Analysis">
                <div className="flex-1 w-full relative bg-[var(--bg-secondary)]">
                  {/* Force remount with key when symbol changes */}
                  <CandlestickChart key={symbol} symbol={symbol} currentPrice={displayPrice} />
                </div>
              </Card>

              <Card title={`Company Profile`}>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{metrics?.Name || symbol}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {metrics ? metrics.Description : <Skeleton width="100%" height="60px" />}
                  </p>
                </div>
              </Card>
            </div>

            {/* METRICS */}
            <div className="flex flex-col gap-6">
              <Card title="Market Statistics">
                {metrics ? (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-2">Valuation</div>
                    <FundamentalRow label="Market Cap" value={metrics.MarketCapitalization} />
                    <FundamentalRow label="P/E Ratio" value={metrics.PERatio} />
                    <FundamentalRow label="Dividend Yield" value={metrics.DividendYield} />

                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">Price Action</div>
                    <FundamentalRow label="52W High" value={metrics["52WeekHigh"]} />
                    <FundamentalRow label="52W Low" value={metrics["52WeekLow"]} />
                    <FundamentalRow label="Sector" value={metrics.Sector} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Skeleton height="20px" width="100%" />
                    <Skeleton height="20px" width="100%" />
                    <Skeleton height="20px" width="100%" />
                    <Skeleton height="20px" width="100%" />
                    <Skeleton height="20px" width="100%" />
                  </div>
                )}
              </Card>

              <Card title="Market Sentiment" className="flex-1">
                <div className="h-full flex flex-col justify-center items-center gap-4">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                    <span className="text-2xl font-bold text-white">Neutral</span>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full border-t-transparent border-r-transparent animate-spin-slow"></div>
                  </div>
                  <p className="text-center text-xs text-slate-500">
                    Based on technical indicators and news sentiment analysis.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {showTradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={() => setShowTradeModal(false)}>
          <div className="glass-card w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowTradeModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className={`text-xl font-bold mb-4 ${tradeType === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
              {tradeType} {symbol}
            </h3>
            <TradePanel symbol={symbol} initialType={tradeType} />
          </div>
        </div>
      )}
    </div>
  );
}
