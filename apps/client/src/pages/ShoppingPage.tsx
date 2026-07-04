import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, Clock, ShoppingCart,
  Plus, Minus, Trash2, Search, X, MapPin, Phone,
  Navigation, ExternalLink, Loader2, Map as MapIcon, Zap,
} from 'lucide-react';
import { STORES, STORE_CATEGORIES, type Store, type Product, type StoreType } from '@/data/shopData';
import { STORE_COORDS, BRANCH_GROUPS, haversine, formatDist } from '@/data/storeCoords';
import { getCurrentLocation } from '@/components/MapLeaflet';
import StoreMap from '@/components/StoreMap';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface Props {
  onBack: () => void;
  /** subtotal = product prices only; storePickupAddress = nearest store address for worker routing */
  onCheckout: (cart: CartItem[], subtotal: number, storePickupAddress: string, pickupLat: number, pickupLng: number) => void;
}

type View = 'list' | 'store' | 'cart' | 'map';

type WorkerLoc = { lat: number; lng: number } | null;

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_META: Record<StoreType, { color: string; label: string; light: string }> = {
  supermarket: { color: '#16A34A', label: 'Süpermarket',    light: '#DCFCE7' },
  restaurant:  { color: '#DC2626', label: 'Restoran',       light: '#FEE2E2' },
  fast_food:   { color: '#EA580C', label: 'Fast Food',      light: '#FFEDD5' },
  cafe:        { color: '#92400E', label: 'Kafe & Pastane', light: '#FEF3C7' },
  butcher:     { color: '#9F1239', label: 'Kasap',          light: '#FFE4E6' },
  bakery:      { color: '#B45309', label: 'Fırın',          light: '#FEF9C3' },
  pharmacy:    { color: '#0F766E', label: 'Eczane',         light: '#CCFBF1' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const sumTotal = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0);
const sumCount = (items: CartItem[]) => items.reduce((s, i) => s + i.quantity, 0);

function getStoreDist(store: Store, loc: WorkerLoc): number | null {
  if (!loc) return null;
  const c = STORE_COORDS[store.id];
  if (!c) return null;
  return haversine(loc.lat, loc.lng, c.lat, c.lng);
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation presets
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_FWD = {
  initial:  { x: '100%', opacity: 0 },
  animate:  { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const } },
  exit:     { x: '-30%', opacity: 0, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const } },
};
const PAGE_BACK = {
  initial:  { x: '-30%', opacity: 0 },
  animate:  { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const } },
  exit:     { x: '100%', opacity: 0, transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] as const } },
};
const GRID_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const GRID_ITEM = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

// ─────────────────────────────────────────────────────────────────────────────
// StoreLogo
// ─────────────────────────────────────────────────────────────────────────────

