import { useState, useEffect } from "react";
import { TradingDashboard } from "@/components/TradingDashboard";
import { Header } from "@/components/Header";
import { generateTradeData, generateFXRate, runMonteCarloSimulation } from "@/lib/trading-utils";
import { Trade, FXRate, MonteCarloResult } from "@/types/trading";

const Index = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [fxRate, setFXRate] = useState<FXRate | null>(null);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      // Generate initial trade data
      const initialTrades = generateTradeData(150);
      setTrades(initialTrades);
      
      // Set initial FX rate
      const initialFXRate = generateFXRate();
      setFXRate(initialFXRate);
      
      // Run Monte Carlo simulation
      const mcResults = runMonteCarloSimulation(initialTrades, 1000);
      setMonteCarloResults(mcResults);
      
      setIsLoading(false);
    };

    initializeData();

    // Update FX rate every 30 seconds
    const fxInterval = setInterval(() => {
      setFXRate(generateFXRate());
    }, 30000);

    // Generate new trades every 5 minutes
    const tradeInterval = setInterval(() => {
      const newTrades = generateTradeData(Math.floor(Math.random() * 20) + 10);
      setTrades(prev => [...prev.slice(-100), ...newTrades].slice(-150));
    }, 300000);

    return () => {
      clearInterval(fxInterval);
      clearInterval(tradeInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-glow w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Treasury Dashboard</h2>
          <p className="text-muted-foreground">Initializing margin call automation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <TradingDashboard 
          trades={trades}
          fxRate={fxRate}
          monteCarloResults={monteCarloResults}
        />
      </main>
    </div>
  );
};

export default Index;