export default function TickerTape() {
  const indices = [
    { symbol: "S&P 500", price: "4,783.45", change: "+0.54%" },
    { symbol: "NASDAQ", price: "15,123.88", change: "+0.82%" },
    { symbol: "DOW JONES", price: "37,543.12", change: "-0.12%" },
    { symbol: "BTC/USD", price: "45,120.00", change: "+2.34%" },
    { symbol: "ETH/USD", price: "2,430.50", change: "+1.15%" },
    { symbol: "GOLD", price: "2,045.30", change: "+0.25%" },
    { symbol: "OIL (WTI)", price: "72.40", change: "-1.50%" },
    { symbol: "EUR/USD", price: "1.0950", change: "-0.05%" },
    { symbol: "TSLA", price: "235.40", change: "+1.20%" },
    { symbol: "AAPL", price: "185.90", change: "-0.40%" },
    { symbol: "NVDA", price: "540.20", change: "+3.50%" },
  ];

  return (
    <div className="h-10 bg-[var(--bg-primary)] border-b border-[var(--text-muted)]/10 overflow-hidden flex items-center relative z-50">
      <div className="flex animate-marquee whitespace-nowrap gap-12 px-4">
        {[...indices, ...indices, ...indices].map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-xs font-medium">
            <span className="text-[var(--text-primary)] font-bold tracking-wide">{item.symbol}</span>
            <span className="text-[var(--text-secondary)]">{item.price}</span>
            <span className={item.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}>
              {item.change.startsWith("+") ? "▲" : "▼"} {item.change}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Pause on hover */
        .animate-marquee:hover {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
