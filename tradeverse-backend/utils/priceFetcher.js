import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const monitoredStocks = [
    // IND
    { symbol: "RELIANCE", name: "Reliance Industries" },
    { symbol: "TCS", name: "Tata Consultancy Svc" },
    { symbol: "HDFCBANK", name: "HDFC Bank" },
    { symbol: "INFY", name: "Infosys" },
    { symbol: "ICICIBANK", name: "ICICI Bank" },
    { symbol: "SBIN", name: "State Bank of India" },
    { symbol: "BHARTIARTL", name: "Bharti Airtel" },
    { symbol: "ITC", name: "ITC Limited" },
    // USA
    { symbol: "IBM", name: "IBM Corp" },
    { symbol: "TSLA", name: "Tesla Inc" },
    { symbol: "AAPL", name: "Apple Inc" },
    { symbol: "NVDA", name: "NVIDIA Corp" }
];

// Map for specific yahoo symbols
const symbolMap = {
    // IND (NSE)
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "INFY": "INFY.NS",
    "ICICIBANK": "ICICIBANK.NS",
    "SBIN": "SBIN.NS",
    "BHARTIARTL": "BHARTIARTL.NS",
    "ITC": "ITC.NS",
    // USA (No suffix usually for major US stocks on Yahoo)
    "IBM": "IBM",
    "TSLA": "TSLA",
    "AAPL": "AAPL",
    "NVDA": "NVDA"
};
const fallbackPrices = {
    "RELIANCE": 2456.00, "TCS": 3890.00, "HDFCBANK": 1650.00, "INFY": 1450.00,
    "ICICIBANK": 1020.00, "SBIN": 612.00, "BHARTIARTL": 1150.00, "ITC": 422.00,
    "IBM": 185.00, "TSLA": 235.00, "AAPL": 185.00, "NVDA": 540.00
};

let currentPricesMap = { ...fallbackPrices };

export default (io) => {
    console.log("Starting live price fetcher...");

    const fetchPrices = async () => {
        try {
            const promises = monitoredStocks.map(async (stock) => {
                try {
                    const yahooSymbol = symbolMap[stock.symbol] || stock.symbol;
                    const quote = await yahooFinance.quote(yahooSymbol);
                    currentPricesMap[stock.symbol] = quote.regularMarketPrice;
                    return {
                        symbol: stock.symbol,
                        price: quote.regularMarketPrice,
                        change: quote.regularMarketChange,
                        changePercent: quote.regularMarketChangePercent
                    };
                } catch (err) {
                    // Fallback to random walk if Yahoo is blocked (Render IP issue)
                    const oldPrice = currentPricesMap[stock.symbol];
                    const randomChange = (Math.random() - 0.5) * (oldPrice * 0.002); // 0.2% max change
                    const newPrice = oldPrice + randomChange;
                    currentPricesMap[stock.symbol] = newPrice;

                    return {
                        symbol: stock.symbol,
                        price: parseFloat(newPrice.toFixed(2)),
                        change: parseFloat(randomChange.toFixed(2)),
                        changePercent: parseFloat(((randomChange / oldPrice) * 100).toFixed(2))
                    };
                }
            });

            const results = await Promise.all(promises);
            io.emit("prices", results);
        } catch (error) {
            console.error("Error in fetchPrices cycle:", error);
        }
    };

    // Fetch immediately
    fetchPrices();

    // Then every 5 seconds
    setInterval(fetchPrices, 5000);
};
