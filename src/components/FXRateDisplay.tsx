import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { FXRate } from "@/types/trading";

interface FXRateDisplayProps {
  fxRate: FXRate | null;
}

export const FXRateDisplay = ({ fxRate }: FXRateDisplayProps) => {
  if (!fxRate) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">FX Rate Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
            <p className="text-muted-foreground">Loading FX data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = fxRate.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className={`bg-card border-border ${fxRate.isVarianceTrigger ? 'animate-pulse-glow border-warning' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-foreground">FX Rate Monitor</CardTitle>
        {fxRate.isVarianceTrigger && (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
            Variance Alert
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">{fxRate.pair}</div>
          <div className="text-3xl font-bold text-foreground font-mono">
            {fxRate.rate.toFixed(4)}
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-success' : 'text-destructive'}`} />
          <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? '+' : ''}{fxRate.change.toFixed(4)} ({fxRate.changePercent.toFixed(2)}%)
          </span>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            Last updated: {fxRate.timestamp.toLocaleTimeString()}
          </div>
          {fxRate.isVarianceTrigger && (
            <div className="text-xs text-warning mt-1 font-medium">
              &gt;1% variance detected - margin calls may be triggered
            </div>
          )}
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Auto-Update Status</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm text-foreground">Live Feed Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};