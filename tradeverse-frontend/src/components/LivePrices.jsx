import { useEffect, useState } from "react";
import io from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "http://localhost:5000";
const socket = io(socketUrl);

export default function LivePrices() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    socket.on("prices", data => setPrices(data));
  }, []);

  return (
    <div>
      {prices.map(s => (
        <div key={s.symbol}>{s.symbol}: ₹{s.price.toFixed(2)}</div>
      ))}
    </div>
  );
}
