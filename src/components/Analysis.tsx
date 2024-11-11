import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface AnalysisProps {
  pair: string;
}

interface Analysis {
  rsi: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  volume24h: number;
  priceChange24h: number;
}

export function Analysis({ pair }: AnalysisProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Calculate basic analysis from real-time data
      const priceChange = parseFloat(data.p);
      const volume = parseFloat(data.v);
      const priceChangePercent = parseFloat(data.P);

      // Simple trend determination based on price change
      const trend = priceChangePercent > 0.5 ? 'bullish' : 
                   priceChangePercent < -0.5 ? 'bearish' : 'neutral';

      setAnalysis({
        rsi: calculateRSI(priceChange), // Simplified RSI calculation
        trend,
        volume24h: volume,
        priceChange24h: priceChange
      });
    };

    return () => ws.close();
  }, [pair]);

  if (!analysis) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-600" />
        Market Analysis
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Trend</p>
          <div className="flex items-center gap-1">
            {analysis.trend === 'bullish' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : analysis.trend === 'bearish' ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Activity className="w-4 h-4 text-yellow-500" />
            )}
            <span className="font-medium capitalize">{analysis.trend}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">RSI</p>
          <p className="font-medium">{analysis.rsi.toFixed(2)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">24h Volume</p>
          <p className="font-medium">{analysis.volume24h.toFixed(2)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">24h Change</p>
          <p className={`font-medium ${analysis.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analysis.priceChange24h.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

// Simplified RSI calculation
function calculateRSI(priceChange: number): number {
  // This is a very simplified version. In production, you'd want to:
  // 1. Keep track of price history
  // 2. Calculate proper gains/losses over a period (typically 14 periods)
  // 3. Use the actual RSI formula: 100 - (100 / (1 + RS))
  const absoluteChange = Math.abs(priceChange);
  return 50 + (priceChange / absoluteChange) * (absoluteChange * 10);
}