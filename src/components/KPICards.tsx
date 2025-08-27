import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, Zap } from "lucide-react";
import { KPIMetrics } from "@/types/trading";

interface KPICardsProps {
  metrics: KPIMetrics;
}

export const KPICards = ({ metrics }: KPICardsProps) => {
  const kpiData = [
    {
      title: "Total Trades",
      value: metrics.totalTrades.toLocaleString(),
      icon: TrendingUp,
      change: "+12%",
      trend: "positive" as const
    },
    {
      title: "Margin Calls",
      value: metrics.marginCalls.toString(),
      icon: AlertCircle,
      change: `${((metrics.marginCalls / metrics.totalTrades) * 100).toFixed(1)}%`,
      trend: metrics.marginCalls > metrics.totalTrades * 0.1 ? "negative" as const : "neutral" as const
    },
    {
      title: "Auto-Processed",
      value: `${((metrics.autoProcessed / metrics.totalTrades) * 100).toFixed(0)}%`,
      icon: CheckCircle,
      change: "90%+ target",
      trend: "positive" as const
    },
    {
      title: "Time Saved",
      value: `${metrics.timeSaved}h`,
      icon: Clock,
      change: "per week",
      trend: "positive" as const
    },
    {
      title: "Avg Processing",
      value: `${metrics.averageProcessingTime}min`,
      icon: Zap,
      change: "-85%",
      trend: "positive" as const
    },
    {
      title: "Risk Exposure",
      value: `$${(metrics.riskExposure / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      change: "monitored",
      trend: "neutral" as const
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="bg-card border-border hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${
                kpi.trend === 'positive' ? 'text-success' : 
                kpi.trend === 'negative' ? 'text-destructive' : 'text-accent'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <p className={`text-xs ${
                kpi.trend === 'positive' ? 'text-success' : 
                kpi.trend === 'negative' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};