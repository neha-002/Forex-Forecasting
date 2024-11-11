import { create } from 'zustand';

interface Alert {
  id: string;
  pair: string;
  price: number;
  type: 'above' | 'below';
  triggered: boolean;
}

interface ForexStore {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'triggered'>) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
}

export const useForexStore = create<ForexStore>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts, { ...alert, id: crypto.randomUUID(), triggered: false }],
    })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
  triggerAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, triggered: true } : alert
      ),
    })),
}));