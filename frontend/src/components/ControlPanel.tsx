'use client';

import { Flame, Activity, Waves, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function ControlPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  
  // Since the user had environment issues, we also add a fallback to directly update Zustand
  // in case the backend isn't running. We'll try fetch, but if it fails, we know it's offline.
  // Actually, for a clean prototype, we should just call the backend.
  
  const triggerHazard = async (type: string) => {
    setLoading(type);
    try {
      await fetch('http://localhost:8000/trigger-hazard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hazard_type: type }),
      });
    } catch (error) {
      console.error('Failed to connect to backend simulator. Is it running?', error);
      alert('Backend simulator is not running or unreachable. Please run the python script.');
    }
    setTimeout(() => setLoading(null), 500);
  };

  const resetSimulation = async () => {
    setLoading('reset');
    try {
      await fetch('http://localhost:8000/reset-simulation', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to reset', error);
    }
    setTimeout(() => setLoading(null), 500);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4">
      <div className="text-xs font-mono text-slate-400 mr-2 uppercase tracking-wider">Demo Controls</div>
      
      <button 
        onClick={() => triggerHazard('thermal')}
        disabled={loading === 'thermal'}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-900/50 border border-slate-700 hover:border-red-500/50 rounded-lg text-sm text-slate-200 transition-all active:scale-95"
      >
        <Flame size={16} className="text-red-400" />
        Trigger Heat Spike
      </button>

      <button 
        onClick={() => triggerHazard('structural')}
        disabled={loading === 'structural'}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-amber-900/50 border border-slate-700 hover:border-amber-500/50 rounded-lg text-sm text-slate-200 transition-all active:scale-95"
      >
        <Activity size={16} className="text-amber-400" />
        Simulate Crack Progression
      </button>

      <button 
        onClick={() => triggerHazard('acoustic')}
        disabled={loading === 'acoustic'}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-blue-900/50 border border-slate-700 hover:border-blue-500/50 rounded-lg text-sm text-slate-200 transition-all active:scale-95"
      >
        <Waves size={16} className="text-blue-400" />
        Trigger Drain Choke
      </button>
      
      <div className="w-px h-8 bg-slate-700 mx-2"></div>
      
      <button 
        onClick={resetSimulation}
        disabled={loading === 'reset'}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-all active:scale-95"
        title="Reset Simulation"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}
