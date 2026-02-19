import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import Trade from "../models/Trade.js";

// BUY STOCK
export const buyStock = async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalCost = quantity * price;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 1. Deduct Balance (User)
    user.balance -= totalCost;

    // 2. Update Embedded Portfolio (User)
    const portfolioItem = user.portfolio.find(p => p.symbol === symbol);
    let newAvgPrice = price;

    if (portfolioItem) {
      const totalValue = (portfolioItem.quantity * portfolioItem.avgPrice) + totalCost;
      const newQuantity = portfolioItem.quantity + quantity;
      newAvgPrice = totalValue / newQuantity;

      portfolioItem.avgPrice = newAvgPrice;
      portfolioItem.quantity = newQuantity;
    } else {
      user.portfolio.push({
        symbol,
        quantity,
        avgPrice: price
      });
    }

    // 3. Record Embedded Transaction (User)
    user.transactions.push({
      symbol,
      type: "BUY",
      quantity,
      price
    });

    await user.save();

    // --- DUAL WRITE: Separate Collections ---

    // A. Record Transaction
    await Transaction.create({
      userId,
      symbol,
      type: "BUY",
      quantity,
      price
    });

    // B. Record Trade History
    await Trade.create({
      userId,
      symbol,
      type: "BUY",
      quantity,
      price,
      profitLoss: 0
    });

    // C. Update Portfolio Collection
    let portDoc = await Portfolio.findOne({ userId, symbol });
    if (portDoc) {
      portDoc.quantity += quantity;
      // Recalculate avg price for the separate doc too (should match embedded)
      const currentVal = (portDoc.quantity - quantity) * portDoc.avgPrice; // value before add
      portDoc.avgPrice = (currentVal + totalCost) / portDoc.quantity;
      await portDoc.save();
    } else {
      await Portfolio.create({
        userId,
        symbol,
        quantity,
        avgPrice: price
      });
    }

    // ----------------------------------------

    const updatedItem = user.portfolio.find(p => p.symbol === symbol);
    res.json({ message: `Successfully bought ${quantity} shares of ${symbol}`, balance: user.balance, portfolioItem: updatedItem });

  } catch (error) {
    console.error("Buy Error:", error);
    res.status(500).json({ message: "Server error processing trade" });
  }
};

// SELL STOCK
export const sellStock = async (req, res) => {
  const { symbol, quantity, price } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const portfolioItem = user.portfolio.find(p => p.symbol === symbol);

    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient holdings to sell" });
    }

    // 1. Add Balance (User)
    const totalValue = quantity * price;
    user.balance += totalValue;

    // 2. Update Embedded Portfolio (User)
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity === 0) {
      user.portfolio = user.portfolio.filter(p => p.symbol !== symbol);
    }

    // 3. Record Embedded Transaction (User)
    user.transactions.push({
      symbol,
      type: "SELL",
      quantity,
      price
    });

    await user.save();

    // --- DUAL WRITE: Separate Collections ---

    // A. Record Transaction
    await Transaction.create({
      userId,
      symbol,
      type: "SELL",
      quantity,
      price
    });

    // B. Record Trade History
    // Calculate P/L for this specific trade
    const buyPrice = portfolioItem.avgPrice; // using the avg price as cost basis
    const profitLoss = (price - buyPrice) * quantity;

    await Trade.create({
      userId,
      symbol,
      type: "SELL",
      quantity,
      price,
      profitLoss
    });

    // C. Update Portfolio Collection
    let portDoc = await Portfolio.findOne({ userId, symbol });
    if (portDoc) {
      if (portDoc.quantity <= quantity) {
        await Portfolio.deleteOne({ _id: portDoc._id });
      } else {
        portDoc.quantity -= quantity;
        await portDoc.save();
      }
    }

    // ----------------------------------------

    res.json({ message: `Successfully sold ${quantity} shares of ${symbol}`, balance: user.balance });

  } catch (error) {
    console.error("Sell Error:", error);
    res.status(500).json({ message: "Server error processing trade" });
  }
};
