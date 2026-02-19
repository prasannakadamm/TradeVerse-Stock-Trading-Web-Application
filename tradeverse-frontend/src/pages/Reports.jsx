import { useState, useEffect } from "react";
import LearnTrading from "../components/LearnTrading";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function Reports() {
    const [activeTab, setActiveTab] = useState("journal");
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/portfolio", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPortfolioData(data);
            }
        } catch (error) {
            console.error("Failed to fetch report data:", error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'journal', label: 'Journal', icon: '📓' },
        { id: 'performance', label: 'Performance', icon: '📊' },
        { id: 'skills', label: 'Skill Progress', icon: '⭐' },
        { id: 'learn', label: 'Academy', icon: '🎓' },
    ];

    return (
        <div className="p-6 max-w-[1200px] mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Trader's Log</h1>
                <p className="text-slate-400">Track your psychology, analyzing performance, and level up.</p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-white/5 pb-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all relative ${activeTab === tab.id
                                ? 'text-white bg-white/5'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {loading ? (
                    <div className="text-center py-12 text-slate-500 animate-pulse">Loading data...</div>
                ) : (
                    <>
                        {activeTab === 'journal' && <TradingJournal trades={portfolioData?.orders || []} />}
                        {activeTab === 'performance' && <PerformanceStats trades={portfolioData?.orders || []} />}
                        {activeTab === 'skills' && <SkillThreshold trades={portfolioData?.orders || []} />}
                        {activeTab === 'learn' && <div className="glass-card"><LearnTrading /></div>}
                    </>
                )}
            </div>
        </div>
    );
}

function TradingJournal({ trades }) {
    if (!trades || trades.length === 0) {
        return (
            <Card className="min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 opacity-50">📓</div>
                <h3 className="text-xl font-bold text-white mb-2">Your journal is empty</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Every professional trader keeps a log. Execute your first trade to start your journey.
                </p>
            </Card>
        );
    }

    return (
        <Card title="Trade History Log" className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400 border-b border-white/5">
                            <th className="p-4">Date</th>
                            <th className="p-4">Symbol</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Qty</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map((t, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 text-slate-300 font-mono text-xs">{new Date(t.date).toLocaleString()}</td>
                                <td className="p-4 font-bold text-white">{t.symbol}</td>
                                <td className="p-4">
                                    <Badge type={t.type === 'BUY' ? 'success' : 'danger'}>{t.type}</Badge>
                                </td>
                                <td className="p-4 font-mono text-slate-300">{t.quantity}</td>
                                <td className="p-4 font-mono text-white">₹{t.price}</td>
                                <td className="p-4 text-right">
                                    <Badge type="neutral">FILLED</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function PerformanceStats({ trades }) {
    const totalTrades = trades.length;
    const buys = trades.filter(t => t.type === 'BUY').length;
    const sells = trades.filter(t => t.type === 'SELL').length;
    const activityLevel = totalTrades > 10 ? "High Frequency" : "Developing";

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Total Trades</h3>
                <div className="text-4xl font-bold text-white mb-2">{totalTrades}</div>
                <div className="text-xs text-emerald-400">Executions</div>
            </Card>

            <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Buy / Sell Ratio</h3>
                <div className="text-4xl font-bold text-indigo-400 mb-2">{buys}<span className="text-slate-600 mx-2">/</span>{sells}</div>
                <div className="text-xs text-slate-500">Long vs Short Bias</div>
            </Card>

            <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="text-slate-400 text-sm font-medium mb-1">Activity Style</h3>
                <div className="text-3xl font-bold text-blue-400 mb-2 truncate">{activityLevel}</div>
                <div className="text-xs text-slate-500">Based on frequency</div>
            </Card>
        </div>
    );
}

function SkillThreshold({ trades }) {
    const tradeCount = trades.length;
    let level = "Novice";
    let progress = 10;
    let nextGoal = 5;
    let color = "text-slate-400";
    let message = "Start your journey. The market awaits.";

    if (tradeCount >= 5 && tradeCount < 20) {
        level = "Apprentice";
        progress = ((tradeCount - 5) / 15) * 100;
        nextGoal = 20 - tradeCount;
        color = "text-blue-400";
        message = "You're getting the hang of it. Focus on consistency.";
    } else if (tradeCount >= 20 && tradeCount < 50) {
        level = "Pro Trader";
        progress = ((tradeCount - 20) / 30) * 100;
        nextGoal = 50 - tradeCount;
        color = "text-emerald-400";
        message = "Excellent discipline! Refine your edge.";
    } else if (tradeCount >= 50) {
        level = "Market Wizard";
        progress = 100;
        nextGoal = 0;
        color = "text-amber-400";
        message = "You are a master of the markets.";
    } else {
        nextGoal = 5 - tradeCount;
        progress = (tradeCount / 5) * 100;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col justify-between">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-4">Current Rank</h3>
                    <div className={`text-5xl font-bold mb-4 ${color}`}>{level}</div>

                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-2 relative">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-mono">
                        <span>0 XP</span>
                        <span>MAX XP</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 mt-6 border border-white/5">
                    {nextGoal > 0 ? (
                        <p className="text-slate-300 text-sm">
                            Execute <span className="text-white font-bold">{nextGoal} more trades</span> to level up.
                        </p>
                    ) : (
                        <p className="text-emerald-400 font-bold text-sm">Max level reached!</p>
                    )}
                </div>
            </Card>

            <Card title="Psychology & Goals">
                <div className="space-y-6">
                    <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                        <h4 className="font-bold text-blue-400 mb-2">💡 Mentor's Note</h4>
                        <p className="text-sm text-slate-300 italic">
                            "{message}"
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Weekly Goals</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${tradeCount > 0 ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-slate-600 text-transparent'}`}>✓</span>
                                Execute at least 1 trade
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${progress > 50 ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-slate-600 text-transparent'}`}>✓</span>
                                Maintain 50% progress
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${level === 'Pro Trader' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-slate-600 text-transparent'}`}>✓</span>
                                Reach Pro Level
                            </li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
