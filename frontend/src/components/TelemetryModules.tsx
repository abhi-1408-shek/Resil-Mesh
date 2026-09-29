'use client';

import { useTelemetryStore } from '@/store/telemetryStore';
import { Flame, Activity, Waves, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function TelemetryModules() {
  const { data, history } = useTelemetryStore();
  const { thermal, structural, acoustic } = data.sensors;

  return (
    <div className="flex flex-col space-y-4 h-full overflow-y-auto pr-2 pb-24">
      
      {/* Module A: Agnipath (Thermal) */}
      <div className={`p-4 rounded-xl border backdrop-blur-sm transition-colors duration-500 ${
        thermal.status === 'Critical' 
          ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
          : 'bg-slate-800/50 border-slate-700'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Flame className={thermal.status === 'Critical' ? 'text-red-400' : 'text-slate-400'} size={20} />
            <h3 className="font-semibold text-slate-200">Agnipath (Thermal)</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${
            thermal.status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {thermal.status}
          </span>
        </div>
        
        <div className="h-[120px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[20, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <ReferenceLine y={65} stroke="#ef4444" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke={thermal.status === 'Critical' ? '#ef4444' : '#3b82f6'} 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 flex justify-between items-end">
          <div>
            <div className="text-3xl font-light text-slate-100">{thermal.temperature.toFixed(1)}°C</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Threshold: 65°C</div>
          </div>
        </div>

        {thermal.route_recommendation && (
          <div className="mt-3 bg-red-900/50 border border-red-500/30 rounded p-2 flex items-start gap-2 animate-pulse">
            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={14} />
            <p className="text-xs text-red-200 font-mono leading-tight">{thermal.route_recommendation}</p>
          </div>
        )}
      </div>

      {/* Module B: KritiScan (Structural) */}
      <div className={`p-4 rounded-xl border backdrop-blur-sm transition-colors duration-500 ${
        structural.status === 'Warning' 
          ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
          : 'bg-slate-800/50 border-slate-700'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Activity className={structural.status === 'Warning' ? 'text-amber-400' : 'text-slate-400'} size={20} />
            <h3 className="font-semibold text-slate-200">KritiScan (Structural)</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${
            structural.status === 'Warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {structural.status}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 relative overflow-hidden">
            <div className="text-xs text-slate-400 mb-1">Crack Displacement</div>
            <div className="text-2xl font-light text-slate-100">{structural.crack_displacement_mm.toFixed(2)}<span className="text-sm text-slate-500 ml-1">mm</span></div>
            
            {/* Visual indicator bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${structural.status === 'Warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min((structural.crack_displacement_mm / 3.0) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {structural.alert_msg && (
          <div className="mt-3 bg-amber-900/50 border border-amber-500/30 rounded p-2 flex items-start gap-2">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={14} />
            <p className="text-xs text-amber-200 font-mono leading-tight">{structural.alert_msg}</p>
          </div>
        )}
      </div>

      {/* Module C: Jal-Rakshak (Stormwater) */}
      <div className={`p-4 rounded-xl border backdrop-blur-sm transition-colors duration-500 ${
        acoustic.status === 'Critical' 
          ? 'bg-red-950/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
          : 'bg-slate-800/50 border-slate-700'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Waves className={acoustic.status === 'Critical' ? 'text-red-400' : 'text-slate-400'} size={20} />
            <h3 className="font-semibold text-slate-200">Jal-Rakshak (Stormwater)</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-mono ${
            acoustic.status === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {acoustic.status}
          </span>
        </div>
        
        <div className="flex items-center p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 gap-3">
          {acoustic.status === 'Critical' ? (
            <div className="p-2 rounded-full bg-red-500/20 text-red-400">
               <AlertTriangle size={24} className="animate-pulse" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
              <ShieldCheck size={24} />
            </div>
          )}
          <div>
            <div className="text-xs text-slate-400">Acoustic Profile</div>
            <div className={`text-sm font-medium ${acoustic.status === 'Critical' ? 'text-red-300' : 'text-emerald-300'}`}>
              {acoustic.profile}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
