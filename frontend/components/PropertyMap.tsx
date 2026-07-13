"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing default icon in Leaflet when using Webpack/Next.js
import L from "leaflet";
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// A component to automatically zoom to the new center when props change
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface PropertyMapProps {
  location: { lat: number; lng: number };
  title: string;
}

export default function PropertyMap({ location, title }: PropertyMapProps) {
  const position: [number, number] = [location.lat, location.lng];

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <ChangeView center={position} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-gray-500 mt-1">Exact location provided after booking.</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
