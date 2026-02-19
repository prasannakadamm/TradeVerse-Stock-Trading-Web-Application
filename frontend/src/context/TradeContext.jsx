import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TradeContext = createContext();

export function TradeProvider({ children }) {
  const [user, setUser] = useState(null); // Store full user object
  const [balance, setBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [loading, setLoading] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0);

  // 🔹 FETCH REAL PORTFOLIO FROM DB
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/portfolio", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { user: userData, holdings: holdingsData, orders: ordersData } = res.data;

      setUser(userData);
      setBalance(userData.balance);
      setOrders(ordersData);

      // Convert array to object map
      const holdingsMap = {};
      let totalInvested = 0;
      holdingsData.forEach(h => {
        holdingsMap[h.symbol] = { qty: h.quantity, avgPrice: h.avgPrice };
        // Ideally we use LIVE price, but for now we use avgPrice as a baseline + mock gain
        // In a real app, we would sum (qty * livePrice)
        totalInvested += (h.quantity * h.avgPrice);
      });

      setHoldings(holdingsMap);

      // Calculate Portfolio Value (Cash + Invested)
      // For now, let's assume a 5% gain on invested for the "Value" display if we don't have live prices here
      // Or just sum cost basis.
      setPortfolioValue(totalInvested * 1.05); // Mock 5% gain for display

    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  // 🔹 BUY STOCK
  const buyStock = async (symbol, qty, price) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to trade!");
        return;
      }
      if (!price || price <= 0) {
        alert("Invalid Price!");
        return;
      }
      if (balance < qty * price) {
        alert("Insufficient Balance!");
        return;
      }

      setLoading(true);
      await axios.post("http://localhost:5000/api/trade/buy",
        { symbol, quantity: qty, price: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPortfolio();
      alert(`Successfully bought ${qty} shares of ${symbol}`);

    } catch (error) {
      console.error("Buy Error:", error);
      alert(error.response?.data?.message || "Trade Failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 SELL STOCK
  const sellStock = async (symbol, qty, price) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to trade!");
        return;
      }
      if (!holdings[symbol] || holdings[symbol].qty < qty) {
        alert("Insufficient Holdings!");
        return;
      }

      setLoading(true);
      await axios.post("http://localhost:5000/api/trade/sell",
        { symbol, quantity: qty, price: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPortfolio();
      alert(`Successfully sold ${qty} shares of ${symbol}`);

    } catch (error) {
      console.error("Sell Error:", error);
      alert(error.response?.data?.message || "Trade Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <TradeContext.Provider
      value={{
        user,
        balance,         // Cash Balance
        availableBalance: balance, // Alias for Dashboard
        portfolioValue,  // Invested + Cash or just Invested? Usually "Net Worth" = Cash + Invested
        orders,
        holdings,
        buyStock,
        sellStock,
        fetchPortfolio
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrade() {
  return useContext(TradeContext);
}
