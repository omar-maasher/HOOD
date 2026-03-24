'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Fix leaflet marker icon issue in Next.js dynamically
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null
    ? null
    : (
        <Marker position={position}></Marker>
      );
}

export default function MapPicker({ lat, lng, onChange }: { lat: string; lng: string; onChange: (lat: string, lng: string) => void }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcons();
  }, []);

  if (!isMounted) {
    return <div className="h-[300px] w-full animate-pulse rounded-2xl border bg-muted/30"></div>;
  }

  const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Default to Riyadh
  const position = lat && lng && !Number.isNaN(Number.parseFloat(lat)) && !Number.isNaN(Number.parseFloat(lng))
    ? { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) }
    : defaultCenter;

  return (
    <div className="relative z-0 h-[400px] w-full overflow-hidden rounded-2xl border shadow-inner">
      <MapContainer center={position} zoom={lat && lng ? 15 : 6} scrollWheelZoom className="z-0 size-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={lat && lng && !Number.isNaN(Number.parseFloat(lat)) ? position : null}
          setPosition={(pos: any) => onChange(pos.lat.toString(), pos.lng.toString())}
        />
      </MapContainer>
      <div className="pointer-events-none absolute left-4 top-4 z-[400] rounded-xl bg-background/90 p-3 shadow-lg backdrop-blur-md">
        <p className="text-sm font-bold text-foreground">انقر على الخريطة لتحديد موقع المخزن</p>
      </div>
    </div>
  );
}
