import { create } from 'zustand';

export interface TelemetryData {
  timestamp: string;
  node_id: string;
  network_status: string;
  processing_mode: string;
  sensors: {
    thermal: {
      temperature: number;
      status: 'Normal' | 'Critical';
      route_recommendation: string | null;
    };
    structural: {
      crack_displacement_mm: number;
      status: 'Normal' | 'Warning';
      alert_msg: string | null;
    };
    acoustic: {
      profile: string;
      status: 'Normal' | 'Critical';
    };
  };
}

// Initial state reflecting offline/disconnected mode before WebSocket connection
const initialData: TelemetryData = {
  timestamp: new Date().toISOString(),
  node_id: 'jammu-edge-mubarak-01',
  network_status: 'Connecting...',
  processing_mode: 'Local/Offline',
  sensors: {
    thermal: { temperature: 35.0, status: 'Normal', route_recommendation: null },
    structural: { crack_displacement_mm: 0.5, status: 'Normal', alert_msg: null },
    acoustic: { profile: 'Laminar Flow (Clear)', status: 'Normal' }
  }
};

interface TelemetryState {
  data: TelemetryData;
  isConnected: boolean;
  history: { time: string; temp: number }[]; // For the thermal chart
  updateData: (newData: TelemetryData) => void;
  setConnected: (status: boolean) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  data: initialData,
  isConnected: false,
  history: Array(20).fill(0).map((_, i) => ({ 
    time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }), 
    temp: 35.0 
  })), // Pre-fill with normal baseline
  
  updateData: (newData) => set((state) => {
    // Keep last 20 data points for the chart history
    const timeStr = new Date(newData.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    const newHistory = [...state.history, { time: timeStr, temp: newData.sensors.thermal.temperature }].slice(-20);
    
    return { data: newData, history: newHistory };
  }),
  
  setConnected: (status) => set({ isConnected: status })
}));
