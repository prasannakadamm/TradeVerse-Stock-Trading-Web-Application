const Trade = require("../models/Trade");

exports.tradeReport = async (req, res) => {
  const trades = await Trade.find({ userId: req.userId });

  let profit = 0;
  let loss = 0;

  trades.forEach(t => {
    if (t.type === "SELL") profit += t.price * t.quantity;
    else loss += t.price * t.quantity;
  });

  res.json({
    totalTrades: trades.length,
    profit,
    loss,
    net: profit - loss
  });
};
