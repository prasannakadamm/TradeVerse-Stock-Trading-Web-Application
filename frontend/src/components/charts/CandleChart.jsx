import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";

export default function CandleChart({ data }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000"
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" }
      }
    });

    const candleSeries = chart.addCandlestickSeries();

    candleSeries.setData(data);

    return () => chart.remove();
  }, [data]);

  return <div ref={chartContainerRef} />;
}
