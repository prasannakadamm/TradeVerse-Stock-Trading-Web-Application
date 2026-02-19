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

export default (io) => {
    console.log("Starting live price fetcher...");

    const fetchPrices = async () => {
        try {
            const promises = monitoredStocks.map(async (stock) => {
                try {
                    const yahooSymbol = symbolMap[stock.symbol] || stock.symbol;
                    const quote = await yahooFinance.quote(yahooSymbol);
                    return {
                        symbol: stock.symbol,
                        price: quote.regularMarketPrice,
                        change: quote.regularMarketChange,
                        changePercent: quote.regularMarketChangePercent
                    };
                } catch (err) {
                    // console.error(`Error fetching data for ${stock.symbol}:`, err.message);
                    return {
                        symbol: stock.symbol,
                        price: 0,
                        error: true
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
