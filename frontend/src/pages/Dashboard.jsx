import { useState, useEffect } from "react";
import { useTrade } from "../context/TradeContext";
import Card from "../components/Card";
import StatWidget from "../components/StatWidget";
import SentimentBar from "../components/SentimentBar";
import PortfolioHeatmap from "../components/PortfolioHeatmap";
import NewsWidget from "../components/NewsWidget";
import TradePanel from "../components/TradePanel";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePrices } from "../context/PriceContext";

export default function Dashboard() {
  const { user, portfolioValue = 0, availableBalance = 0, holdings = {}, orders = [] } = useTrade();
  const { prices } = usePrices();

  // Calculate generic daily P&L (mock logic)
  const dayPnL = portfolioValue * 0.015; // 1.5% daily gain mock
  const isPositive = dayPnL >= 0;

  // Sentiment (0-100)
  const sentimentValue = 65; // Slightly Bullish

  const [showQuickTrade, setShowQuickTrade] = useState(false);

  // Stats Data
  const stats = [
    { title: "Net Worth", value: `₹${portfolioValue.toLocaleString()}`, change: "-0.00%", isPositive: false, icon: "$" },
    { title: "Available Balance", value: `₹${availableBalance.toLocaleString()}`, change: "0.00%", isPositive: true, icon: "💳" },
    { title: "Today's P&L", value: `₹${Math.abs(dayPnL).toFixed(2)}`, change: isPositive ? "Win" : "Loss", isPositive: isPositive, icon: "📈" },
    { title: "Open Positions", value: Object.keys(holdings || {}).length, change: "Active", isPositive: true, icon: "📊" },
  ];

  const marketMovers = [
    { symbol: "ICICIBANK", price: "1355.40", change: "-2.04%" },
    { symbol: "ITC", price: "422.45", change: "+1.21%" },
    { symbol: "SBIN", price: "877.00", change: "+1.01%" },
    { symbol: "INFY", price: "1642.70", change: "-1.01%" },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent mb-2">
            Command Center
          </h1>
          <p className="text-[var(--text-secondary)]">
            Welcome back, <span className="font-semibold text-[var(--accent)]">{user?.name || 'Trader'}</span>. Market is active.
          </p>
        </div>

        <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="hidden md:block w-48">
            <SentimentBar value={sentimentValue} />
          </div>
          <button
            onClick={() => setShowQuickTrade(true)}
            className="btn btn-primary shadow-lg shadow-blue-500/20 animate-pulse-slow"
          >
            ⚡ Quick Trade
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="animate-fade-in" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
            <StatWidget {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Market Movers">
              <div className="space-y-3 mt-4">
                {marketMovers.map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-[var(--text-muted)]/10 last:border-0 hover:bg-[var(--text-primary)]/5 px-2 rounded -mx-2 transition-colors cursor-pointer">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">{m.symbol}</div>
                      <div className="text-xs text-[var(--text-secondary)]">₹{m.price}</div>
                    </div>
                    <div className={`font-mono font-bold ${m.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                      {m.change}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Portfolio Heatmap" className="min-h-[300px]">
              <div className="h-full pt-4">
                <PortfolioHeatmap holdings={holdings} prices={prices} />
              </div>
            </Card>
          </div>

          <Card title="Performance Analytics">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: '09:30', value: 42000 },
                  { name: '10:30', value: 42150 },
                  { name: '11:30', value: 41900 },
                  { name: '12:30', value: 42300 },
                  { name: '13:30', value: 42450 },
                  { name: '14:30', value: 42380 },
                  { name: '15:30', value: 42600 },
                ]}>
                  <defs>
                    <linearGradient id="colorDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorDash)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Recent Activity" className="overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-secondary)]">No recent activity.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--text-muted)]/10">
                      <th className="p-4">Time</th>
                      <th className="p-4">Symbol</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Price</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o, i) => (
                      <tr key={i} className="border-b border-[var(--text-muted)]/5 hover:bg-[var(--text-primary)]/5 transition-colors">
                        <td className="p-4 text-xs font-mono text-[var(--text-secondary)]">{new Date(o.date).toLocaleTimeString()}</td>
                        <td className="p-4 font-bold text-[var(--text-primary)]">{o.symbol}</td>
                        <td className={`p-4 font-bold text-xs ${o.type === 'BUY' ? 'text-emerald-500' : 'text-red-500'}`}>{o.type}</td>
                        <td className="p-4 font-mono text-[var(--text-primary)]">₹{o.price}</td>
                        <td className="p-4 text-right">
                          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold">FILLED</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          <NewsWidget />

          <Card className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 border border-[var(--primary)]/20">
            <h3 className="text-[var(--text-primary)] font-bold mb-2">Pro Tip 💡</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Diversification is key. Don't put all your eggs in one basket. Monitor the heatmap to see exposure risks.
            </p>
          </Card>
        </div>
      </div>

      {showQuickTrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowQuickTrade(false)}>
          <div className="glass-card w-full max-w-sm overflow-hidden shadow-2xl shadow-blue-500/10 ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-[var(--text-muted)]/10 bg-[var(--bg-secondary)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Quick Trade</h3>
              <button onClick={() => setShowQuickTrade(false)} className="p-1 rounded hover:bg-[var(--text-primary)]/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 bg-[var(--bg-primary)]">
              <TradePanel symbol="RELIANCE" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
