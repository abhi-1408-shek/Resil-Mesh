'use client';

import dynamic from 'next/dynamic';
import TelemetryModules from '@/components/TelemetryModules';
import ControlPanel from '@/components/ControlPanel';
import { useTelemetryStore } from '@/store/telemetryStore';
import { useEffect } from 'react';
import { Activity, Wifi, WifiOff, Cpu } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse flex items-center justify-center border border-slate-800"><div className="text-slate-500 font-mono">Loading Map...</div></div>
});

export default function Home() {
  const { data, isConnected, setConnected, updateData } = useTelemetryStore();

  useEffect(() => {
    // Connect to Edge Simulator WebSocket
    let ws: WebSocket;
    let reconnectInterval: NodeJS.Timeout;

    const connect = () => {
      try {
        ws = new WebSocket('ws://localhost:8000/ws/telemetry');
        
        ws.onopen = () => {
          setConnected(true);
        };
        
        ws.onmessage = (event) => {
          try {
            const incomingData = JSON.parse(event.data);
            updateData(incomingData);
          } catch (e) {
            console.error('Failed to parse telemetry data', e);
          }
        };
        
        ws.onclose = () => {
          setConnected(false);
          // Try to reconnect every 3 seconds
          reconnectInterval = setTimeout(connect, 3000);
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket Error', error);
          ws.close();
        };
      } catch (error) {
        console.error('WebSocket setup error', error);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
      if (reconnectInterval) clearTimeout(reconnectInterval);
    };
  }, [setConnected, updateData]);

  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Resil-Mesh Command Center
          </h1>
          <span className="text-xs text-slate-500 font-mono ml-2 border-l border-slate-700 pl-4">Jammu Smart City</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
            <Cpu size={14} className="text-slate-400" />
            <span className="text-xs font-mono text-slate-300">Edge Processing: <span className="text-emerald-400">Local/Offline</span></span>
          </div>
          <div className={`flex items-center gap-2 border rounded-full px-3 py-1 ${isConnected ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
            {isConnected ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-red-500" />}
            <span className={`text-xs font-mono ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
              Network: {isConnected ? data.network_status : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6 h-[calc(100vh-4rem)]">
        
        {/* Section 1: Live City Map (Left/Center Column - spans 8 cols) */}
        <div className="col-span-8 h-full relative">
          <MapComponent />
        </div>

        {/* Section 2: Tri-Hazard Telemetry Modules (Right Column - spans 4 cols) */}
        <div className="col-span-4 h-full">
          <TelemetryModules />
        </div>

      </div>

      {/* Simulation Control Panel */}
      <ControlPanel />
      
    </main>
  );
}
