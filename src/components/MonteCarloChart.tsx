import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MonteCarloResult } from "@/types/trading";

interface MonteCarloChartProps {
  results: MonteCarloResult[];
}

export const MonteCarloChart = ({ results }: MonteCarloChartProps) => {
  // Create histogram data for P&L distribution
  const createHistogramData = () => {
    const bucketSize = 10000; // $10k buckets
    const buckets: { [key: string]: { count: number; outliers: number } } = {};
    
    results.forEach(result => {
      const bucket = Math.floor(result.totalPnL / bucketSize) * bucketSize;
      const bucketKey = bucket.toString();
      
      if (!buckets[bucketKey]) {
        buckets[bucketKey] = { count: 0, outliers: 0 };
      }
      
      buckets[bucketKey].count++;
      if (result.isOutlier) {
        buckets[bucketKey].outliers++;
      }
    });

    return Object.entries(buckets)
      .map(([bucket, data]) => ({
        range: `$${(parseInt(bucket) / 1000).toFixed(0)}k`,
        count: data.count,
        outliers: data.outliers,
        bucketValue: parseInt(bucket)
      }))
      .sort((a, b) => a.bucketValue - b.bucketValue)
      .slice(-20); // Show last 20 buckets
  };

  const histogramData = createHistogramData();
  
  const outlierCount = results.filter(r => r.isOutlier).length;
  const outlierPercentage = ((outlierCount / results.length) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{`Range: ${label}`}</p>
          <p className="text-accent">{`Scenarios: ${payload[0].value}`}</p>
          {payload[0].payload.outliers > 0 && (
            <p className="text-destructive">{`Outliers: ${payload[0].payload.outliers}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-foreground">
          Monte Carlo Risk Analysis
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
            1,000 Simulations
          </Badge>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">
            {outlierPercentage}% Outliers
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="range" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Scenarios">
                {histogramData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.outliers > 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-2xl font-bold text-foreground">
              ${(results.reduce((sum, r) => sum + r.totalPnL, 0) / results.length / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-muted-foreground">Avg P&L</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-2xl font-bold text-destructive">
              ${(Math.max(...results.map(r => r.maxDrawdown)) / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-muted-foreground">Max Drawdown</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-2xl font-bold text-warning">
              {outlierCount}
            </div>
            <div className="text-sm text-muted-foreground">Extreme Scenarios</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};