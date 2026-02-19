import { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Card from "../components/Card";
import TradePanel from "../components/TradePanel";

const WatchlistRow = ({ stock, onTrade }) => {
  const isPositive = stock.change.startsWith('+');

  // Mock sparkline data
  const data = [
    { v: 100 }, { v: 105 }, { v: 102 }, { v: 108 }, { v: 107 }, { v: 112 }, { v: 110 }, { v: 115 }
  ];

  return (
    <tr className="border-b border-[var(--text-muted)]/10 hover:bg-[var(--text-primary)]/5 transition-colors group">
      <td className="p-4">
        <div className="font-bold text-[var(--text-primary)]">{stock.symbol}</div>
        <div className="text-xs text-[var(--text-secondary)]">{stock.name}</div>
      </td>
      <td className="p-4 font-mono font-medium text-[var(--text-primary)]">{stock.price}</td>
      <td className={`p-4 font-mono font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {stock.change}
      </td>
      <td className="p-4 w-32 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={() => onTrade(stock)}
          className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg shadow-blue-500/20 transition-all transform translate-x-2 group-hover:translate-x-0"
        >
          Trade
        </button>
      </td>
    </tr>
  );
};

export default function Watchlist() {
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  const watchlist = [
    { symbol: "RELIANCE", name: "Reliance Industries", price: "2,456.00", change: "+1.2%" },
    { symbol: "TCS", name: "Tata Consultancy Svc", price: "3,890.00", change: "-0.5%" },
    { symbol: "HDFCBANK", name: "HDFC Bank", price: "1,650.00", change: "+0.8%" },
    { symbol: "INFY", name: "Infosys", price: "1,450.00", change: "+1.5%" },
    { symbol: "ICICIBANK", name: "ICICI Bank", price: "1,020.00", change: "-0.2%" },
    { symbol: "SBIN", name: "State Bank of India", price: "612.00", change: "+0.4%" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel", price: "1,120.00", change: "+0.9%" },
    { symbol: "ITC", name: "ITC Limited", price: "410.00", change: "-0.1%" },
    { symbol: "IBM", name: "IBM Corp", price: "$160.00", change: "+0.5%" },
    { symbol: "TSLA", name: "Tesla Inc", price: "$235.00", change: "+1.2%" },
    { symbol: "AAPL", name: "Apple Inc", price: "$185.00", change: "-0.4%" },
    { symbol: "NVDA", name: "NVIDIA Corp", price: "$540.00", change: "+3.5%" },
  ];

  const filtered = watchlist.filter(s => s.symbol.includes(search.toUpperCase()));

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Watchlist</h1>
          <p className="text-[var(--text-secondary)]">Monitor your favorite assets in real-time.</p>
        </div>
        <div className="relative group">
          <input
            type="search"
            placeholder="Search Assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[var(--text-primary)]/5 border border-[var(--text-muted)]/20 rounded-lg py-2.5 pl-10 pr-4 text-sm w-64 focus:w-80 transition-all outline-none focus:border-blue-500 group-hover:bg-[var(--text-primary)]/10 shadow-sm"
          />
          <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3 pointer-events-none opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-primary)]/50 text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--text-muted)]/10">
              <th className="p-4">Asset</th>
              <th className="p-4">Price</th>
              <th className="p-4">24h Change</th>
              <th className="p-4">Trend (7d)</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(stock => (
              <WatchlistRow key={stock.symbol} stock={stock} onTrade={setSelectedStock} />
            ))}
          </tbody>
        </table>
      </Card>

      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedStock(null)}>
          <div className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--text-muted)]/10">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Trade {selectedStock.symbol}</h3>
              <button onClick={() => setSelectedStock(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>
            <TradePanel symbol={selectedStock.symbol} />
          </div>
        </div>
      )}
    </div>
  );
}
