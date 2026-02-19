import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

export default function CandlestickChart({ symbol = "RELIANCE", currentPrice = 0 }) {
  const chartContainerRef = useRef();
  const [series, setSeries] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [lastCandle, setLastCandle] = useState(null);

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth || 600,
      height: chartContainerRef.current.clientHeight || 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        fixLeftEdge: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
        vertLine: {
          color: 'rgba(59, 130, 246, 0.5)',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: 'rgba(59, 130, 246, 0.5)',
          width: 1,
          style: 3,
        },
      }
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    setSeries(candlestickSeries);
    setChartInstance(chart);

    // Robust Resize handling with ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  // 2. Generate/Fetch History
  useEffect(() => {
    if (!series || !chartInstance) return;

    const generateMockData = (targetPrice) => {
      // Unique seed based on symbol string
      const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

      // Align to midnight UTC to prevent minor second mismatches
      const initialTime = Math.floor(Date.now() / 1000) - (100 * 24 * 60 * 60);
      const midnightTime = initialTime - (initialTime % 86400);


      let price = 100;
      let rawData = [];

      for (let i = 0; i < 100; i++) {
        const volatility = (seed % 15) + (Math.random() * 5) + 5;
        const trend = Math.sin(i / 10 + seed) * (seed % 5);
        const change = (Math.random() - 0.5) * volatility + trend;

        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.abs(Math.random() * volatility * 0.5);
        const low = Math.min(open, close) - Math.abs(Math.random() * volatility * 0.5);

        // Ensure purely ascending daily timestamps
        const time = midnightTime + i * 24 * 60 * 60;

        rawData.push({ time: time, open, high, low, close });
        price = close;
      }

      // Calculate Shift
      const lastGeneratedClose = rawData[rawData.length - 1].close;
      const finalTarget = Number(targetPrice) > 0 ? Number(targetPrice) : (seed % 2000) + 100;
      const shift = finalTarget - lastGeneratedClose;

      const adjustedData = rawData.map(d => ({
        time: d.time, // Explicitly keep time
        open: d.open + shift,
        high: d.high + shift,
        low: d.low + shift,
        close: d.close + shift
      }));

      return adjustedData;
    };

    // If we have a real API, use it. Otherwise use the "Smart Mock"
    const fetchData = async () => {
      const data = generateMockData(currentPrice);
      try {
        if (series) {
          series.setData(data);
          chartInstance.timeScale().fitContent();
          setLastCandle(data[data.length - 1]);
        }
      } catch (err) {
        console.warn("Chart data error", err);
      }
    };

    fetchData();
  }, [symbol, series, chartInstance, currentPrice > 0]);


  // 3. Update Last Candle with Live Price (Real-time updates)
  const lastCandleRef = useRef(null);

  useEffect(() => {
    if (lastCandle) lastCandleRef.current = lastCandle;
  }, [lastCandle]);

  useEffect(() => {
    if (!series || !lastCandleRef.current || !currentPrice || currentPrice <= 0) return;

    const currentCandle = lastCandleRef.current;

    // Ensure clean numbers
    const priceNum = Number(currentPrice);
    if (isNaN(priceNum)) return;

    // Only update if price changed significantly or is new
    if (Math.abs(currentCandle.close - priceNum) < 0.001) return;

    const updatedCandle = {
      ...currentCandle,
      close: priceNum,
      high: Math.max(currentCandle.high, priceNum),
      low: Math.min(currentCandle.low, priceNum)
    };

    try {
      series.update(updatedCandle);
      lastCandleRef.current = updatedCandle;
    } catch (err) {
      // Ignore update errors usually caused by strict ordering during init
      console.warn("Chart update skipped", err);
    }

  }, [currentPrice, series]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
}
