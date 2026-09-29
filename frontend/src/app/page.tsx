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
    <main className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans">
      {/* ── Top Navigation Bar ── */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm shrink-0">
        {/* Primary row: logo + title */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 sm:p-2 rounded-lg shadow-lg shadow-blue-900/50 shrink-0">
              <Activity className="text-white" size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent leading-tight truncate">
                Resil-Mesh Command Center
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono tracking-widest uppercase hidden sm:block">
                Jammu Smart City — Tri-Hazard Edge Intelligence Network
              </p>
            </div>
          </div>

          {/* Desktop status badges */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Mobile compact status badges */}
          <div className="flex md:hidden items-center gap-1.5">
            <div className="flex items-center gap-1 bg-emerald-950/50 border border-emerald-800/50 rounded-full px-2 py-1">
              <Radio size={10} className="text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-300">LoRa</span>
            </div>
            <div className="flex items-center gap-1 bg-blue-950/50 border border-blue-800/50 rounded-full px-2 py-1">
              <Wifi size={10} className="text-blue-400" />
              <span className="text-[10px] font-mono text-blue-300">Live</span>
            </div>
          </div>
        </div>

        {/* Mobile sub-row: edge processing info */}
        <div className="md:hidden flex items-center gap-2 px-4 pb-2">
          <Cpu size={11} className="text-blue-400 shrink-0" />
          <span className="text-[10px] font-mono text-slate-400">
            Edge: <span className="text-emerald-400">Local/Offline</span>
            <span className="mx-2 text-slate-600">·</span>
            Jammu Smart City Tri-Hazard Network
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      {/* Mobile: single column stack. Desktop: 8/4 side-by-side grid */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 overflow-y-auto lg:overflow-hidden pb-28 sm:pb-28 lg:pb-4" style={{ minHeight: 0 }}>

        {/* Section 1: Live City Map — full height on desktop, fixed height on mobile */}
        <div className="h-[55vw] min-h-[260px] max-h-[420px] sm:h-[50vw] sm:max-h-[480px] lg:col-span-8 lg:h-full lg:max-h-none">
          <MapComponent />
        </div>

        {/* Section 2: Telemetry Modules — auto height on mobile, scrollable on desktop */}
        <div className="lg:col-span-4 lg:h-full lg:overflow-hidden">
          <TelemetryModules />
        </div>

      </div>

      {/* ── Demo Control Panel ── */}
      <ControlPanel />
    </main>
  );
}
