import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { STORES, type Store, type StoreType } from '@/data/shopData';
import { STORE_COORDS, formatDist, haversine } from '@/data/storeCoords';

type WorkerLoc = { lat: number; lng: number } | null;

interface Props {
  workerLoc: WorkerLoc;
  nearestStoreId: string | null;
  onSelectStore: (store: Store) => void;
}

const TYPE_COLORS: Record<StoreType, string> = {
  supermarket: '#16A34A',
  restaurant:  '#DC2626',
  fast_food:   '#EA580C',
  cafe:        '#92400E',
  butcher:     '#9F1239',
  bakery:      '#B45309',
  pharmacy:    '#0F766E',
};

// Bartın şehir merkezi [lng, lat]
const BARTIN: [number, number] = [32.3376, 41.6369];

const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export default function StoreMap({ workerLoc, nearestStoreId, onSelectStore }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<maplibregl.Map | null>(null);
  const markersRef   = useRef<maplibregl.Marker[]>([]);
  const popupRef     = useRef<maplibregl.Popup | null>(null);
  // keep callback in a ref so the closure inside useEffect never goes stale
  const onSelectRef  = useRef(onSelectStore);
  onSelectRef.current = onSelectStore;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // ── Initial map center ──────────────────────────────────────────────────
    const nearestCoord = nearestStoreId ? STORE_COORDS[nearestStoreId] : null;
    let mapCenter: [number, number] = workerLoc ? [workerLoc.lng, workerLoc.lat] : BARTIN;
    if (workerLoc && nearestCoord) {
      // Midpoint between worker and nearest store so both are visible
      mapCenter = [
        (workerLoc.lng + nearestCoord.lng) / 2,
        (workerLoc.lat + nearestCoord.lat) / 2,
      ];
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: mapCenter,
      zoom: 14.2,
      attributionControl: false,
    });
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    // ── Worker location dot ─────────────────────────────────────────────────
    if (workerLoc) {
      const el = document.createElement('div');
      el.style.cssText = 'position:relative;width:22px;height:22px;pointer-events:none;';
      el.innerHTML = `
        <div style="
          position:absolute;inset:0;border-radius:50%;
          background:#3B82F6;border:3px solid white;
          box-shadow:0 0 0 5px rgba(59,130,246,0.22);
          z-index:2;
        "></div>
        <div class="boh-pulse-ring"></div>
      `;
      new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([workerLoc.lng, workerLoc.lat])
        .addTo(map);
    }

    // ── openPopup helper (defined before map.on('load') so markers can call it) ──
    function openPopup(store: Store, coord: NonNullable<typeof STORE_COORDS[string]>) {
      popupRef.current?.remove();

      const dist = workerLoc
        ? haversine(workerLoc.lat, workerLoc.lng, coord.lat, coord.lng)
        : null;
      const distColor =
        dist === null ? '#888'
        : dist < 3   ? '#16A34A'
        : dist < 10  ? '#F59E0B'
        :               '#EF4444';

      const content = document.createElement('div');
      content.style.cssText = 'min-width:170px;font-family:system-ui,sans-serif;';
      content.innerHTML = `
        <div style="font-size:14px;font-weight:900;color:#111;margin-bottom:2px;line-height:1.25;">${store.name}</div>
        <div style="font-size:10.5px;color:#888;margin-bottom:8px;">${store.tagline}</div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">
          <span style="font-size:10.5px;font-weight:700;color:#FBBF24;">⭐ ${store.rating}</span>
          <span style="color:#ccc;">·</span>
          <span style="font-size:10.5px;color:#999;">⏱ ${store.etaMin} mnt</span>
          ${dist !== null ? `
            <span style="color:#ccc;">·</span>
            <span style="font-size:10.5px;font-weight:800;color:${distColor};">📍 ${formatDist(dist)}</span>
          ` : ''}
        </div>
        <div style="font-size:9.5px;color:#bbb;margin-bottom:10px;line-height:1.3;">${coord.pickupAddress}</div>
        <button id="boh-open-store" style="
          width:100%;padding:8px 0;border-radius:12px;
          background:linear-gradient(135deg,#4DD4E0,#2BC5D4);
          color:white;font-size:12px;font-weight:900;
          border:none;cursor:pointer;
          box-shadow:0 3px 10px rgba(43,197,212,0.35);
        ">Masuk Toko →</button>
      `;

      (content.querySelector('#boh-open-store') as HTMLButtonElement)
        .addEventListener('click', () => {
          popupRef.current?.remove();
          onSelectRef.current(store);
        });

      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        offset: [0, -26],
        maxWidth: '220px',
        className: 'boh-popup',
      })
        .setLngLat([coord.lng, coord.lat])
        .setDOMContent(content)
        .addTo(map);

      popupRef.current = popup;

      map.easeTo({
        center: [coord.lng, coord.lat],
        duration: 420,
        zoom: Math.max(map.getZoom(), 15),
        offset: [0, -60],
      });
    }

    // ── Store markers ───────────────────────────────────────────────────────
    map.on('load', () => {
      STORES.forEach(store => {
        const coord = STORE_COORDS[store.id];
        if (!coord) return;

        const isNearest = store.id === nearestStoreId;
        const color = store.bannerColor ?? TYPE_COLORS[store.type] ?? '#2BC5D4';
        const size  = isNearest ? 50 : 38;
        const fs    = isNearest ? 24 : 18;

        const el = document.createElement('div');
        el.style.cssText = `
          position:relative;
          width:${size}px;height:${size}px;
          cursor:pointer;
          transition:transform 0.15s ease;
        `;
        el.innerHTML = `
          ${isNearest ? '<div class="boh-nearest-ring"></div>' : ''}
          <div style="
            position:absolute;inset:0;
            border-radius:50%;
            background:${color};
            border:3px solid white;
            display:flex;align-items:center;justify-content:center;
            font-size:${fs}px;
            box-shadow:0 3px 14px rgba(0,0,0,0.28);
            z-index:2;
          ">${store.emoji}</div>
          ${isNearest ? `
            <div style="
              position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);
              background:linear-gradient(135deg,#4DD4E0,#2BC5D4);
              color:white;font-size:9px;font-weight:900;
              padding:2px 8px;border-radius:10px;
              white-space:nowrap;
              box-shadow:0 2px 8px rgba(43,197,212,0.45);
              z-index:3;font-family:system-ui,sans-serif;
            ">📍 Terdekat</div>
          ` : ''}
        `;

        el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.14)'; });
        el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
        el.addEventListener('click', (e) => { e.stopPropagation(); openPopup(store, coord); });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([coord.lng, coord.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Auto-open nearest store popup
      if (nearestStoreId) {
        const ns = STORES.find(s => s.id === nearestStoreId);
        const nc = STORE_COORDS[nearestStoreId];
        if (ns && nc) setTimeout(() => openPopup(ns, nc), 700);
      }
    });

    return () => {
      popupRef.current?.remove();
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // intentionally empty — map is imperative and long-lived

  return (
    <div ref={containerRef} className="w-full h-full">
      <style>{`
        @keyframes boh-pulse-anim {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.2); }
        }
        .boh-pulse-ring {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 2px solid rgba(59,130,246,0.5);
          animation: boh-pulse-anim 2s ease-out infinite;
        }

        @keyframes boh-nearest-anim {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(43,197,212,0.55); }
          50%       { opacity: 0.55; box-shadow: 0 0 22px rgba(43,197,212,0.8); }
        }
        .boh-nearest-ring {
          position: absolute;
          inset: -7px;
          border-radius: 50%;
          border: 3px solid #2BC5D4;
          z-index: 1;
          animation: boh-nearest-anim 2s ease-in-out infinite;
        }

        .boh-popup .maplibregl-popup-content {
          border-radius: 16px !important;
          padding: 14px !important;
          box-shadow: 0 6px 28px rgba(0,0,0,0.13) !important;
          border: 1px solid rgba(0,0,0,0.07) !important;
        }
        .boh-popup .maplibregl-popup-close-button {
          font-size: 18px;
          color: #ccc;
          top: 8px;
          right: 8px;
          line-height: 1;
        }
        .boh-popup .maplibregl-popup-close-button:hover { color: #999; }
        .boh-popup .maplibregl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
    </div>
  );
}
