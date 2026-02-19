import User from "../models/User.js";
// import Portfolio from "../models/Portfolio.js";
// import Transaction from "../models/Transaction.js";

export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parallel fetch for speed
    const user = await User.findById(userId).select("balance name email portfolio transactions");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Sort transactions by date desc in memory
    const sortedTransactions = user.transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance
      },
      holdings: user.portfolio,
      orders: sortedTransactions
    });

  } catch (error) {
    console.error("Portfolio Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching portfolio" });
  }
};
