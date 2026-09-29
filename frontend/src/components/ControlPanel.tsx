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
    /* Mobile: full-width sticky bottom bar | Desktop: centered floating pill */
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:absolute lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto">
      <div className="bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/80 lg:border lg:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-2xl shadow-black/50">

        {/* Label row (mobile only shows it inline with first button row) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
            Demo Controls
          </span>

          <div className="hidden sm:block w-px h-5 bg-slate-700" />

          {/* Trigger Heat Spike */}
          <button
            onClick={() => trigger('thermal')}
            disabled={active === 'thermal'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150 active:scale-95 ${
              active === 'thermal'
                ? 'bg-red-600 border-red-500 text-white scale-95'
                : 'bg-slate-800 hover:bg-red-950/60 border-slate-700 hover:border-red-500/70 text-slate-200 hover:text-red-300'
            }`}
          >
            <Flame size={13} className="text-red-400 shrink-0" />
            <span className="hidden xs:inline">Trigger </span>Heat Spike
          </button>

          {/* Simulate Crack */}
          <button
            onClick={() => trigger('structural')}
            disabled={active === 'structural'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150 active:scale-95 ${
              active === 'structural'
                ? 'bg-amber-600 border-amber-500 text-white scale-95'
                : 'bg-slate-800 hover:bg-amber-950/60 border-slate-700 hover:border-amber-500/70 text-slate-200 hover:text-amber-300'
            }`}
          >
            <Activity size={13} className="text-amber-400 shrink-0" />
            <span className="hidden xs:inline">Simulate </span>Crack
          </button>

          {/* Trigger Drain Choke */}
          <button
            onClick={() => trigger('acoustic')}
            disabled={active === 'acoustic'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-150 active:scale-95 ${
              active === 'acoustic'
                ? 'bg-blue-600 border-blue-500 text-white scale-95'
                : 'bg-slate-800 hover:bg-blue-950/60 border-slate-700 hover:border-blue-500/70 text-slate-200 hover:text-blue-300'
            }`}
          >
            <Waves size={13} className="text-blue-400 shrink-0" />
            Drain Choke
          </button>

          <div className="w-px h-5 bg-slate-700 hidden sm:block" />

          {/* Reset */}
          <button
            onClick={reset}
            disabled={active === 'reset'}
            title="Reset all sensors to normal"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
          >
            <RotateCcw size={13} className={active === 'reset' ? 'animate-spin' : ''} />
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
