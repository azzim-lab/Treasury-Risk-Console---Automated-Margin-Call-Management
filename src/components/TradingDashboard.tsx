import { Trade, FXRate, MonteCarloResult } from "@/types/trading";
import { KPICards } from "./KPICards";
import { FXRateDisplay } from "./FXRateDisplay";
import { TradeDataTable } from "./TradeDataTable";
import { MonteCarloChart } from "./MonteCarloChart";
import { MarginCallAlerts } from "./MarginCallAlerts";
import { RiskDistributionChart } from "./RiskDistributionChart";

interface TradingDashboardProps {
  trades: Trade[];
  fxRate: FXRate | null;
  monteCarloResults: MonteCarloResult[];
}

export const TradingDashboard = ({ trades, fxRate, monteCarloResults }: TradingDashboardProps) => {
  const marginCallTrades = trades.filter(trade => trade.isMarginCall);
  const totalNotional = trades.reduce((sum, trade) => sum + (trade.quantity * trade.price), 0);
  const totalPnL = trades.reduce((sum, trade) => sum + trade.mtmPnL, 0);
  const autoProcessedCount = trades.filter(trade => !trade.isMarginCall).length;
  
  const kpiMetrics = {
    totalTrades: trades.length,
    marginCalls: marginCallTrades.length,
    autoProcessed: autoProcessedCount,
    timeSaved: Math.floor(autoProcessedCount * 0.75), // 45 min per trade saved
    averageProcessingTime: 2.3, // minutes
    riskExposure: totalNotional
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KPICards metrics={kpiMetrics} />
        </div>
        <div>
          <FXRateDisplay fxRate={fxRate} />
        </div>
      </div>

      {/* Alerts Section */}
      {marginCallTrades.length > 0 && (
        <MarginCallAlerts marginCallTrades={marginCallTrades} />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MonteCarloChart results={monteCarloResults} />
        <RiskDistributionChart trades={trades} />
      </div>

      {/* Trade Data Table */}
      <TradeDataTable trades={trades} />
    </div>
  );
};