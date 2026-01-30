import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MiniMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export function MiniMap({ latitude, longitude, locationName }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Custom marker icon
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, hsl(221, 83%, 53%), hsl(271, 81%, 56%));
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Add marker
    L.marker([latitude, longitude], { icon })
      .addTo(map)
      .bindTooltip(locationName, { permanent: false, direction: 'top' });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, locationName]);

  return (
    <div 
      ref={mapRef} 
      className="h-32 w-full rounded-xl overflow-hidden border border-border"
      style={{ minHeight: '128px' }}
    />
  );
}
