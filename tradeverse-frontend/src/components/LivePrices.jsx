import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

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
