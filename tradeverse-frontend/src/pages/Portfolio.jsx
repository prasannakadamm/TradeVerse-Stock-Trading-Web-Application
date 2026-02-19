import { useState, Fragment } from "react";
import { useTrade } from "../context/TradeContext";
import { usePrices } from "../context/PriceContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import TradePanel from "../components/TradePanel";
import Card from "../components/Card";
import Badge from "../components/Badge";

const PortfolioRow = ({ symbol, data, prices, onSelect, orders }) => {
  const [expanded, setExpanded] = useState(false);

  const currentPrice = prices[symbol]?.price || data.avgPrice;
  const pnl = (currentPrice - data.avgPrice) * data.qty;
  const pnlPercent = (pnl / (data.avgPrice * data.qty)) * 100;

  // Filter recent orders for this symbol
  const stockOrders = orders.filter(o => o.symbol === symbol).slice(0, 5);

  return (
    <Fragment>
      <tr
        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="p-4 flex items-center gap-2">
          <button className="text-slate-500 hover:text-white transition-colors p-1">
            {expanded ? '▼' : '▶'}
          </button>
          <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{symbol}</span>
        </td>
        <td className="p-4 font-mono text-slate-300">{data.qty}</td>
        <td className="p-4 font-mono text-slate-400">₹{data.avgPrice.toFixed(2)}</td>
        <td className="p-4 font-mono text-white">₹{currentPrice.toFixed(2)}</td>
        <td className="p-4">
          <div className={`font-mono font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500">
            {pnlPercent.toFixed(2)}%
          </div>
        </td>
        <td className="p-4 text-right">
          <button
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors shadow-lg shadow-blue-500/20"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(symbol);
            }}
          >
            Trade
          </button>
        </td>
      </tr>

      {/* Expanded Details */}
      {expanded && (
        <tr className="bg-slate-900/50">
          <td colSpan={6} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Recent Transactions</h4>
                {stockOrders.length === 0 ? (
                  <p className="text-xs text-slate-600">No recent orders.</p>
                ) : (
                  <ul className="space-y-1">
                    {stockOrders.map((o, i) => (
                      <li key={i} className="flex justify-between text-xs border-b border-white/5 py-1">
                        <span className={o.type === 'BUY' ? 'text-emerald-500' : 'text-red-500'}>{o.type}</span>
                        <span className="text-slate-400">{o.qty} @ {o.price}</span>
                        <span className="text-slate-600">{new Date().toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Performance Analysis</h4>
                <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <span className="text-slate-400">Total Invested</span>
                  <span className="text-white">₹{(data.qty * data.avgPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                  <span className="text-slate-400">Current Value</span>
                  <span className="text-white">₹{(data.qty * currentPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm py-1">
                  <span className="text-slate-400">Day Change</span>
                  <span className={prices[symbol]?.change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                    {prices[symbol]?.change > 0 ? '+' : ''}{prices[symbol]?.change} ({prices[symbol]?.changePercent?.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default function Portfolio() {
  const { balance, orders, holdings } = useTrade();
  const { prices } = usePrices();
  const [selectedStock, setSelectedStock] = useState(null);

  const data = Object.keys(holdings).length > 0
    ? Object.entries(holdings).map(([symbol, data]) => ({ name: symbol, value: data.qty * data.avgPrice }))
    : [{ name: 'Cash', value: balance }];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExportCSV = () => {
    if (Object.keys(holdings).length === 0) {
      alert("No holdings to export!");
      return;
    }
    // CSV logic remains same
    const headers = ["Symbol", "Quantity", "Avg Price", "Current Price", "Current Value", "P&L"];
    const rows = Object.entries(holdings).map(([symbol, data]) => {
      const currentPrice = prices[symbol]?.price || data.avgPrice;
      const currentValue = currentPrice * data.qty;
      const pnl = currentValue - (data.avgPrice * data.qty);
      return [symbol, data.qty, data.avgPrice.toFixed(2), currentPrice.toFixed(2), currentValue.toFixed(2), pnl.toFixed(2)];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-slate-400">Track and manage your asset allocation.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-white/5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column: Holdings */}
        <div className="space-y-6">
          <Card title="Current Holdings" className="p-0 overflow-hidden">
            {Object.keys(holdings).length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="mb-4">No active holdings found.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Start Trading</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                      <th className="p-4 font-medium">Asset</th>
                      <th className="p-4 font-medium">Qty</th>
                      <th className="p-4 font-medium">Avg. Price</th>
                      <th className="p-4 font-medium">Cur. Price</th>
                      <th className="p-4 font-medium">P&L</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(holdings).map(([symbol, data]) => (
                      <PortfolioRow
                        key={symbol}
                        symbol={symbol}
                        data={data}
                        prices={prices}
                        orders={orders}
                        onSelect={setSelectedStock}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Order History">
            {orders.length === 0 ? (
              <p className="text-slate-500 text-sm">No recent orders.</p>
            ) : (
              <ul className="divide-y divide-white/5">
                {orders.map((o, i) => (
                  <li key={i} className="py-3 flex justify-between items-center group hover:bg-white/5 transition-colors px-2 -mx-2 rounded">
                    <div className="flex items-center gap-3">
                      <Badge type={o.type === 'BUY' ? 'success' : 'danger'}>{o.type}</Badge>
                      <span className="font-bold text-slate-200">{o.symbol}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-white font-mono">{o.qty} @ ₹{o.price}</span>
                      <div className="text-xs text-slate-500">{new Date().toLocaleTimeString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Right Column: Visualizations */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600/20 via-slate-900/40 to-slate-900/60 border-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Portfolio Status</h3>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter">₹{balance.toLocaleString()}</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 shadow-sm border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ACTIVE
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">Settled Funds</div>
              </div>
            </div>
          </Card>

          <Card title="Growth Analysis">
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', value: balance * 0.95 },
                  { name: 'Tue', value: balance * 0.97 },
                  { name: 'Wed', value: balance * 0.96 },
                  { name: 'Thu', value: balance * 0.99 },
                  { name: 'Fri', value: balance * 0.98 },
                  { name: 'Sat', value: balance * 1.01 },
                  { name: 'Sun', value: balance },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Asset Allocation">
            <div className="h-[280px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.length > 0 ? data : [{ name: 'Empty', value: 1 }]}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={1}
                      />
                    ))}
                    {data.length === 0 && <Cell fill="#1e293b" />}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{value}</span>}
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Trade Modal Overlay */}
      {selectedStock && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={() => setSelectedStock(null)}>
          <div
            className="glass-card w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStock(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <TradePanel symbol={selectedStock} />
          </div>
        </div>
      )}
    </div>
  );
}
