import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, AlertTriangle, CheckCircle2, Download } from "lucide-react";
import { Trade } from "@/types/trading";
import { useState } from "react";

interface TradeDataTableProps {
  trades: Trade[];
}

export const TradeDataTable = ({ trades }: TradeDataTableProps) => {
  const [sortBy, setSortBy] = useState<'timestamp' | 'mtmPnL' | 'marginShortfall'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedTrades = [...trades].sort((a, b) => {
    let aValue: number | Date;
    let bValue: number | Date;

    switch (sortBy) {
      case 'timestamp':
        aValue = a.timestamp;
        bValue = b.timestamp;
        break;
      case 'mtmPnL':
        aValue = a.mtmPnL;
        bValue = b.mtmPnL;
        break;
      case 'marginShortfall':
        aValue = a.marginShortfall;
        bValue = b.marginShortfall;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getRiskBadge = (riskLevel: Trade['riskLevel'], isMarginCall: boolean) => {
    if (!isMarginCall) {
      return <Badge variant="outline" className="bg-success/10 text-success border-success">OK</Badge>;
    }
    
    switch (riskLevel) {
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>;
      case 'HIGH':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Medium</Badge>;
      default:
        return <Badge variant="outline" className="bg-accent/10 text-accent border-accent">Low</Badge>;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold text-foreground">Trade Portfolio & Margin Status</CardTitle>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 p-0 h-auto"
                    onClick={() => handleSort('timestamp')}
                  >
                    <span>Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">Symbol</TableHead>
                <TableHead className="text-muted-foreground">Side</TableHead>
                <TableHead className="text-muted-foreground">Quantity</TableHead>
                <TableHead className="text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 p-0 h-auto"
                    onClick={() => handleSort('mtmPnL')}
                  >
                    <span>MTM P&L</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">Collateral Req.</TableHead>
                <TableHead className="text-muted-foreground">Posted Margin</TableHead>
                <TableHead className="text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 p-0 h-auto"
                    onClick={() => handleSort('marginShortfall')}
                  >
                    <span>Shortfall</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrades.slice(0, 20).map((trade) => (
                <TableRow key={trade.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    {trade.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.side === 'BUY' ? 'outline' : 'secondary'} className={
                      trade.side === 'BUY' ? 'bg-success/10 text-success border-success' : 'bg-destructive/10 text-destructive border-destructive'
                    }>
                      {trade.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{trade.quantity.toLocaleString()}</TableCell>
                  <TableCell className={`font-mono ${trade.mtmPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ${trade.mtmPnL.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono">${trade.collateralRequired.toFixed(2)}</TableCell>
                  <TableCell className="font-mono">${trade.postedMargin.toFixed(2)}</TableCell>
                  <TableCell className={`font-mono ${trade.marginShortfall > 0 ? 'text-destructive' : 'text-success'}`}>
                    ${trade.marginShortfall.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRiskBadge(trade.riskLevel, trade.isMarginCall)}
                      {trade.isMarginCall && <AlertTriangle className="w-4 h-4 text-warning" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {trades.length > 20 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Showing 20 of {trades.length} trades. Use export for full dataset.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};