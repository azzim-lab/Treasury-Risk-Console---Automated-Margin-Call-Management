import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Trade } from "@/types/trading";

interface RiskDistributionChartProps {
  trades: Trade[];
}

export const RiskDistributionChart = ({ trades }: RiskDistributionChartProps) => {
  // Risk level distribution for pie chart
  const riskDistribution = [
    { name: 'Low Risk', value: trades.filter(t => t.riskLevel === 'LOW').length, color: 'hsl(var(--success))' },
    { name: 'Medium Risk', value: trades.filter(t => t.riskLevel === 'MEDIUM').length, color: 'hsl(var(--warning))' },
    { name: 'High Risk', value: trades.filter(t => t.riskLevel === 'HIGH').length, color: 'hsl(var(--destructive))' },
    { name: 'Critical', value: trades.filter(t => t.riskLevel === 'CRITICAL').length, color: 'hsl(var(--destructive))' }
  ].filter(item => item.value > 0);

  // P&L distribution by hour for bar chart
  const hourlyPnL = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const hourTrades = trades.filter(trade => trade.timestamp.getHours() === hour);
    const totalPnL = hourTrades.reduce((sum, trade) => sum + trade.mtmPnL, 0);
    const marginCalls = hourTrades.filter(trade => trade.isMarginCall).length;
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      pnl: totalPnL,
      marginCalls,
      tradeCount: hourTrades.length
    };
  }).filter(item => item.tradeCount > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          <p className={`${data.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
            P&L: ${data.pnl.toLocaleString()}
          </p>
          <p className="text-accent">Trades: {data.tradeCount}</p>
          {data.marginCalls > 0 && (
            <p className="text-warning">Margin Calls: {data.marginCalls}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.name}</p>
          <p className="text-accent">{data.value} trades</p>
          <p className="text-muted-foreground">
            {((data.value / trades.length) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Risk Distribution & Trading Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution Pie Chart */}
          <div>
            <h3 className="text-md font-medium text-foreground mb-3">Portfolio Risk Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly P&L Chart */}
          <div>
            <h3 className="text-md font-medium text-foreground mb-3">Hourly Trading P&L</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyPnL} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="pnl" name="P&L">
                    {hourlyPnL.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.pnl >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-success">
              {trades.filter(t => t.mtmPnL > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Profitable Trades</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-destructive">
              {trades.filter(t => t.isMarginCall).length}
            </div>
            <div className="text-sm text-muted-foreground">Margin Calls</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-warning">
              {trades.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL').length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-accent">
              ${(trades.reduce((sum, t) => sum + Math.abs(t.mtmPnL), 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-muted-foreground">Total Volume</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};