const Portfolio = require("../models/Portfolio");

exports.getPortfolio = async (req, res) => {
  const portfolio = await Portfolio.find({ userId: req.userId });
  res.json(portfolio);
};
