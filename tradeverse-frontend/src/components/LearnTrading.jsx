import React from 'react';

const LearnTrading = () => {
  return (
    <div className="learn-trading-container" style={{ display: 'grid', gap: '2rem' }}>
      
      {/* Introduction Section */}
      <section className="glass-card">
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>🎓 Stock Market Basics</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          The stock market is a marketplace where buyers and sellers come together to trade shares of publicly held companies. 
          Owning a stock means you own a small piece of that company. The goal is simple: <strong>Buy Low, Sell High</strong> (usually).
        </p>
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--text-primary)' }}>Exchange</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The place where stocks are traded (e.g., NSE, BSE, NYSE).</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--text-primary)' }}>Bull Market</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>When prices are rising and optimism is high 🐂.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--text-primary)' }}>Bear Market</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>When prices are falling and fear prevails 🐻.</p>
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="glass-card">
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>📈 Common Trading Strategies</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Intraday Trading</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Buying and selling stocks within the same trading day. Positions are not carried over to the next day.
              <br/><strong>Risk:</strong> High | <strong>Reward:</strong> Quick returns
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #3b82f6', paddingLeft: '1rem' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Swing Trading</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Holding stocks for a few days to weeks to capture price moves (swings).
              <br/><strong>Risk:</strong> Medium | <strong>Reward:</strong> Moderate
            </p>
          </div>

          <div style={{ borderLeft: '4px solid #8b5cf6', paddingLeft: '1rem' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Long-term Investing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Buying and holding good companies for years. The goal is wealth creation over time.
              <br/><strong>Risk:</strong> Low (if diversified) | <strong>Reward:</strong> Compounding growth
            </p>
          </div>
        </div>
      </section>

      {/* Analysis Methods */}
      <section className="glass-card">
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>🔍 How to Analyze Stocks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Fundamental Analysis</h3>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              <li>Analyzing financial statements (P&L, Balance Sheet)</li>
              <li>Understanding business model & management</li>
              <li>Calculating ratios (P/E, ROE, Debt/Equity)</li>
              <li>Best for: <strong>Investing</strong></li>
            </ul>
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Technical Analysis</h3>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              <li>Reading charts and price patterns</li>
              <li>Using indicators (RSI, MACD, Moving Averages)</li>
              <li>Analyzing volume and trends</li>
              <li>Best for: <strong>Trading</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="glass-card" style={{ border: '1px solid var(--accent-color)' }}>
        <h3 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>💡 Golden Rules for Beginners</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Never invest money you can't afford to lose.</strong></li>
          <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Always use a Stop Loss</strong> to protect your capital in trading.</li>
          <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Don't follow tips blindly.</strong> Do your own research.</li>
          <li>✅ <strong>Start small</strong> and learn from your mistakes.</li>
        </ul>
      </section>

    </div>
  );
};

export default LearnTrading;
