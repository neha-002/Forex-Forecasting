import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useForexStore } from '../store/forexStore';

interface AlertFormProps {
  pair: string;
  currentPrice: number;
}

export function AlertForm({ pair, currentPrice }: AlertFormProps) {
  const [price, setPrice] = useState(currentPrice.toString());
  const [type, setType] = useState<'above' | 'below'>('above');
  const addAlert = useForexStore((state) => state.addAlert);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAlert({
      pair,
      price: parseFloat(price),
      type,
    });
    setPrice(currentPrice.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Set Price Alert</h3>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alert when price is
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'above' | 'below')}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          step="0.00000001"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Create Alert
      </button>
    </form>
  );
}