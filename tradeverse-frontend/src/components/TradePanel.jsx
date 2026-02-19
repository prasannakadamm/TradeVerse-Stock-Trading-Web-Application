import { useState } from "react";
import { useTrade } from "../context/TradeContext";
import { usePrices } from "../context/PriceContext";

export default function TradePanel({ symbol = "RELIANCE" }) {
  const [qty, setQty] = useState(1);
  const { buyStock, sellStock } = useTrade();
  const { getPrice } = usePrices();
  const [loading, setLoading] = useState(false);

  const currency = ["IBM", "TSLA", "AAPL", "NVDA"].includes(symbol) ? "$" : "₹";
  const rawPrice = getPrice(symbol);
  // Ensure price is a valid number
  const currentPrice = (rawPrice && !isNaN(rawPrice)) ? Number(rawPrice) : 0;

  const handleOrder = async (type) => {
    if (currentPrice <= 0) {
      alert("Waiting for valid price data...");
      return;
    }
    setLoading(true);
    if (type === 'BUY') {
      await buyStock(symbol, qty, currentPrice);
    } else {
      await sellStock(symbol, qty, currentPrice);
    }
    setLoading(false);
  };

  return (
    <div className="p-2">
      <div className="mb-4 text-center">
        <span className="text-[var(--text-secondary)] text-xs">Trading</span>
        <span className="font-bold text-[var(--accent)] mx-1">{symbol}</span>
        <span className="font-mono text-[var(--text-primary)] text-sm">{currentPrice > 0 ? `${currency}${currentPrice.toFixed(2)}` : "..."}</span>
      </div>

      <div className="mb-6">
        <label className="block text-[var(--text-secondary)] mb-2 text-sm font-medium">
          Quantity
        </label>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--text-muted)]/20 rounded-lg text-[var(--text-primary)] text-base focus:border-[var(--primary)] outline-none transition-colors"
        />
        <div className="flex justify-between mt-2 text-xs text-[var(--text-secondary)] font-medium">
          <span>Margin Req:</span>
          <span className="font-mono text-[var(--text-primary)]">{currentPrice > 0 ? `${currency}${(qty * currentPrice).toFixed(2)}` : "--"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          className="btn flex justify-center py-3 rounded-lg font-bold text-white bg-[var(--success)] shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleOrder('BUY')}
          disabled={loading || currentPrice <= 0}
        >
          BUY
        </button>

        <button
          className="btn flex justify-center py-3 rounded-lg font-bold text-white bg-[var(--danger)] shadow-lg shadow-red-500/20 hover:bg-red-500 hover:shadow-red-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleOrder('SELL')}
          disabled={loading}
        >
          SELL
        </button>
      </div>

      <div className="mt-6 text-xs text-[var(--text-secondary)] text-center font-medium opacity-70">
        {loading ? "Processing Order..." : "Market Limit Order • Day"}
      </div>
    </div>
  );
}
