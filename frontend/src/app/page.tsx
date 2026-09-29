'use client';

import dynamic from 'next/dynamic';
import TelemetryModules from '@/components/TelemetryModules';
import ControlPanel from '@/components/ControlPanel';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useEffect } from 'react';
import { Activity, Wifi, Cpu, Radio } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse flex items-center justify-center border border-slate-800">
      <div className="text-slate-500 font-mono text-sm">Loading Map...</div>
    </div>
  ),
});

export default function Home() {
  const { tick } = useTelemetryStore();

  useEffect(() => {
    // Client-side simulation engine — runs entirely in the browser.
    // In production, this replaces the WebSocket connection to the edge node.
    // All AI inference is simulated locally (edge device telemetry is mocked).
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-sans">
      {/* ── Top Navigation Bar ── */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg shadow-lg shadow-blue-900/50">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent leading-tight">
              Resil-Mesh Command Center
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              Jammu Smart City — Tri-Hazard Edge Intelligence Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1.5">
            <Cpu size={13} className="text-blue-400" />
            <span className="text-xs font-mono text-slate-300">
              Edge Processing: <span className="text-emerald-400 font-semibold">Local / Offline</span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/50 rounded-full px-3 py-1.5">
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-300">
              LoRa Mesh: <span className="font-semibold">Active</span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-800/50 rounded-full px-3 py-1.5">
            <Wifi size={13} className="text-blue-400" />
            <span className="text-xs font-mono text-blue-300">Live Telemetry</span>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* Section 1: Live City Map */}
        <div className="col-span-8 h-full">
          <MapComponent />
        </div>

        {/* Section 2: Telemetry Modules */}
        <div className="col-span-4 h-full overflow-hidden">
          <TelemetryModules />
        </div>

      </div>

      {/* ── Demo Control Panel ── */}
      <ControlPanel />
    </main>
  );
}
