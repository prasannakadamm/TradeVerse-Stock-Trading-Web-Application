import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [marketStatus, setMarketStatus] = useState({
    india: false,
    usa: false,
    formattedTime: ""
  });

  useEffect(() => {
    const checkMarkets = () => {
      const now = new Date();

      // Determine Market Status (Mock Logic for demo based on IST/EST typical hours)
      // India: 9:15 - 15:30 IST (approx 3:45 - 10:00 UTC)
      // USA: 9:30 - 16:00 ET (approx 14:30 - 21:00 UTC)

      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const totalUtcMinutes = utcHours * 60 + utcMinutes;

      const indiaOpen = totalUtcMinutes >= (3 * 60 + 45) && totalUtcMinutes <= (10 * 60);
      const usaOpen = totalUtcMinutes >= (14 * 60 + 30) && totalUtcMinutes <= (21 * 60);

      // Create a nice time string
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);

      setMarketStatus({
        india: indiaOpen,
        usa: usaOpen,
        formattedTime: timeString
      });
    };

    checkMarkets();
    const interval = setInterval(checkMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/company?symbol=${search.trim().toUpperCase()}`);
      setSearch("");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Portfolio", path: "/portfolio", icon: "💼" },
    { name: "Watchlist", path: "/watchlist", icon: "⭐" },
    { name: "Charts", path: "/charts", icon: "📈" },
    { name: "Reports", path: "/reports", icon: "📑" },
    { name: "Company", path: "/company", icon: "🏢" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user && user.role === "admin") {
    navItems.push({ name: "Admin", path: "/admin", icon: "🛡️" });
  }

  return (
    <nav className="w-[260px] h-[calc(100vh-40px)] fixed left-0 top-10 flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--text-muted)]/10 z-50 shadow-xl transition-colors duration-300">
      {/* Header */}
      <div className="p-6 border-b border-[var(--text-muted)]/10">
        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">T</div>
          <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">TradeVerse</span>
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-[var(--text-primary)]/5 border border-[var(--text-muted)]/20 rounded-lg py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] focus:border-blue-500 transition-all outline-none group-hover:bg-[var(--text-primary)]/10 shadow-sm"
          />
          <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-3 pointer-events-none opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/10'
                : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 border border-transparent hover:text-[var(--text-primary)]'
                }`}
            >
              <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
              {item.name}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
            </button>
          );
        })}
      </div>

      {/* Footer / Status */}
      <div className="p-4 border-t border-[var(--text-muted)]/10 bg-[var(--bg-primary)]/50 backdrop-blur-sm">
        <div className="flex justify-between items-center text-xs mb-3">
          <span className="text-[var(--text-secondary)] font-medium">Market Status</span>
          <span className="text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--text-muted)]/20 font-mono bg-[var(--bg-primary)]">{marketStatus.formattedTime}</span>
        </div>
        <div className="flex gap-2">
          <div className={`flex-1 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--text-muted)]/10 text-center ${marketStatus.india ? 'ring-1 ring-emerald-500/50' : ''}`}>
            <div className="text-[10px] text-[var(--text-muted)] font-bold mb-1 tracking-wider">INDIA</div>
            <div className={`text-[10px] font-bold ${marketStatus.india ? 'text-emerald-500' : 'text-red-500'}`}>
              {marketStatus.india ? "● OPEN" : "○ CLOSED"}
            </div>
          </div>
          <div className={`flex-1 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--text-muted)]/10 text-center ${marketStatus.usa ? 'ring-1 ring-emerald-500/50' : ''}`}>
            <div className="text-[10px] text-[var(--text-muted)] font-bold mb-1 tracking-wider">USA</div>
            <div className={`text-[10px] font-bold ${marketStatus.usa ? 'text-emerald-500' : 'text-red-500'}`}>
              {marketStatus.usa ? "● OPEN" : "○ CLOSED"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[var(--text-secondary)] hover:text-white hover:bg-red-500 rounded-lg transition-all shadow-sm border border-[var(--text-muted)]/20 hover:border-red-600 hover:shadow-red-500/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
