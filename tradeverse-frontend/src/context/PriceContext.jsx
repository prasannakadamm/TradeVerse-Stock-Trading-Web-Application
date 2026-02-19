import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const PriceContext = createContext();

export function PriceProvider({ children }) {
    const [prices, setPrices] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("prices", (data) => {
            // data is array [{symbol, price, change, ...}]
            // Convert to map for O(1) access: { SYMBOL: { price, change, ... } }
            const priceMap = {};
            data.forEach(item => {
                priceMap[item.symbol] = item;
            });
            // console.log("Updated Prices:", priceMap); // Debug
            setPrices(priceMap);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const getPrice = (symbol) => {
        return prices[symbol]?.price || 0;
    };

    const getStockData = (symbol) => {
        return prices[symbol] || null;
    };

    return (
        <PriceContext.Provider value={{ prices, getPrice, getStockData, isConnected }}>
            {children}
        </PriceContext.Provider>
    );
}

export function usePrices() {
    return useContext(PriceContext);
}
