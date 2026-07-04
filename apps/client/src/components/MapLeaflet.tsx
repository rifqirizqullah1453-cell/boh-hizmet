import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, MapPin, Navigation } from 'lucide-react';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ── Types ────────────────────────────────────────────────────────────────────

interface MapLeafletProps {
  pickupLat: number;
  pickupLng: number;
  destLat?: number;
  destLng?: number;
  workerLat?: number;
  workerLng?: number;
  height?: string;
  showRoute?: boolean;
  interactive?: boolean;
  onMapClick?: (lat: number, lng: number, address?: string) => void;
  centerPinMode?: boolean;
  pinColor?: string;
  onCenterChange?: (lat: number, lng: number, address: string) => void;
  autoLocate?: boolean;
  onLocationFound?: (lat: number, lng: number) => void;
}

export interface MapLeafletHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

const BARTIN_CENTER: L.LatLngExpression = [41.6358, 32.3375];

// ── Geocoding helpers ─────────────────────────────────────────────────────────

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'id,en' } }
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

// ── Exported helpers ──────────────────────────────────────────────────────────

/**
 * Autocomplete via Nominatim (OSM official) — free, no API key.
 * Richer results: includes place type, full address, POIs, shops, etc.
 * Restricted to Bartin area via viewbox + countrycodes=tr.
 */
export interface SearchResult {
  lat: number;
  lng: number;
  name: string;
  subtitle: string;
  placeId: string;
  type?: string;
  category?: string;
  openingHours?: string;
  phone?: string;
  cuisine?: string;
  brand?: string;
}

function parseNominatimItem(item: any): SearchResult | null {
  const name = item.name || item.display_name?.split(',')[0]?.trim() || '';
  if (!name) return null;
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);
  if (isNaN(lat) || isNaN(lng)) return null;

  // Build readable subtitle from structured address
  const a = item.address ?? {};
  const parts = [
    a.road || a.pedestrian || a.footway,
    a.neighbourhood || a.suburb || a.quarter,
    a.town || a.city || a.village || a.county,
  ].filter(Boolean);
  const subtitle = parts.length ? parts.join(', ') : (item.display_name || '').split(',').slice(1, 3).join(',').trim();

  const ex = item.extratags ?? {};
  return {
    lat, lng, name, subtitle,
    placeId: String(item.place_id ?? Math.random()),
    type: item.type as string | undefined,
    category: item.class as string | undefined,
    openingHours: ex.opening_hours as string | undefined,
    phone: (ex.phone || ex['contact:phone']) as string | undefined,
    cuisine: ex.cuisine as string | undefined,
    brand: ex.brand as string | undefined,
  };
}

async function nominatimSearch(query: string, bounded: '0' | '1', signal: AbortSignal): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '10',
    addressdetails: '1',
    extratags: '1',
    namedetails: '1',
    countrycodes: 'tr',
    viewbox: '32.00,41.85,32.75,41.30',
    bounded,
    'accept-language': 'tr,id,en',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { signal, headers: { 'User-Agent': 'BOH-Hizmet-App/1.0' } }
  );
  const data: any[] = await res.json();
  return data.map(parseNominatimItem).filter((r): r is SearchResult => r !== null);
}

export async function searchAddress(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    // First: search strictly inside Bartın
    const bounded = await nominatimSearch(query, '1', controller.signal);
    if (bounded.length >= 2) return bounded;
    // Fallback: relax boundary (viewbox as boost only) if fewer than 2 results
    const relaxed = await nominatimSearch(query, '0', controller.signal);
    return relaxed.length > bounded.length ? relaxed : bounded;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function resolvePlaceId(
  _placeId: string
): Promise<{ lat: number; lng: number; name: string }> {
  return { lat: 0, lng: 0, name: '' };
}

export function getCurrentLocation(): Promise<{ lat: number; lng: number; accuracy?: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
}

// ── OSRM road routing ─────────────────────────────────────────────────────────

async function fetchOsrmRoute(
  pickup: [number, number],
  dest: [number, number]
): Promise<L.LatLngExpression[]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    if (data.routes?.[0]) {
      const coords = data.routes[0].geometry.coordinates as [number, number][];
      return coords.map(([lng, lat]) => [lat, lng] as L.LatLngExpression);
    }
  } catch { /* fallback to straight line */ }
  return [pickup, dest];
}

