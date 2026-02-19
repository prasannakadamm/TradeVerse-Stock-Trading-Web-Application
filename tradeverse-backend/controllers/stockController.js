const Stock = require("../models/Stock");

exports.getStocks = async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
};
