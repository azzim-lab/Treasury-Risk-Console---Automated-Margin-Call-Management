import { Trade, FXRate, MonteCarloResult } from "@/types/trading";

const SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX',
  'BRK.A', 'JNJ', 'JPM', 'V', 'WMT', 'PG', 'HD', 'BAC', 'MA', 'DIS',
  'ADBE', 'CRM', 'ORCL', 'CSCO', 'INTC', 'PFE', 'KO', 'PEP', 'T', 'VZ'
];

let currentFXRate = 1.35; // USD/SGD base rate

export const generateTradeData = (count: number): Trade[] => {
  const trades: Trade[] = [];
  
  for (let i = 0; i < count; i++) {
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const quantity = Math.floor(Math.random() * 10000) + 100;
    const price = Math.random() * 500 + 50;
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const currency = Math.random() > 0.3 ? 'USD' : 'SGD';
    
    // Calculate P&L with some volatility
    const volatility = (Math.random() - 0.5) * 0.2; // ±10%
    const mtmPnL = quantity * price * volatility;
    
    // Calculate collateral requirement (typically 2-5% of notional)
    const notional = quantity * price;
    const collateralRequired = notional * (0.02 + Math.random() * 0.03);
    
    // Posted margin varies (sometimes insufficient)
    const postedMargin = collateralRequired * (0.8 + Math.random() * 0.4);
    const marginShortfall = Math.max(0, collateralRequired - postedMargin);
    
    // Determine if margin call is needed
    const isMarginCall = marginShortfall > collateralRequired * 0.01; // 1% threshold
    
    // Risk level based on shortfall percentage
    let riskLevel: Trade['riskLevel'] = 'LOW';
    const shortfallPercent = marginShortfall / collateralRequired;
    if (shortfallPercent > 0.2) riskLevel = 'CRITICAL';
    else if (shortfallPercent > 0.1) riskLevel = 'HIGH';
    else if (shortfallPercent > 0.05) riskLevel = 'MEDIUM';
    
    trades.push({
      id: `TRADE_${Date.now()}_${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Last 24 hours
      symbol,
      quantity,
      price,
      side,
      currency,
      mtmPnL,
      collateralRequired,
      postedMargin,
      marginShortfall,
      isMarginCall,
      riskLevel
    });
  }
  
  return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateFXRate = (): FXRate => {
  // Simulate FX rate movement with some volatility
  const change = (Math.random() - 0.5) * 0.02; // ±1% max change
  const previousRate = currentFXRate;
  currentFXRate = Math.max(1.20, Math.min(1.50, currentFXRate + change));
  
  const actualChange = currentFXRate - previousRate;
  const changePercent = (actualChange / previousRate) * 100;
  
  // Variance trigger if change > 1%
  const isVarianceTrigger = Math.abs(changePercent) > 1.0;
  
  return {
    pair: 'USD/SGD',
    rate: currentFXRate,
    timestamp: new Date(),
    change: actualChange,
    changePercent,
    isVarianceTrigger
  };
};

export const runMonteCarloSimulation = (trades: Trade[], iterations: number): MonteCarloResult[] => {
  const results: MonteCarloResult[] = [];
  
  for (let i = 0; i < iterations; i++) {
    let totalPnL = 0;
    let maxDrawdown = 0;
    let totalCollateral = 0;
    let totalPosted = 0;
    
    // Simulate each trade with random market movements
    trades.forEach(trade => {
      const marketShock = (Math.random() - 0.5) * 0.4; // ±20% market shock
      const simulatedPnL = trade.mtmPnL * (1 + marketShock);
      totalPnL += simulatedPnL;
      
      // Track drawdown
      if (totalPnL < maxDrawdown) {
        maxDrawdown = totalPnL;
      }
      
      totalCollateral += trade.collateralRequired;
      totalPosted += trade.postedMargin;
    });
    
    const marginUtilization = (totalCollateral / totalPosted) * 100;
    
    // Identify outliers (extreme scenarios)
    const isOutlier = Math.abs(totalPnL) > trades.length * 1000 || marginUtilization > 150;
    
    results.push({
      scenarioId: i + 1,
      totalPnL,
      maxDrawdown: Math.abs(maxDrawdown),
      marginUtilization,
      isOutlier
    });
  }
  
  return results.sort((a, b) => b.totalPnL - a.totalPnL);
};