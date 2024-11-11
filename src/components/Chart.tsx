import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { useForexStore } from '../store/forexStore';
import toast from 'react-hot-toast';

interface ChartProps {
  pair: string;
}

export function Chart({ pair }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { alerts } = useForexStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@kline_1m`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const candle = {
        time: data.k.t / 1000,
        open: parseFloat(data.k.o),
        high: parseFloat(data.k.h),
        low: parseFloat(data.k.l),
        close: parseFloat(data.k.c),
      };

      candlestickSeries.update(candle);

      // Check price alerts
      alerts.forEach((alert) => {
        if (!alert.triggered && alert.pair === pair) {
          const currentPrice = candle.close;
          if (
            (alert.type === 'above' && currentPrice >= alert.price) ||
            (alert.type === 'below' && currentPrice <= alert.price)
          ) {
            toast.success(
              `${pair} has reached your target price of ${alert.price}!`,
              {
                duration: 5000,
                position: 'bottom-right',
                style: {
                  background: '#10B981',
                  color: '#fff',
                },
              }
            );
          }
        }
      });
    };

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ws.close();
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, [pair, alerts]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}