import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const { currency, setCurrency } = useContext(ThemeContext); // Removed dark/toggleTheme as we are enforcing Dark Mode

  // Local state for trading settings
  const [tradingSettings, setTradingSettings] = useState({
    defaultQuantity: 1,
    riskLimit: "5%",
    leverage: "1x",
    defaultOrderType: "MARKET",
    oneClickTrading: false,
    notifications: {
      orderFill: true,
      priceAlerts: true,
      news: false
    }
  });

  const handleTradingChange = (field, value) => {
    setTradingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setTradingSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field]
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'trading', label: 'Trading Preferences', icon: '📈' },
  ];

  return (
    <div className="p-6 max-w-[1000px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your workspace and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <div className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card title="Display Settings">
                <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                  <div>
                    <h4 className="text-white font-medium">Theme Mode</h4>
                    <p className="text-sm text-slate-500">System appearance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge type="info">Dark Mode Only</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                  <div>
                    <h4 className="text-white font-medium">Base Currency</h4>
                    <p className="text-sm text-slate-500">Portfolio valuation currency</p>
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-blue-500"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <Card className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/5">
                  👤
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{JSON.parse(localStorage.getItem("user"))?.name || "Trader"}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge type="success">Active</Badge>
                    <Badge type="info">Pro Plan</Badge>
                  </div>
                </div>
              </Card>

              <Card title="Account Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem label="Account ID" value={`#TRD-${Math.floor(Math.random() * 100000) + 10000}`} />
                  <DetailItem label="Email" value={JSON.parse(localStorage.getItem("user"))?.email || "user@tradeverse.com"} />
                  <DetailItem label="Account Type" value="Paper Trading / Demo" />
                  <DetailItem label="Member Since" value={new Date().toLocaleDateString()} />
                  <DetailItem label="Region" value={currency === "INR" ? "India (NSE)" : "USA (NYSE/NASDAQ)"} />
                </div>
              </Card>

              <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-6">
                <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Resetting your account will wipe all transaction history and portfolio data.
                </p>
                <button
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-colors"
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all paper trading data? This action is irreversible.")) {
                      localStorage.removeItem('portfolio');
                      alert("Account reset successfully. (Simulated)");
                    }
                  }}
                >
                  Reset Account Data
                </button>
              </div>
            </div>
          )}

          {activeTab === "trading" && (
            <div className="space-y-6">
              <Card title="Order Configuration">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Default Quantity</label>
                    <input
                      type="number"
                      value={tradingSettings.defaultQuantity}
                      onChange={(e) => handleTradingChange("defaultQuantity", e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Default Leverage</label>
                    <select
                      value={tradingSettings.leverage}
                      onChange={(e) => handleTradingChange("leverage", e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    >
                      <option value="1x">1x (Cash)</option>
                      <option value="2x">2x (Margin)</option>
                      <option value="5x">5x (Intraday)</option>
                      <option value="10x">10x (Pro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Risk Limit (Stop Loss)</label>
                    <input
                      type="text"
                      value={tradingSettings.riskLimit}
                      onChange={(e) => handleTradingChange("riskLimit", e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Default Order Type</label>
                    <select
                      value={tradingSettings.defaultOrderType}
                      onChange={(e) => handleTradingChange("defaultOrderType", e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                    >
                      <option value="MARKET">Market</option>
                      <option value="LIMIT">Limit</option>
                      <option value="STOP">Stop Loss</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/5">
                  <div>
                    <div className="text-white font-medium">One-Click Trading</div>
                    <div className="text-sm text-slate-500">Execute without confirmation</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={tradingSettings.oneClickTrading}
                      onChange={(e) => handleTradingChange("oneClickTrading", e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </Card>

              <Card title="Notifications">
                <div className="space-y-4">
                  {[
                    { id: 'orderFill', label: 'Order Fills & Executions', desc: 'Get notified when your order is placed.' },
                    { id: 'priceAlerts', label: 'Price Alerts', desc: 'Alerts when price hits your target.' },
                    { id: 'news', label: 'Major Market News', desc: 'Breaking news impacting your portfolio.' }
                  ].map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={tradingSettings.notifications[item.id]}
                        onChange={() => handleNotificationChange(item.id)}
                        className="mt-1 w-4 h-4 accent-blue-600 bg-slate-900 border-white/10 rounded"
                      />
                      <div>
                        <div className="text-white font-medium text-sm">{item.label}</div>
                        <div className="text-slate-500 text-xs">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">{label}</p>
    <p className="text-white font-medium text-lg font-mono">{value}</p>
  </div>
);
