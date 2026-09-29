import { create } from 'zustand';

export type AlertStatus = 'Normal' | 'Warning' | 'Critical';

export interface SensorState {
  thermal: {
    temperature: number;
    status: AlertStatus;
    route_recommendation: string | null;
  };
  structural: {
    crack_displacement_mm: number;
    status: AlertStatus;
    alert_msg: string | null;
  };
  acoustic: {
    profile: string;
    status: AlertStatus;
  };
}

export interface TelemetryData {
  timestamp: string;
  node_id: string;
  network_status: string;
  processing_mode: string;
  sensors: SensorState;
}

// Internal mutable simulation values (not Zustand — updated by the tick engine)
let _temp = 35.0;
let _crack = 0.5;
let _acoustic = 'Laminar Flow (Clear)';
let _tempSpiked = false;
let _crackSpiked = false;
let _acousticSpiked = false;

function buildData(): TelemetryData {
  const tempCritical = _temp > 65;
  const crackWarning = _crack > 2.0;
  const acousticCritical = _acoustic === 'Turbulent/Choked';

  return {
    timestamp: new Date().toISOString(),
    node_id: 'jammu-edge-mubarak-01',
    network_status: 'LoRa Mesh Active',
    processing_mode: 'Local/Offline',
    sensors: {
      thermal: {
        temperature: parseFloat(_temp.toFixed(2)),
        status: tempCritical ? 'Critical' : 'Normal',
        route_recommendation: tempCritical
          ? '🚨 Dispatching Two-Wheeler Mist Unit via Narrow Lane Alpha'
          : null,
      },
      structural: {
        crack_displacement_mm: parseFloat(_crack.toFixed(2)),
        status: crackWarning ? 'Warning' : 'Normal',
        alert_msg: crackWarning
          ? '⚠ Structural Audit Required at Mubarak Mandi Heritage Site'
          : null,
      },
      acoustic: {
        profile: _acoustic,
        status: acousticCritical ? 'Critical' : 'Normal',
      },
    },
  };
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface TelemetryState {
  data: TelemetryData;
  history: { time: string; temp: number }[];

  // Called every second by the simulation engine in page.tsx
  tick: () => void;

  // Demo control triggers — update state directly, no backend needed
  triggerHazard: (type: 'thermal' | 'structural' | 'acoustic') => void;
  resetSimulation: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  data: buildData(),
  history: Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString([], {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    }),
    temp: 35.0,
  })),

  tick: () => {
    // Simulate realistic sensor drift
    if (!_tempSpiked) {
      _temp = Math.max(30, Math.min(64, _temp + rand(-0.3, 0.3)));
    } else {
      // Slowly ramp down after spike (simulates response)
      _temp = Math.max(35, _temp - rand(0.1, 0.4));
      if (_temp <= 35.5) _tempSpiked = false;
    }

    if (!_crackSpiked) {
      _crack = Math.max(0.1, Math.min(1.9, _crack + rand(-0.02, 0.02)));
    }

    const newData = buildData();
    const timeStr = new Date().toLocaleTimeString([], {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

    set((state) => ({
      data: newData,
      history: [...state.history, { time: timeStr, temp: newData.sensors.thermal.temperature }].slice(-30),
    }));
  },

  triggerHazard: (type) => {
    if (type === 'thermal') {
      _temp = 72.5; // spike above 65°C threshold
      _tempSpiked = true;
    } else if (type === 'structural') {
      _crack = 2.4; // spike above 2.0mm threshold
      _crackSpiked = true;
    } else if (type === 'acoustic') {
      _acoustic = 'Turbulent/Choked';
      _acousticSpiked = true;
    }
    set({ data: buildData() });
  },

  resetSimulation: () => {
    _temp = 35.0;
    _crack = 0.5;
    _acoustic = 'Laminar Flow (Clear)';
    _tempSpiked = false;
    _crackSpiked = false;
    _acousticSpiked = false;
    set({ data: buildData() });
  },
}));
