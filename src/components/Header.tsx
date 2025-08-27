import { Clock, Activity, AlertTriangle } from "lucide-react";

export const Header = () => {
  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Singapore',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Treasury Risk Console</h1>
                <p className="text-sm text-muted-foreground">Automated Margin Call Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-muted">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-foreground">SGT {currentTime}</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-warning/10 border border-warning/20">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">Live Market</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};