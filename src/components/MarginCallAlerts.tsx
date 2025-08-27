import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, Clock, DollarSign, Phone, Mail } from "lucide-react";
import { Trade } from "@/types/trading";

interface MarginCallAlertsProps {
  marginCallTrades: Trade[];
}

export const MarginCallAlerts = ({ marginCallTrades }: MarginCallAlertsProps) => {
  const criticalTrades = marginCallTrades.filter(t => t.riskLevel === 'CRITICAL');
  const highRiskTrades = marginCallTrades.filter(t => t.riskLevel === 'HIGH');
  const totalShortfall = marginCallTrades.reduce((sum, trade) => sum + trade.marginShortfall, 0);

  return (
    <Card className="bg-destructive/5 border-destructive/20 animate-pulse-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <CardTitle className="text-lg font-semibold text-destructive">
            Active Margin Call Alerts
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="animate-pulse">
            {marginCallTrades.length} Active
          </Badge>
          <Button size="sm" variant="destructive" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Escalate All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Total Shortfall</span>
            </div>
            <div className="text-2xl font-bold text-destructive">
              ${totalShortfall.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Critical Trades</span>
            </div>
            <div className="text-2xl font-bold text-destructive">
              {criticalTrades.length}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">High Risk</span>
            </div>
            <div className="text-2xl font-bold text-warning">
              {highRiskTrades.length}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Auto-Processed</span>
            </div>
            <div className="text-2xl font-bold text-accent">
              {Math.floor(marginCallTrades.length * 0.75)}
            </div>
          </div>
        </div>

        {/* Critical Trades Requiring Immediate Action */}
        {criticalTrades.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-destructive mb-3 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Critical - Immediate Action Required</span>
            </h3>
            <div className="space-y-3">
              {criticalTrades.slice(0, 5).map((trade) => (
                <div key={trade.id} className="bg-card rounded-lg p-4 border border-destructive/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge variant="destructive">CRITICAL</Badge>
                      <div>
                        <div className="font-medium text-foreground">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {trade.quantity.toLocaleString()} shares • {trade.side}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-destructive">
                        ${trade.marginShortfall.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">shortfall</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Triggered: {trade.timestamp.toLocaleString()} • 
                    Shortfall: {((trade.marginShortfall / trade.collateralRequired) * 100).toFixed(1)}% of required collateral
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automation Summary */}
        <div className="bg-card rounded-lg p-4 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-3">Automation Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-success">
                {Math.floor(marginCallTrades.length * 0.75)}
              </div>
              <div className="text-sm text-muted-foreground">Auto-processed margin calls</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {Math.floor(marginCallTrades.length * 0.75 * 0.75)}h
              </div>
              <div className="text-sm text-muted-foreground">Time saved this session</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                2.3min
              </div>
              <div className="text-sm text-muted-foreground">Avg processing time</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};