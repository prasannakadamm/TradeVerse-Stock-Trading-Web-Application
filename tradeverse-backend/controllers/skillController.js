const Trade = require("../models/Trade");

exports.skillReport = async (req, res) => {
  const trades = await Trade.find({ userId: req.userId });

  let wins = 0;
  let losses = 0;

  trades.forEach(t => {
    if (t.type === "SELL") wins++;
    else losses++;
  });

  const total = wins + losses;
  const winRatio = total ? ((wins / total) * 100).toFixed(2) : 0;

  let skill = "Beginner";
  if (winRatio > 60) skill = "Intermediate";
  if (winRatio > 80) skill = "Pro";

  res.json({
    totalTrades: total,
    wins,
    losses,
    winRatio,
    skill
  });
};