function StoreLogo({ store, size = 56 }: { store: Store; size?: number }) {
  const [err, setErr] = useState(false);
  const bg     = store.bannerColor ?? TYPE_META[store.type].color;
  const radius = Math.round(size * 0.26);
  const pad    = Math.round(size * 0.11);

  if (store.logo && !err) {
    return (
      <div className="flex items-center justify-center bg-white overflow-hidden"
        style={{ width: size, height: size, borderRadius: radius, padding: pad,
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)', flexShrink: 0 }}>
        <img src={store.logo} alt={store.name} onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center"
      style={{ width: size, height: size, borderRadius: radius, background: bg,
        boxShadow: '0 2px 10px rgba(0,0,0,0.20)', fontSize: size * 0.44, flexShrink: 0 }}>
      {store.emoji}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DistanceBadge
// ─────────────────────────────────────────────────────────────────────────────

function DistanceBadge({ dist, locLoading }: { dist: number | null; locLoading: boolean }) {
  if (locLoading) {
    return (
      <span className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <Loader2 className="w-2.5 h-2.5 animate-spin" />
      </span>
    );
  }
  if (dist === null) return null;
  const color = dist > 10 ? '#EF4444' : dist > 3 ? '#F59E0B' : '#16A34A';
  const bg    = dist > 10 ? '#FEF2F2' : dist > 3 ? '#FFFBEB' : '#F0FDF4';
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-lg"
      style={{ color, background: bg }}>
      <Navigation className="w-2.5 h-2.5" />
      {formatDist(dist)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StoreCard
// ─────────────────────────────────────────────────────────────────────────────

function StoreCard({ store, cartQty, dist, locLoading, onClick, isNearest }: {
  store: Store; cartQty: number; dist: number | null; locLoading: boolean; onClick: () => void; isNearest?: boolean;
}) {
  const bg   = store.bannerColor ?? TYPE_META[store.type].color;
  const meta = TYPE_META[store.type];

  return (
    <motion.button variants={GRID_ITEM} whileTap={{ scale: 0.95 }} onClick={onClick}
      className="w-full text-left bg-white rounded-3xl overflow-hidden"
      style={{ boxShadow: '0 2px 18px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.04)' }}>

      {/* Banner */}
      <div className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 118, background: bg }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', paddingTop:'60%',
            borderRadius:'50%', background:'rgba(255,255,255,0.10)' }} />
          <div style={{ position:'absolute', bottom:'-30%', left:'-12%', width:'45%', paddingTop:'45%',
            borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
          <div style={{ position:'absolute', top:'8%', left:'8%', width:'28%', paddingTop:'28%',
            borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        </div>

        <StoreLogo store={store} size={62} />

        {isNearest && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
            style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)', boxShadow: '0 2px 8px rgba(22,163,74,0.5)' }}>
            <Navigation className="w-2.5 h-2.5" />
            EN YAKIN
          </motion.div>
        )}

        {cartQty > 0 && (
          <motion.div key={cartQty} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
            className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black text-white"
            style={{ background: '#2BC5D4', boxShadow: '0 2px 6px rgba(43,197,212,0.45)' }}>
            <ShoppingCart className="w-2.5 h-2.5" />{cartQty}
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-3 space-y-1.5">
        {/* name + type badge */}
        <div className="flex items-start gap-2">
          <p className="flex-1 min-w-0 text-[13.5px] font-extrabold leading-snug truncate"
            style={{ color: 'var(--text)' }}>{store.name}</p>
          <span className="shrink-0 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: meta.light, color: meta.color }}>{meta.label}</span>
        </div>

        {/* tagline */}
        <p className="text-[10.5px] leading-tight line-clamp-1" style={{ color: 'var(--text-muted)' }}>
          {store.tagline}
        </p>

        {/* meta pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg" style={{ background: '#FEF3C7' }}>
            <Star className="w-2.5 h-2.5 fill-current" style={{ color: '#D97706' }} />
            <span className="text-[10px] font-bold" style={{ color: '#D97706' }}>{store.rating}</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg" style={{ background: 'var(--bg)' }}>
            <Clock className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{store.etaMin} mnt</span>
          </div>
          {store.minOrder > 0 && (
            <span className="text-[9.5px] px-1.5 py-0.5 rounded-lg"
              style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
              Min ₺{store.minOrder}
            </span>
          )}
        </div>

        {/* distance */}
        <DistanceBadge dist={dist} locLoading={locLoading} />
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeaturedCard
// ─────────────────────────────────────────────────────────────────────────────

function FeaturedCard({ store, cartQty, dist, index, onClick, isNearest }: {
  store: Store; cartQty: number; dist: number | null; index: number; onClick: () => void; isNearest?: boolean;
}) {
  const bg = store.bannerColor ?? TYPE_META[store.type].color;
  return (
    <motion.button
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.06, duration: 0.26 } }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="shrink-0 bg-white rounded-2xl overflow-hidden text-left"
      style={{ width: 166, boxShadow: '0 2px 14px rgba(0,0,0,0.10)', border: '1px solid rgba(0,0,0,0.04)' }}>

      <div className="relative overflow-hidden" style={{ height: 98, background: bg }}>
        <div style={{ position:'absolute', top:'-15%', right:'-10%', width:'55%', paddingTop:'55%',
          borderRadius:'50%', background:'rgba(255,255,255,0.12)' }} />
        <div style={{ position:'absolute', bottom:'-20%', left:'-12%', width:'45%', paddingTop:'45%',
          borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />

        <div className="absolute inset-0 flex items-center justify-center">
          <StoreLogo store={store} size={50} />
        </div>

        {isNearest && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.06 + 0.3, type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-black text-white"
            style={{ background: 'linear-gradient(135deg,#16A34A,#22C55E)', boxShadow: '0 2px 6px rgba(22,163,74,0.45)' }}>
            <Navigation className="w-2 h-2" />EN YAKIN
          </motion.div>
        )}

        {cartQty > 0 && (
          <span className="absolute top-1.5 right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: '#2BC5D4', color: 'white' }}>🛒 {cartQty}</span>
        )}
      </div>

      <div className="p-2.5">
        <p className="font-extrabold text-[12px] truncate leading-snug" style={{ color: 'var(--text)' }}>
          {store.name}
        </p>
        <div className="flex items-center gap-1 mt-0.5 text-[10px]">
          <Star className="w-2.5 h-2.5 fill-current" style={{ color: '#FBBF24' }} />
          <span className="font-bold" style={{ color: '#FBBF24' }}>{store.rating}</span>
          {dist !== null ? (
            <>
              <span style={{ color: 'var(--border)' }}>·</span>
              <Navigation className="w-2 h-2" style={{ color: '#16A34A' }} />
              <span style={{ color: '#16A34A' }}>{formatDist(dist)}</span>
            </>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>· {store.etaMin} mnt</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({ product, qty, onAdd, onRemove }: {
  product: Product; qty: number; onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-[var(--border-light)] last:border-0">
      <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-2xl shrink-0"
        style={{ background: 'var(--bg)' }}>
        {product.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{product.name}</span>
          {product.popular && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: '#FEF3C7', color: '#D97706' }}>🔥 Populer</span>
          )}
        </div>
        {product.description && (
          <p className="text-[11px] mt-0.5 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {product.description}
          </p>
        )}
        <p className="text-[13px] font-black mt-1.5" style={{ color: '#2BC5D4' }}>
          ₺{product.price}
          {product.unit && (
            <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
              / {product.unit}
            </span>
          )}
        </p>
      </div>
      <div className="shrink-0 self-center">
        <AnimatePresence mode="wait" initial={false}>
          {qty === 0 ? (
            <motion.button key="add"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.14 }}
              whileTap={{ scale: 0.88 }} onClick={onAdd}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)', boxShadow: '0 3px 10px rgba(43,197,212,0.38)' }}>
              <Plus className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.div key="stepper"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.14 }}
              className="flex items-center gap-1.5">
              <motion.button whileTap={{ scale: 0.85 }} onClick={onRemove}
                className="w-7 h-7 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: '#2BC5D4', color: '#2BC5D4' }}>
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="w-5 text-center text-[13px] font-black" style={{ color: 'var(--text)' }}>{qty}</span>
              <motion.button whileTap={{ scale: 0.85 }} onClick={onAdd}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' }}>
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CartBar
// ─────────────────────────────────────────────────────────────────────────────

function CartBar({ qty, amt, onClick }: { qty: number; amt: number; onClick: () => void }) {
  return (
    <AnimatePresence>
      {qty > 0 && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          className="p-4 bg-white border-t border-[var(--border-light)]"
          style={{ boxShadow: '0 -6px 24px rgba(0,0,0,0.08)' }}>
          <motion.button whileTap={{ scale: 0.975 }} onClick={onClick}
            className="w-full py-3.5 rounded-2xl font-black text-[13px] text-white flex items-center justify-between px-5"
            style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)', boxShadow: '0 4px 16px rgba(43,197,212,0.35)' }}>
            <span className="rounded-xl px-2.5 py-0.5 text-xs font-black" style={{ background: 'rgba(255,255,255,0.22)' }}>
              {qty} item
            </span>
            <span>Lihat Keranjang</span>
            <span>₺{amt}</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function ShoppingPage({ onBack, onCheckout }: Props) {
  const [view, setView]             = useState<View>('list');
  const [navDir, setNavDir]         = useState<'fwd' | 'back'>('fwd');
  const [activeCategory, setCat]    = useState<StoreType | 'all'>('all');
  const [searchQuery, setSearch]    = useState('');
  const [selectedStore, setStore]   = useState<Store | null>(null);
  const [activeSection, setSection] = useState('all');
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [workerLoc, setWorkerLoc]       = useState<WorkerLoc>(null);
  const [locLoading, setLocLoading]     = useState(true);
  const [isCheckingOut, setCheckingOut] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ── Geolocation ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!navigator.geolocation) { setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setWorkerLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
      ()  => setLocLoading(false),
      { timeout: 8000, maximumAge: 60000 },
    );
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const nav = (to: View, dir: 'fwd' | 'back' = 'fwd') => { setNavDir(dir); setView(to); };

  const openStore = (store: Store) => {
    setStore(store);
    setSection('all');
    nav('store', 'fwd');
  };

  // ── Cart ───────────────────────────────────────────────────────────────────
  const getQty       = (pid: string) => cart.find(i => i.productId === pid)?.quantity ?? 0;
  const getStoreQty  = (sid: string) => cart.filter(i => i.storeId === sid).reduce((s,i)=>s+i.quantity,0);

  const addItem = (store: Store, product: Product) => {
    const storeAddress = STORE_COORDS[store.id]?.pickupAddress ?? store.address;
    setCart(prev => {
      const idx = prev.findIndex(i => i.productId === product.id);
      if (idx >= 0) {
        const n = [...prev]; n[idx] = { ...n[idx], quantity: n[idx].quantity + 1 }; return n;
      }
      return [...prev, {
        productId: product.id, storeId: store.id, storeName: store.name,
        storeAddress, name: product.name, price: product.price, quantity: 1, emoji: product.emoji,
      }];
    });
  };

  const removeItem = (pid: string) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.productId === pid);
      if (idx < 0) return prev;
      const n = [...prev];
      if (n[idx].quantity <= 1) n.splice(idx, 1);
      else n[idx] = { ...n[idx], quantity: n[idx].quantity - 1 };
      return n;
    });
  };

  // ── Checkout — for multi-branch stores picks nearest via GPS ───────────────
  const handleCheckout = async () => {
    if (cart.length === 0 || isCheckingOut) return;
    const storeId  = cart[0].storeId;
    const branches = BRANCH_GROUPS[storeId];

    if (branches && branches.length > 0) {
      setCheckingOut(true);
      try {
        const pos = await getCurrentLocation();
        let nearest = branches[0];
        let minDist = Infinity;
        for (const b of branches) {
          const d = haversine(pos.lat, pos.lng, b.lat, b.lng);
          if (d < minDist) { minDist = d; nearest = b; }
        }
        onCheckout(cart, allTotal, nearest.pickupAddress, nearest.lat, nearest.lng);
      } catch {
        const fallback = branches[0];
        onCheckout(cart, allTotal, fallback.pickupAddress, fallback.lat, fallback.lng);
      } finally {
        setCheckingOut(false);
      }
    } else {
      const coord = STORE_COORDS[storeId];
      const addr  = coord?.pickupAddress ?? cart[0].storeAddress;
      onCheckout(cart, allTotal, addr, coord?.lat ?? 41.6358, coord?.lng ?? 32.3375);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const allCount   = sumCount(cart);
  const allTotal   = sumTotal(cart);
  const storeItems = selectedStore ? cart.filter(i => i.storeId === selectedStore.id) : [];

  const filteredStores = STORES
    .filter(s => {
      const matchCat = activeCategory === 'all' || s.type === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      return matchCat && (!q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const da = getStoreDist(a, workerLoc);
      const db = getStoreDist(b, workerLoc);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });

  const featuredStores = STORES
    .filter(s => s.rating >= 4.5)
    .sort((a, b) => {
      const da = getStoreDist(a, workerLoc);
      const db = getStoreDist(b, workerLoc);
      if (da === null || db === null) return 0;
      return da - db;
    });

  const nearestStoreId = useMemo(() => {
    if (!workerLoc) return null;
    let best: Store | null = null;
    let minD = Infinity;
    for (const s of STORES) {
      const d = getStoreDist(s, workerLoc);
      if (d !== null && d < minD) { minD = d; best = s; }
    }
    return best?.id ?? null;
  }, [workerLoc]);

  const scrollTo = (name: string) => {
    setSection(name);
    sectionRefs.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pageVar = navDir === 'fwd' ? PAGE_FWD : PAGE_BACK;

  // ─────────────────────────────────────────────────────────────────────────
  // CART VIEW
  // ─────────────────────────────────────────────────────────────────────────

  const CartView = (
    <motion.div key="cart" {...pageVar} className="absolute inset-0 flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="bg-white border-b border-[var(--border-light)] px-4 pt-5 pb-4 flex items-center gap-3"
        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <motion.button whileTap={{ scale: 0.92 }}
          onClick={() => nav(selectedStore ? 'store' : 'list', 'back')}
          className="p-2 rounded-2xl" style={{ background: 'var(--bg)' }}>
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text)' }} />
        </motion.button>
        <h2 className="flex-1 text-base font-black" style={{ color: 'var(--text)' }}>Keranjang Belanja</h2>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#E0F9FB', color: '#2BC5D4' }}>
          {allCount} item
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {[...new Set(cart.map(i => i.storeId))].map(sid => {
          const items    = cart.filter(i => i.storeId === sid);
          const storeObj = STORES.find(s => s.id === sid);
          const coord    = STORE_COORDS[sid];
          const sub      = sumTotal(items);
          return (
            <div key={sid} className="bg-white rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 1px 10px rgba(0,0,0,0.07)' }}>
              {/* store header */}
              <div className="px-4 py-3 flex items-center gap-2.5"
                style={{ background: 'linear-gradient(90deg,#F0FDFF,#E8F8FA)', borderBottom: '1px solid var(--border-light)' }}>
                {storeObj && <StoreLogo store={storeObj} size={28} />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate" style={{ color: '#2BC5D4' }}>{items[0]?.storeName}</p>
                  {coord && (
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                      <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                      {coord.pickupAddress}
                    </p>
                  )}
                </div>
                {coord && (
                  <a href={coord.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 p-1.5 rounded-lg" style={{ background: '#E0F9FB' }}>
                    <ExternalLink className="w-3.5 h-3.5" style={{ color: '#2BC5D4' }} />
                  </a>
                )}
              </div>

              {items.map(item => (
                <div key={item.productId} className="px-4 py-3 flex items-center gap-3"
                  style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{item.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>₺{item.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => removeItem(item.productId)}
                      className="w-7 h-7 rounded-full flex items-center justify-center border-2"
                      style={{ borderColor: '#2BC5D4', color: '#2BC5D4' }}>
                      {item.quantity <= 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </motion.button>
                    <span className="w-5 text-center text-[13px] font-black" style={{ color: 'var(--text)' }}>{item.quantity}</span>
                    <motion.button whileTap={{ scale: 0.88 }} onClick={() => {
                      const s = STORES.find(s => s.id === item.storeId)!;
                      const p = s.sections.flatMap(sec => sec.items).find(p => p.id === item.productId)!;
                      if (s && p) addItem(s, p);
                    }} className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                      style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' }}>
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>
                  <p className="text-[13px] font-black shrink-0 w-14 text-right" style={{ color: 'var(--text)' }}>
                    ₺{item.price * item.quantity}
                  </p>
                </div>
              ))}
              <div className="px-4 py-2.5 flex justify-between" style={{ background: 'var(--bg)' }}>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span className="text-[13px] font-black" style={{ color: 'var(--text)' }}>₺{sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border-t border-[var(--border-light)] p-4"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.07)' }}>
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Total Produk</span>
          <span className="text-xl font-black" style={{ color: 'var(--text)' }}>₺{allTotal}</span>
        </div>
        <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
          + biaya pengiriman dihitung berdasarkan jarak
        </p>
        <motion.button whileTap={{ scale: 0.975 }}
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full py-3.5 rounded-2xl font-black text-[13px] text-white flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)', boxShadow: '0 4px 16px rgba(43,197,212,0.35)' }}>
          {isCheckingOut
            ? <><Loader2 className="w-4 h-4 animate-spin" />Menentukan Cabang Terdekat…</>
            : <><ShoppingCart className="w-4 h-4" />Pilih Alamat Pengiriman</>}
        </motion.button>
      </div>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // STORE DETAIL VIEW
  // ─────────────────────────────────────────────────────────────────────────

  const StoreView = selectedStore && (() => {
    const bg    = selectedStore.bannerColor ?? TYPE_META[selectedStore.type].color;
    const coord = STORE_COORDS[selectedStore.id];
    const dist  = getStoreDist(selectedStore, workerLoc);

    return (
      <motion.div key={selectedStore.id} {...pageVar} className="absolute inset-0 flex flex-col">
        {/* Hero */}
        <div style={{ background: bg, flexShrink: 0 }}>
          <div className="absolute pointer-events-none" style={{ inset:0, overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-15%', right:'-5%', width:'45%', paddingTop:'45%',
              borderRadius:'50%', background:'rgba(255,255,255,0.10)' }} />
            <div style={{ position:'absolute', bottom:'-10%', left:'-8%', width:'35%', paddingTop:'35%',
              borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
          </div>

          {/* nav */}
          <div className="relative z-10 px-4 pt-5 pb-2 flex items-center justify-between">
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => nav('list','back')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
              style={{ background:'rgba(0,0,0,0.28)', backdropFilter:'blur(10px)' }}>
              <ChevronLeft className="w-4 h-4 text-white" />
              <span className="text-[12px] font-bold text-white">Geri</span>
            </motion.button>

            <div className="flex items-center gap-2">
              {coord && (
                <a href={coord.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
                  style={{ background:'rgba(0,0,0,0.28)', backdropFilter:'blur(10px)' }}>
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-bold text-white">Maps</span>
                </a>
              )}

              {allCount > 0 && (
                <motion.button whileTap={{ scale: 0.92 }} onClick={() => nav('cart','fwd')}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-2xl"
                  style={{ background:'rgba(0,0,0,0.28)', backdropFilter:'blur(10px)' }}>
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span className="text-[12px] font-bold text-white">Keranjang</span>
                  <motion.span key={allCount} initial={{ scale:1.4 }} animate={{ scale:1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9px] font-black text-white flex items-center justify-center"
                    style={{ background:'#2BC5D4' }}>{allCount}</motion.span>
                </motion.button>
              )}
            </div>
          </div>

          {/* identity */}
          <div className="relative z-10 px-4 pt-1 pb-5 flex items-end gap-4">
            <StoreLogo store={selectedStore} size={72} />
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-[17px] font-black text-white leading-tight">{selectedStore.name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                <span className="flex items-center gap-1 text-[11px] font-bold text-yellow-300">
                  <Star className="w-3 h-3 fill-current" />{selectedStore.rating}
                </span>
                <span className="text-white/70 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />~{selectedStore.etaMin} menit
                </span>
                {dist !== null && (
                  <span className="text-white/80 text-[11px] flex items-center gap-1 font-bold">
                    <Navigation className="w-3 h-3" />{formatDist(dist)} uzakta
                  </span>
                )}
                {selectedStore.openingHours && (
                  <span className="text-white/60 text-[10px]">{selectedStore.openingHours}</span>
                )}
              </div>
              {coord && (
                <p className="mt-0.5 text-white/55 text-[10px] truncate">
                  <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                  {coord.pickupAddress}
                </p>
              )}
              {selectedStore.phone && (
                <p className="text-white/55 text-[10px]">
                  <Phone className="w-2.5 h-2.5 inline mr-0.5" />{selectedStore.phone}
                </p>
              )}
            </div>
          </div>

          {/* section nav */}
          <div className="bg-white" style={{ borderBottom:'1px solid var(--border-light)' }}>
            <div className="overflow-x-auto py-2.5 px-3 flex gap-2" style={{ scrollbarWidth:'none' }}>
              {['all', ...selectedStore.sections.map(s => s.category)].map(name => (
                <button key={name} onClick={() => scrollTo(name)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all"
                  style={{
                    background: activeSection === name ? '#2BC5D4' : 'var(--bg)',
                    color:      activeSection === name ? 'white' : 'var(--text-muted)',
                  }}>
                  {name === 'all' ? 'Tümü' : name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto" style={{ background:'var(--bg)' }}>
          {selectedStore.sections.map(sec => (
            <div key={sec.category} ref={el => { sectionRefs.current[sec.category] = el; }} className="mt-4 px-4">
              <p className="text-[13px] font-black mb-2" style={{ color:'var(--text)' }}>{sec.category}</p>
              <div className="bg-white rounded-3xl overflow-hidden px-4"
                style={{ border:'1px solid var(--border-light)' }}>
                {sec.items.map(product => (
                  <ProductCard key={product.id} product={product}
                    qty={getQty(product.id)}
                    onAdd={() => addItem(selectedStore, product)}
                    onRemove={() => removeItem(product.id)} />
                ))}
              </div>
            </div>
          ))}
          <div className="h-6" />
        </div>

        <CartBar qty={sumCount(storeItems)} amt={sumTotal(storeItems)} onClick={() => nav('cart','fwd')} />
      </motion.div>
    );
  })();

  // ─────────────────────────────────────────────────────────────────────────
  // LIST VIEW
  // ─────────────────────────────────────────────────────────────────────────

  const ListView = (
    <motion.div key="list" {...pageVar} className="absolute inset-0 flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="bg-white flex-shrink-0"
        style={{ boxShadow:'0 2px 12px rgba(0,0,0,0.08)', borderBottom:'1px solid var(--border-light)' }}>

        {/* Title row */}
        <div className="px-4 pt-5 pb-3 flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.92 }} onClick={onBack}
            className="p-2 rounded-2xl" style={{ background:'var(--bg)' }}>
            <ChevronLeft className="w-5 h-5" style={{ color:'var(--text)' }} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-black" style={{ color:'var(--text)' }}>Pesan Sekarang</h2>
            {workerLoc ? (
              <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color:'#16A34A' }}>
                <Navigation className="w-2.5 h-2.5" />
                Diurutkan dari yang terdekat
              </p>
            ) : locLoading ? (
              <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color:'var(--text-muted)' }}>
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Mengambil lokasi...
              </p>
            ) : null}
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => nav('map','fwd')}
            className="p-2.5 rounded-2xl" style={{ background:'var(--bg)', border:'1.5px solid var(--border-light)' }}>
            <MapIcon className="w-5 h-5" style={{ color:'var(--text-muted)' }} />
          </motion.button>
          {allCount > 0 && (
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => nav('cart','fwd')}
              className="relative p-2.5 rounded-2xl" style={{ background:'#E0F9FB' }}>
              <ShoppingCart className="w-5 h-5" style={{ color:'#2BC5D4' }} />
              <motion.span key={allCount} initial={{ scale:1.4 }} animate={{ scale:1 }}
                className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[9px] font-black text-white flex items-center justify-center"
                style={{ background:'#2BC5D4' }}>{allCount}</motion.span>
            </motion.button>
          )}
        </div>

        {/* Promo banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mx-4 mb-3 px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5"
          style={{ background: 'linear-gradient(135deg,#CCF5F8,#E0F9FB)', border: '1px solid rgba(43,197,212,0.18)' }}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#2BC5D4,#4DD4E0)' }}>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-[11px] font-bold flex-1" style={{ color: '#0E7490' }}>
            Tiba 30–60 menit · Pekerja terdekat otomatis dipilih
          </p>
        </motion.div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2.5 px-3.5 rounded-2xl"
            style={{ background:'var(--bg)', border:'1.5px solid var(--border-light)', height:44,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
            <Search className="w-4 h-4 shrink-0" style={{ color:'var(--text-muted)' }} />
            <input type="text" placeholder="Restoran, market, kafe ara..."
              value={searchQuery} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[13px]" style={{ color:'var(--text)' }} />
            {searchQuery && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSearch('')}>
                <X className="w-4 h-4" style={{ color:'var(--text-muted)' }} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="overflow-x-auto pb-3 px-4 flex gap-2" style={{ scrollbarWidth:'none' }}>
          {STORE_CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <motion.button key={cat.id} whileTap={{ scale: 0.94 }}
                onClick={() => setCat(cat.id as StoreType | 'all')}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap"
                style={{
                  background: active ? 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' : 'var(--bg)',
                  color:      active ? 'white'   : 'var(--text-muted)',
                  border:     active ? 'none'    : '1.5px solid var(--border-light)',
                  boxShadow:  active ? '0 3px 10px rgba(43,197,212,0.35)' : 'none',
                }}>
                <span>{cat.emoji}</span><span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Featured strip */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="pt-5 pb-1">
            <div className="px-4 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)' }}>
                  <Star className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
                </div>
                <p className="text-[14px] font-black" style={{ color:'var(--text)' }}>Öne Çıkanlar</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#FEF3C7', color: '#D97706' }}>
                  {featuredStores.length} toko
                </span>
              </div>
              <span className="text-[10.5px] font-semibold" style={{ color: '#2BC5D4' }}>Paling populer →</span>
            </div>
            <div className="overflow-x-auto pl-4 pr-2 pb-2 flex gap-3" style={{ scrollbarWidth:'none' }}>
              {featuredStores.map((store, i) => (
                <FeaturedCard key={store.id} store={store}
                  cartQty={getStoreQty(store.id)}
                  dist={getStoreDist(store, workerLoc)}
                  index={i}
                  isNearest={nearestStoreId === store.id}
                  onClick={() => openStore(store)} />
              ))}
            </div>
          </div>
        )}

        {/* Section label */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#E0F9FB,#CCF5F8)' }}>
              <span className="text-sm">🏪</span>
            </div>
            <p className="text-[14px] font-black flex-1" style={{ color:'var(--text)' }}>
              {searchQuery
                ? `Hasil untuk "${searchQuery}"`
                : activeCategory === 'all'
                  ? 'Semua Toko'
                  : STORE_CATEGORIES.find(c=>c.id===activeCategory)?.label}
            </p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>
              {filteredStores.length}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="px-4 pb-6">
          {filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <span className="text-5xl">🔍</span>
              <p className="text-sm font-bold" style={{ color:'var(--text-muted)' }}>Sonuç bulunamadı</p>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => { setSearch(''); setCat('all'); }}
                className="text-[12px] font-bold px-4 py-2 rounded-xl"
                style={{ color:'#2BC5D4', background:'#E0F9FB' }}>
                Filtreleri temizle
              </motion.button>
            </div>
          ) : (
            <motion.div
              key={activeCategory + '|' + searchQuery + '|' + (workerLoc ? '1' : '0')}
              variants={GRID_CONTAINER} initial="hidden" animate="show"
              className="grid grid-cols-2 gap-3">
              {filteredStores.map(store => (
                <StoreCard key={store.id} store={store}
                  cartQty={getStoreQty(store.id)}
                  dist={getStoreDist(store, workerLoc)}
                  locLoading={locLoading}
                  isNearest={nearestStoreId === store.id}
                  onClick={() => openStore(store)} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <CartBar qty={allCount} amt={allTotal} onClick={() => nav('cart','fwd')} />
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // MAP VIEW
  // ─────────────────────────────────────────────────────────────────────────

  const MapView = (
    <motion.div key="map" {...pageVar} className="absolute inset-0 flex flex-col">
      {/* Header */}
      <div className="bg-white flex-shrink-0 px-4 pt-5 pb-3 flex items-center gap-3"
        style={{ boxShadow:'0 1px 8px rgba(0,0,0,0.06)', borderBottom:'1px solid var(--border-light)' }}>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => nav('list','back')}
          className="p-2 rounded-2xl" style={{ background:'var(--bg)' }}>
          <ChevronLeft className="w-5 h-5" style={{ color:'var(--text)' }} />
        </motion.button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[17px] font-black" style={{ color:'var(--text)' }}>Peta Toko</h2>
          {nearestStoreId && workerLoc ? (
            <p className="text-[10px] flex items-center gap-1 mt-0.5 truncate" style={{ color:'#2BC5D4' }}>
              <Navigation className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">
                {STORES.find(s => s.id === nearestStoreId)?.name} — terdekat dari lokasimu
              </span>
            </p>
          ) : locLoading ? (
            <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color:'var(--text-muted)' }}>
              <Loader2 className="w-2.5 h-2.5 animate-spin" />Mengambil lokasi...
            </p>
          ) : null}
        </div>
        {allCount > 0 && (
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => nav('cart','fwd')}
            className="relative p-2.5 rounded-2xl" style={{ background:'#E0F9FB' }}>
            <ShoppingCart className="w-5 h-5" style={{ color:'#2BC5D4' }} />
            <motion.span key={allCount} initial={{ scale:1.4 }} animate={{ scale:1 }}
              className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full text-[9px] font-black text-white flex items-center justify-center"
              style={{ background:'#2BC5D4' }}>{allCount}</motion.span>
          </motion.button>
        )}
      </div>

      {/* Full-height map */}
      <div className="flex-1 relative">
        {view === 'map' && (
          <StoreMap
            workerLoc={workerLoc}
            nearestStoreId={nearestStoreId}
            onSelectStore={store => { setStore(store); setSection('all'); nav('store','fwd'); }}
          />
        )}
      </div>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen relative overflow-hidden" style={{ background:'var(--bg)' }}>
      <AnimatePresence mode="wait">
        {view === 'cart'  && CartView}
        {view === 'store' && StoreView}
        {view === 'map'   && MapView}
        {view === 'list'  && ListView}
      </AnimatePresence>
    </div>
  );
}
