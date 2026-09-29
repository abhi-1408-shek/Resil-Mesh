'use client';

import { useTelemetryStore } from '@/store/telemetryStore';
import { Flame, Activity, Waves, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function ControlPanel() {
  const { triggerHazard, resetSimulation } = useTelemetryStore();
  const [active, setActive] = useState<string | null>(null);

  const trigger = (type: 'thermal' | 'structural' | 'acoustic') => {
    setActive(type);
    triggerHazard(type); // Directly updates Zustand — no backend call needed
    setTimeout(() => setActive(null), 400);
  };

  const reset = () => {
    setActive('reset');
    resetSimulation();
    setTimeout(() => setActive(null), 400);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 px-5 py-3 rounded-2xl shadow-2xl shadow-black/50 flex items-center gap-3">

        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1 shrink-0">
          Demo Controls
        </span>

        <div className="w-px h-6 bg-slate-700" />

        {/* Trigger Heat Spike */}
        <button
          onClick={() => trigger('thermal')}
          disabled={active === 'thermal'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 active:scale-95 ${
            active === 'thermal'
              ? 'bg-red-600 border-red-500 text-white scale-95'
              : 'bg-slate-800 hover:bg-red-950/60 border-slate-700 hover:border-red-500/70 text-slate-200 hover:text-red-300'
          }`}
        >
          <Flame size={15} className="text-red-400 shrink-0" />
          Trigger Heat Spike
        </button>

        {/* Simulate Crack */}
        <button
          onClick={() => trigger('structural')}
          disabled={active === 'structural'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 active:scale-95 ${
            active === 'structural'
              ? 'bg-amber-600 border-amber-500 text-white scale-95'
              : 'bg-slate-800 hover:bg-amber-950/60 border-slate-700 hover:border-amber-500/70 text-slate-200 hover:text-amber-300'
          }`}
        >
          <Activity size={15} className="text-amber-400 shrink-0" />
          Simulate Crack Progression
        </button>

        {/* Trigger Drain Choke */}
        <button
          onClick={() => trigger('acoustic')}
          disabled={active === 'acoustic'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 active:scale-95 ${
            active === 'acoustic'
              ? 'bg-blue-600 border-blue-500 text-white scale-95'
              : 'bg-slate-800 hover:bg-blue-950/60 border-slate-700 hover:border-blue-500/70 text-slate-200 hover:text-blue-300'
          }`}
        >
          <Waves size={15} className="text-blue-400 shrink-0" />
          Trigger Drain Choke
        </button>

        <div className="w-px h-6 bg-slate-700" />

        {/* Reset */}
        <button
          onClick={reset}
          disabled={active === 'reset'}
          title="Reset all sensors to normal"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
        >
          <RotateCcw size={14} className={active === 'reset' ? 'animate-spin' : ''} />
          Reset
        </button>

      </div>
    </div>
  );
}