// ── Component ─────────────────────────────────────────────────────────────────

const MapLeaflet = forwardRef<MapLeafletHandle, MapLeafletProps>(function MapLeaflet(
  {
    pickupLat,
    pickupLng,
    destLat,
    destLng,
    workerLat,
    workerLng,
    height = '300px',
    showRoute = false,
    interactive = true,
    onMapClick,
    centerPinMode = false,
    pinColor = '#2BC5D4',
    onCenterChange,
    autoLocate = false,
    onLocationFound,
  },
  ref
) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef = useRef<L.Polyline | null>(null);
  const myDotRef = useRef<L.CircleMarker | null>(null);
  const myRingRef = useRef<L.Circle | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, zoom = 17) => {
      mapRef.current?.flyTo([lat, lng], zoom, { animate: true, duration: 0.7 });
    },
  }));

  const paintMyLocation = useCallback((lat: number, lng: number, accuracy?: number) => {
    const map = mapRef.current;
    if (!map) return;
    myDotRef.current?.remove();
    myRingRef.current?.remove();
    if (accuracy && accuracy < 2000) {
      myRingRef.current = L.circle([lat, lng], {
        radius: accuracy,
        color: '#4285F4',
        fillColor: '#4285F4',
        fillOpacity: 0.08,
        weight: 1,
        opacity: 0.3,
      }).addTo(map);
    }
    myDotRef.current = L.circleMarker([lat, lng], {
      radius: 9,
      fillColor: '#4285F4',
      color: 'white',
      fillOpacity: 1,
      weight: 3,
    }).addTo(map).bindPopup('Lokasi Anda', { closeButton: false });
  }, []);

  // Report center while user pans (center-pin mode)
  useEffect(() => {
    if (!centerPinMode || !mapRef.current || !isReady || !onCenterChange) return;
    const map = mapRef.current;
    let timeout: ReturnType<typeof setTimeout>;
    const onMove = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const c = map.getCenter();
        const addr = await reverseGeocode(c.lat, c.lng);
        onCenterChange(c.lat, c.lng, addr);
      }, 500);
    };
    map.on('moveend', onMove);
    const c = map.getCenter();
    reverseGeocode(c.lat, c.lng).then((addr) => onCenterChange(c.lat, c.lng, addr));
    return () => {
      map.off('moveend', onMove);
      clearTimeout(timeout);
    };
  }, [centerPinMode, isReady, onCenterChange]);

  const handleMapClick = useCallback(
    async (e: L.LeafletMouseEvent) => {
      if (!onMapClick || centerPinMode) return;
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng, 'Loading...');
      const address = await reverseGeocode(lat, lng);
      onMapClick(lat, lng, address);
    },
    [onMapClick, centerPinMode]
  );

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const center: L.LatLngExpression =
      pickupLat && pickupLng ? [pickupLat, pickupLng] : BARTIN_CENTER;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 16,
      scrollWheelZoom: interactive,
      dragging: interactive,
      zoomControl: false,
    });

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        maxNativeZoom: 19,
      }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;

    if (onMapClick && interactive && !centerPinMode) {
      map.on('click', handleMapClick);
    }

    setIsReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-locate GPS
  useEffect(() => {
    if (!autoLocate || !isReady || !mapRef.current) return;
    setIsLocating(true);
    getCurrentLocation()
      .then((pos) => {
        mapRef.current?.flyTo([pos.lat, pos.lng], 17, { animate: true, duration: 1.2 });
        paintMyLocation(pos.lat, pos.lng, pos.accuracy);
        onLocationFound?.(pos.lat, pos.lng);
      })
      .catch(() => {})
      .finally(() => setIsLocating(false));
  }, [autoLocate, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocate = async () => {
    if (!mapRef.current) return;
    setIsLocating(true);
    try {
      const pos = await getCurrentLocation();
      mapRef.current.flyTo([pos.lat, pos.lng], 18, { animate: true, duration: 1 });
      paintMyLocation(pos.lat, pos.lng, pos.accuracy);
      onLocationFound?.(pos.lat, pos.lng);
    } catch { /* GPS unavailable */ }
    setIsLocating(false);
  };

  // Update markers and route whenever coordinates change
  useEffect(() => {
    if (!mapRef.current || !isReady) return;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    if (pickupLat && pickupLng) {
      const ico = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:linear-gradient(135deg,#4DD4E0,#2BC5D4);width:44px;height:44px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(43,197,212,0.5)"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });
      const m = L.marker([pickupLat, pickupLng], { icon: ico })
        .addTo(map)
        .bindPopup('<b style="color:#2BC5D4">Pickup</b>', { closeButton: false });
      markersRef.current.push(m);
      bounds.extend([pickupLat, pickupLng]);
    }

    if (destLat && destLng) {
      const ico = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:linear-gradient(135deg,#FBBF24,#F59E0B);width:44px;height:44px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(245,158,11,0.5)"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg></div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });
      const m = L.marker([destLat, destLng], { icon: ico })
        .addTo(map)
        .bindPopup('<b style="color:#F59E0B">Tujuan</b>', { closeButton: false });
      markersRef.current.push(m);
      bounds.extend([destLat, destLng]);
    }

    if (workerLat && workerLng) {
      const ico = L.divIcon({
        className: 'worker-marker',
        html: `<div style="background:linear-gradient(135deg,#34D399,#10B981);width:40px;height:40px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(16,185,129,0.5)"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      const m = L.marker([workerLat, workerLng], { icon: ico, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<b style="color:#10B981">Pekerja (Live)</b>', { closeButton: false });
      markersRef.current.push(m);
      bounds.extend([workerLat, workerLng]);
    }

    if (routeRef.current) routeRef.current.remove();

    if (showRoute && pickupLat && pickupLng && destLat && destLng) {
      routeRef.current = L.polyline(
        [[pickupLat, pickupLng], [destLat, destLng]],
        { color: '#2BC5D4', weight: 4, opacity: 0.5, dashArray: '8 6', lineCap: 'round' }
      ).addTo(map);
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [80, 80] });

      fetchOsrmRoute([pickupLat, pickupLng], [destLat, destLng]).then((coords) => {
        routeRef.current?.remove();
        routeRef.current = L.polyline(coords, {
          color: '#2BC5D4',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [80, 80] });
      });
    } else if (pickupLat && pickupLng && !destLat) {
      map.setView([pickupLat, pickupLng], 16);
    } else if (bounds.isValid() && !showRoute) {
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [pickupLat, pickupLng, destLat, destLng, workerLat, workerLng, isReady, showRoute]);

  const PinIcon = pinColor === '#F59E0B' ? Navigation : MapPin;

  return (
    <div className="relative w-full h-full" style={{ height }}>
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'var(--bg)' }}>
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-[3px] rounded-full mx-auto mb-2"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--cyan)' }}
            />
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Loading map...</p>
          </div>
        </div>
      )}

      {/* GPS locate button */}
      {interactive && (
        <motion.button
          onClick={handleLocate}
          disabled={isLocating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-3 right-3 z-[400] p-2.5 rounded-xl shadow-lg bg-white border border-[var(--border-light)]"
          title="Lokasi Saya"
        >
          {isLocating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 rounded-full"
              style={{ borderColor: 'var(--border)', borderTopColor: '#4285F4' }}
            />
          ) : (
            <Crosshair className="w-5 h-5" style={{ color: '#4285F4' }} />
          )}
        </motion.button>
      )}

      {/* Center Pin overlay */}
      {centerPinMode && isReady && (
        <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center">
          <div className="relative" style={{ marginTop: '-40px' }}>
            <motion.div
              className="absolute rounded-full border-2"
              style={{ inset: '-20px', borderColor: pinColor, opacity: 0.35 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-[3px] border-white"
                style={{ background: pinColor }}
              >
                <PinIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: `14px solid ${pinColor}`,
                }}
              />
            </motion.div>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
    </div>
  );
});

export default MapLeaflet;
