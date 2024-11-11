import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Chart } from './components/Chart';
import { AlertForm } from './components/AlertForm';
import { Analysis } from './components/Analysis';
import { LineChart, Settings } from 'lucide-react';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'EURUSD', 'GBPUSD', 'USDJPY'];

function App() {
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <LineChart className="w-8 h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ForexTracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {PAIRS.map((pair) => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <Chart pair={selectedPair} />
            </div>
            <Analysis pair={selectedPair} />
          </div>
          
          <div className="space-y-8">
            <AlertForm pair={selectedPair} currentPrice={0} />
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;