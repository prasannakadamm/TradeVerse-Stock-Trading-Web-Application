export function buildCandle(prev, price, time) {
  if (!prev) {
    return { time, open: price, high: price, low: price, close: price };
  }

  return {
    time,
    open: prev.open,
    high: Math.max(prev.high, price),
    low: Math.min(prev.low, price),
    close: price
  };
}
