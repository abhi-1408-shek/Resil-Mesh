'use client';

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTelemetryStore } from '@/store/telemetryStore';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix Leaflet's default icon path issues in Next.js
const customIcon = typeof window !== 'undefined' ? new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
}) : null;

export default function MapComponent() {
  const { data } = useTelemetryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-slate-900 rounded-xl animate-pulse"></div>;

  // Jammu Coordinates (focusing around Mubarak Mandi)
  const jammuCenter: [number, number] = [32.735, 74.87];

  // Active Alert status checking
  const hasAlert = data.sensors.thermal.status === 'Critical' || 
                   data.sensors.structural.status === 'Warning' || 
                   data.sensors.acoustic.status === 'Critical';

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-700 relative z-0">
      <MapContainer 
        center={jammuCenter} 
        zoom={15} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        />
        
        {/* Node 1: Mubarak Mandi (Active Demo Node) */}
        {customIcon && (
          <Marker position={[32.7355, 74.8710]} icon={customIcon}>
            <Popup className="bg-slate-800 text-slate-100 border-none rounded shadow-xl">
              <div className="font-bold text-sm">Node: Mubarak Mandi 01</div>
              <div className="text-xs text-slate-400 mt-1">Status: {hasAlert ? 'Alert Active' : 'Normal'}</div>
            </Popup>
          </Marker>
        )}

        {/* Pulsing indicator for active alerts */}
        <CircleMarker 
          center={[32.7355, 74.8710]} 
          radius={hasAlert ? 25 : 0} 
          pathOptions={{
            color: '#ef4444', 
            fillColor: '#ef4444',
            fillOpacity: 0.4,
            weight: 2,
            className: hasAlert ? 'animate-ping' : ''
          }} 
        />

        {/* Other Passive Nodes */}
        {customIcon && (
          <Marker position={[32.7380, 74.8680]} icon={customIcon}>
             <Popup>Panjtirthi Node 02 (Normal)</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Overlay status label */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/80 backdrop-blur border border-slate-700 p-2 rounded-lg text-xs font-mono text-slate-300">
        Live City Map: Jammu
      </div>
    </div>
  );
}
