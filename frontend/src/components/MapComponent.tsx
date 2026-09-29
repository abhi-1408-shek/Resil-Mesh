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
      {/* CSS filter wrapper to convert OSM light tiles to dark theme — no API key needed */}
      <div style={{ filter: 'invert(1) hue-rotate(200deg) brightness(0.85) contrast(0.9)', height: '100%', width: '100%' }}>
        <MapContainer
          center={jammuCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Standard OpenStreetMap tiles — 100% free, no API key, no registration */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Node 1: Mubarak Mandi — Main active demo node */}
          {customIcon && (
            <Marker position={[32.7355, 74.8710]} icon={customIcon}>
              <Popup>
                <div className="font-bold text-sm">Node: Mubarak Mandi 01</div>
                <div className="text-xs text-slate-500 mt-1">Status: {hasAlert ? '🔴 Alert Active' : '🟢 Normal'}</div>
              </Popup>
            </Marker>
          )}

          {/* Pulsing red circle on alert */}
          <CircleMarker
            center={[32.7355, 74.8710]}
            radius={hasAlert ? 22 : 0}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.35,
              weight: 2,
            }}
          />

          {/* Node 2: Panjtirthi */}
          {customIcon && (
            <Marker position={[32.7380, 74.8680]} icon={customIcon}>
              <Popup>Panjtirthi Node 02 — Normal</Popup>
            </Marker>
          )}

          {/* Node 3: Old City Drain Monitor */}
          {customIcon && (
            <Marker position={[32.7330, 74.8730]} icon={customIcon}>
              <Popup>Old City Drain Node 03 — Normal</Popup>
            </Marker>
          )}

          {/* Node 4: Heritage Zone */}
          {customIcon && (
            <Marker position={[32.7365, 74.8695]} icon={customIcon}>
              <Popup>Heritage Zone Node 04 — Normal</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Overlay label — sits above the filter wrapper */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
        📍 Live City Map — Jammu Old City
      </div>

      {hasAlert && (
        <div className="absolute top-4 right-4 z-[1000] bg-red-900/80 backdrop-blur border border-red-500/50 px-3 py-2 rounded-lg text-xs font-mono text-red-300 animate-pulse">
          ⚠ ALERT ACTIVE
        </div>
      )}
    </div>
  );
}

