export interface Trade {
  id: string;
  timestamp: Date;
  symbol: string;
  quantity: number;
  price: number;
  side: 'BUY' | 'SELL';
  currency: 'USD' | 'SGD';
  mtmPnL: number;
  collateralRequired: number;
  postedMargin: number;
  marginShortfall: number;
  isMarginCall: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface FXRate {
  pair: string;
  rate: number;
  timestamp: Date;
  change: number;
  changePercent: number;
  isVarianceTrigger: boolean;
}

export interface MonteCarloResult {
  scenarioId: number;
  totalPnL: number;
  maxDrawdown: number;
  marginUtilization: number;
  isOutlier: boolean;
}

export interface KPIMetrics {
  totalTrades: number;
  marginCalls: number;
  autoProcessed: number;
  timeSaved: number;
  averageProcessingTime: number;
  riskExposure: number;
}