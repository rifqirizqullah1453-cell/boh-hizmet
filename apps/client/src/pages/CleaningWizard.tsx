import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Check, MapPin, Navigation,
  Loader2, Clock, Users, Minus, Plus, Sparkles,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { getCurrentLocation } from '@/components/MapLeaflet';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import type { CleaningConfigOutput, CleaningBreakdownLine } from '@boh/contracts';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type WizardStep =
  | 'property'   // 1 – Jenis properti
  | 'area'       // 2 – Luas + kamar
  | 'service'    // 3 – Jenis layanan
  | 'dirt'       // 4 – Tingkat kekotoran
  | 'addons'     // 5 – Tambahan
  | 'equipment'  // 6 – Alat sendiri?
  | 'address'    // 7 – Alamat
  | 'summary';   // 8 – Ringkasan

const STEPS: WizardStep[] = ['property','area','service','dirt','addons','equipment','address','summary'];

interface WizardState {
  propertyTypeSlug: string;
  areaM2:           number;
  bedroomCount:     number;
  bathroomCount:    number;
  serviceTypeSlug:  string;
  dirtLevelSlug:    string;
  addonSlugs:       string[];
  bringsEquipment:  boolean;
  address:          string;
  lat:              number;
  lng:              number;
  notes:            string;
}

const INITIAL: WizardState = {
  propertyTypeSlug: '',
  areaM2:           60,
  bedroomCount:     2,
  bathroomCount:    1,
  serviceTypeSlug:  '',
  dirtLevelSlug:    '',
  addonSlugs:       [],
  bringsEquipment:  false,
  address:          '',
  lat:              0,
  lng:              0,
  notes:            '',
};

// ─────────────────────────────────────────────────────────────────────────────
// Local estimate (mirrors server formula — instant feedback, no API round-trip)
// ─────────────────────────────────────────────────────────────────────────────

const CITY_CENTER = { lat: 41.6358, lng: 32.3375 };

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function localEstimate(
  cfg: CleaningConfigOutput,
  s: WizardState,
  distanceKm: number,
  isWeekend: boolean
): { lines: CleaningBreakdownLine[]; total: number; hours: number; workers: number } | null {
  if (!s.propertyTypeSlug || !s.serviceTypeSlug || !s.dirtLevelSlug) return null;

  const baseRate = cfg.baseRates.find(
    r => r.propertyTypeSlug === s.propertyTypeSlug &&
         r.areaMin <= s.areaM2 &&
         (r.areaMax == null || r.areaMax >= s.areaM2)
  );
  if (!baseRate) return null;

  const serviceType = cfg.serviceTypes.find(t => t.slug === s.serviceTypeSlug);
  const dirtLevel   = cfg.dirtLevels.find(d => d.slug === s.dirtLevelSlug);
  const propertyType = cfg.propertyTypes.find(p => p.slug === s.propertyTypeSlug);
  if (!serviceType || !dirtLevel) return null;

  const selectedAddons = cfg.addons.filter(a => s.addonSlugs.includes(a.slug));
  const lines: CleaningBreakdownLine[] = [];

  const basePrice     = baseRate.basePrice;
  const bedroomPrice  = s.bedroomCount  * cfg.roomFees.bedroom.pricePerUnit;
  const bathroomPrice = s.bathroomCount * cfg.roomFees.bathroom.pricePerUnit;
  const subtotalBase  = basePrice + bedroomPrice + bathroomPrice;

  lines.push({ label: `${propertyType?.label ?? ''} ${s.areaM2} m²`, price: basePrice, type: 'base' });
  if (bedroomPrice  > 0) lines.push({ label: `${s.bedroomCount} Kamar Tidur`,  price: bedroomPrice,  type: 'room' });
  if (bathroomPrice > 0) lines.push({ label: `${s.bathroomCount} Kamar Mandi`, price: bathroomPrice, type: 'room' });

  const afterService     = Math.round(subtotalBase * serviceType.priceMultiplier);
  const serviceSurcharge = afterService - subtotalBase;
  if (serviceSurcharge > 0) lines.push({ label: serviceType.label, price: serviceSurcharge, type: 'surcharge' });

  const afterDirt    = Math.round(afterService * dirtLevel.priceMultiplier);
  const dirtSurcharge = afterDirt - afterService;
  if (dirtSurcharge > 0) lines.push({ label: `Kekotoran ${dirtLevel.label}`, price: dirtSurcharge, type: 'surcharge' });

  const afterWeekend      = isWeekend ? Math.round(afterDirt * cfg.config.weekendMultiplier) : afterDirt;
  const weekendSurcharge  = afterWeekend - afterDirt;
  if (weekendSurcharge > 0) lines.push({ label: 'Akhir Pekan', price: weekendSurcharge, type: 'surcharge' });

  for (const addon of selectedAddons) {
    lines.push({ label: [addon.emoji, addon.label].filter(Boolean).join(' '), price: addon.price, type: 'addon' });
  }

  if (s.bringsEquipment) {
    lines.push({ label: 'Peralatan Kebersihan', price: cfg.config.equipmentFee, type: 'equipment' });
  }

  const overKm       = Math.max(0, distanceKm - cfg.config.transportBaseKm);
  const transportFee = Math.min(Math.round(overKm * cfg.config.transportPerKm), cfg.config.transportMaxFee);
  if (transportFee > 0) {
    lines.push({ label: `Transport (${distanceKm.toFixed(1)} km)`, price: transportFee, type: 'transport' });
  }

  const total = lines.reduce((sum, l) => sum + l.price, 0);

  // Duration
  const baseDurMin     = baseRate.baseDurationHours * 60;
  const roomDurMin     = s.bedroomCount  * cfg.roomFees.bedroom.durationMinPerUnit +
                         s.bathroomCount * cfg.roomFees.bathroom.durationMinPerUnit;
  const afterSvcDur    = Math.round((baseDurMin + roomDurMin) * serviceType.durationMultiplier);
  const afterDirtDur   = Math.round(afterSvcDur * dirtLevel.durationMultiplier);
  const addonDurMin    = selectedAddons.reduce((sum, a) => sum + a.durationMin, 0);
  const hours          = Math.round(((afterDirtDur + addonDurMin) / 60) * 10) / 10;

  return { lines, total, hours, workers: baseRate.baseWorkers };
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation helpers
// ─────────────────────────────────────────────────────────────────────────────

const slideIn = (dir: 'fwd' | 'back') => ({
  initial:  { x: dir === 'fwd' ? '100%' : '-100%', opacity: 0 },
  animate:  { x: 0, opacity: 1, transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const } },
  exit:     { x: dir === 'fwd' ? '-30%' : '30%', opacity: 0, transition: { duration: 0.22 } },
});

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI atoms
// ─────────────────────────────────────────────────────────────────────────────

function RadioCard({
  selected, onClick, emoji, label, sub,
}: {
  selected: boolean; onClick: () => void;
  emoji?: string; label: string; sub?: string;
}) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
      style={{
        background: selected ? 'linear-gradient(135deg,#E0F9FB,#CCF5F8)' : 'white',
        border: `1.5px solid ${selected ? '#2BC5D4' : 'var(--border-light)'}`,
        boxShadow: selected ? '0 2px 12px rgba(43,197,212,0.18)' : '0 1px 4px rgba(0,0,0,0.05)',
      }}>
      {emoji && <span className="text-2xl shrink-0">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text)' }}>{label}</p>
        {sub && <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
        style={{
          borderColor: selected ? '#2BC5D4' : 'var(--border)',
          background:  selected ? '#2BC5D4' : 'transparent',
        }}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </motion.button>
  );
}

function Stepper({
  value, min = 0, max = 20, onChange, label,
}: {
  value: number; min?: number; max?: number; onChange: (v: number) => void; label: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)] last:border-0">
      <p className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
      <div className="flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full flex items-center justify-center border-2 disabled:opacity-30"
          style={{ borderColor: '#2BC5D4', color: '#2BC5D4' }}>
          <Minus className="w-3.5 h-3.5" />
        </motion.button>
        <span className="w-6 text-center text-[15px] font-black" style={{ color: 'var(--text)' }}>{value}</span>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' }}>
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
}

function RunningTotal({ total }: { total: number | null }) {
  if (!total) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5">
      <Sparkles className="w-3.5 h-3.5" style={{ color: '#2BC5D4' }} />
      <span className="text-[13px] font-black" style={{ color: '#2BC5D4' }}>
        Estimasi ₺{total.toLocaleString()}
      </span>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step labels
// ─────────────────────────────────────────────────────────────────────────────

const STEP_TITLE: Record<WizardStep, string> = {
  property:  'Jenis Properti',
  area:      'Luas & Kamar',
  service:   'Jenis Layanan',
  dirt:      'Tingkat Kekotoran',
  addons:    'Layanan Tambahan',
  equipment: 'Peralatan',
  address:   'Alamat',
  summary:   'Ringkasan',
};

const STEP_SUB: Record<WizardStep, string> = {
  property:  'Apa jenis bangunan yang akan dibersihkan?',
  area:      'Berapa luas bangunan dan jumlah kamar?',
  service:   'Pilih jenis pembersihan yang diinginkan',
  dirt:      'Seberapa kotor kondisi saat ini?',
  addons:    'Pilih layanan tambahan (opsional)',
  equipment: 'Apakah pekerja perlu membawa alat?',
  address:   'Di mana lokasi yang akan dibersihkan?',
  summary:   'Periksa detail dan konfirmasi pesanan',
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface Props { onBack: () => void; }

export default function CleaningWizard({ onBack }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const [stepIdx, setStepIdx] = useState(0);
  const [navDir,  setNavDir]  = useState<'fwd' | 'back'>('fwd');
  const [state,   setState]   = useState<WizardState>(INITIAL);
  const [gpsLoading, setGpsLoading] = useState(false);

  const step = STEPS[stepIdx];
  const isWeekend = [0, 6].includes(new Date().getDay()); // Sun=0, Sat=6

  // Config from DB — loads once, no refetch
  const { data: cfg, isLoading: cfgLoading, isError: cfgError, error: cfgErrorObj, refetch: refetchCfg } =
    trpc.cleaning.getConfig.useQuery(undefined, {
      staleTime: Infinity,
      retry: 1,
    });

  const createOrder = trpc.cleaning.createOrder.useMutation({
    onSuccess: ({ orderId }) => {
      toast('Pesanan berhasil dibuat!', 'success');
      navigate(`/track/${orderId}`);
    },
    onError: (err) => toast(err.message, 'error'),
  });

  // Distance from user's location to city center (proxy for worker travel cost)
  const distanceKm = useMemo(() => {
    if (!state.lat || !state.lng) return 0;
    return haversine(state.lat, state.lng, CITY_CENTER.lat, CITY_CENTER.lng);
  }, [state.lat, state.lng]);

  // Live estimate — recomputes on every state change using local formula
  const estimate = useMemo(() => {
    if (!cfg) return null;
    return localEstimate(cfg, state, distanceKm, isWeekend);
  }, [cfg, state, distanceKm, isWeekend]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const canProceed = useMemo(() => {
    switch (step) {
      case 'property':  return !!state.propertyTypeSlug;
      case 'area':      return state.areaM2 >= 1;
      case 'service':   return !!state.serviceTypeSlug;
      case 'dirt':      return !!state.dirtLevelSlug;
      case 'addons':    return true;
      case 'equipment': return true;
      case 'address':   return state.address.trim().length > 0;
      case 'summary':   return true;
    }
  }, [step, state]);

  const goNext = () => {
    setNavDir('fwd');
    setStepIdx(i => i + 1);
  };

  const goBack = () => {
    if (stepIdx === 0) { onBack(); return; }
    setNavDir('back');
    setStepIdx(i => i - 1);
  };

  const upd = <K extends keyof WizardState>(key: K, val: WizardState[K]) =>
    setState(s => ({ ...s, [key]: val }));

  const toggleAddon = (slug: string) =>
    setState(s => ({
      ...s,
      addonSlugs: s.addonSlugs.includes(slug)
        ? s.addonSlugs.filter(x => x !== slug)
        : [...s.addonSlugs, slug],
    }));

  const handleGps = async () => {
    setGpsLoading(true);
    try {
      const pos = await getCurrentLocation();
      upd('lat', pos.lat);
      upd('lng', pos.lng);
      if (!state.address) upd('address', 'Lokasi Saya (GPS)');
      toast('Lokasi terdeteksi!', 'success');
    } catch {
      toast('GPS tidak tersedia. Masukkan alamat secara manual.', 'error');
    }
    setGpsLoading(false);
  };

  const handleSubmit = () => {
    if (!userProfile || userProfile.uid?.startsWith('guest-')) {
      toast('Silakan login terlebih dahulu.', 'error'); return;
    }
    createOrder.mutate({
      propertyTypeSlug: state.propertyTypeSlug,
      serviceTypeSlug:  state.serviceTypeSlug,
      areaM2:           state.areaM2,
      bedroomCount:     state.bedroomCount,
      bathroomCount:    state.bathroomCount,
      dirtLevelSlug:    state.dirtLevelSlug,
      bringsEquipment:  state.bringsEquipment,
      addonSlugs:       state.addonSlugs,
      distanceKm:       Math.round(distanceKm * 10) / 10,
      isWeekend,
      address:          state.address,
      lat:              state.lat || CITY_CENTER.lat,
      lng:              state.lng || CITY_CENTER.lng,
      notes:            state.notes || undefined,
    });
  };

  // ── Error ────────────────────────────────────────────────────────────────────
  if (cfgError) {
    return (
      <div className="h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#FEF2F2' }}>
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-[15px] font-black mb-1" style={{ color: 'var(--text)' }}>Gagal memuat konfigurasi</p>
            <p className="text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {(cfgErrorObj as any)?.message ?? 'Tidak dapat terhubung ke server. Pastikan server sedang berjalan dan migrasi database sudah dijalankan.'}
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <motion.button whileTap={{ scale: 0.97 }} onClick={onBack}
              className="flex-1 py-3 rounded-2xl text-[13px] font-bold"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
              Kembali
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => refetchCfg()}
              className="flex-1 py-3 rounded-2xl text-[13px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' }}>
              Coba Lagi
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (cfgLoading || !cfg) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2BC5D4' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Memuat konfigurasi harga...</p>
        </div>
      </div>
    );
  }

  // ── Step content ─────────────────────────────────────────────────────────────
  const stepContent = (() => {
    switch (step) {

      // ── 1. Property type ────────────────────────────────────────────────────
      case 'property':
        return (
          <div className="space-y-3">
            {cfg.propertyTypes.map(pt => (
              <RadioCard key={pt.slug}
                selected={state.propertyTypeSlug === pt.slug}
                onClick={() => upd('propertyTypeSlug', pt.slug)}
                emoji={pt.emoji ?? undefined}
                label={pt.label} />
            ))}
          </div>
        );

      // ── 2. Area + rooms ─────────────────────────────────────────────────────
      case 'area':
        return (
          <div className="space-y-5">
            {/* Area input */}
            <div className="bg-white rounded-2xl p-4" style={{ border: '1px solid var(--border-light)' }}>
              <p className="text-[12px] font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
                LUAS BANGUNAN
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-4 rounded-2xl"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--border-light)', height: 48 }}>
                  <input
                    type="number" min={1} max={5000}
                    value={state.areaM2}
                    onChange={e => upd('areaM2', Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-transparent outline-none text-[18px] font-black"
                    style={{ color: 'var(--text)' }}
                  />
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>m²</span>
                </div>
                <div className="flex gap-1.5">
                  {[40, 80, 120].map(v => (
                    <motion.button key={v} whileTap={{ scale: 0.92 }}
                      onClick={() => upd('areaM2', v)}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold"
                      style={{
                        background: state.areaM2 === v ? '#2BC5D4' : 'var(--bg)',
                        color:      state.areaM2 === v ? 'white'   : 'var(--text-muted)',
                        border:     `1.5px solid ${state.areaM2 === v ? 'transparent' : 'var(--border-light)'}`,
                      }}>
                      {v}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white rounded-2xl px-4 py-1" style={{ border: '1px solid var(--border-light)' }}>
              <Stepper label="Kamar Tidur 🛏️" value={state.bedroomCount}
                onChange={v => upd('bedroomCount', v)} />
              <Stepper label="Kamar Mandi 🚿" value={state.bathroomCount}
                onChange={v => upd('bathroomCount', v)} />
            </div>
          </div>
        );

      // ── 3. Service type ─────────────────────────────────────────────────────
      case 'service':
        return (
          <div className="space-y-3">
            {cfg.serviceTypes.map(st => {
              const multiplierLabel =
                st.priceMultiplier === 1 ? 'Harga dasar' :
                `+${Math.round((st.priceMultiplier - 1) * 100)}% dari harga dasar`;
              return (
                <RadioCard key={st.slug}
                  selected={state.serviceTypeSlug === st.slug}
                  onClick={() => upd('serviceTypeSlug', st.slug)}
                  label={st.label}
                  sub={`${st.description ?? ''} · ${multiplierLabel}`} />
              );
            })}
          </div>
        );

      // ── 4. Dirt level ───────────────────────────────────────────────────────
      case 'dirt': {
        const dirtColors: Record<string, { color: string; bg: string }> = {
          ringan: { color: '#16A34A', bg: '#F0FDF4' },
          sedang: { color: '#D97706', bg: '#FFFBEB' },
          berat:  { color: '#DC2626', bg: '#FEF2F2' },
        };
        const dirtDesc: Record<string, string> = {
          ringan: 'Debu tipis, baru dibersihkan 1-2 minggu lalu',
          sedang: 'Cukup kotor, 1-2 bulan tidak dibersihkan',
          berat:  'Sangat kotor, bertahun-tahun, noda membandel',
        };
        return (
          <div className="space-y-3">
            {cfg.dirtLevels.map(dl => {
              const c = dirtColors[dl.slug] ?? { color: 'var(--text)', bg: 'var(--bg)' };
              const selected = state.dirtLevelSlug === dl.slug;
              return (
                <motion.button key={dl.slug} whileTap={{ scale: 0.97 }}
                  onClick={() => upd('dirtLevelSlug', dl.slug)}
                  className="w-full px-4 py-3.5 rounded-2xl text-left flex items-start gap-3"
                  style={{
                    background: selected ? c.bg : 'white',
                    border: `1.5px solid ${selected ? c.color : 'var(--border-light)'}`,
                    boxShadow: selected ? `0 2px 12px ${c.color}28` : '0 1px 4px rgba(0,0,0,0.05)',
                  }}>
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: c.color }} />
                  <div className="flex-1">
                    <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{dl.label}</p>
                    <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {dirtDesc[dl.slug] ?? ''}
                      {dl.priceMultiplier > 1 && (
                        <span className="ml-1 font-bold" style={{ color: c.color }}>
                          (+{Math.round((dl.priceMultiplier - 1) * 100)}%)
                        </span>
                      )}
                    </p>
                  </div>
                  {selected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: c.color }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        );
      }

      // ── 5. Addons ───────────────────────────────────────────────────────────
      case 'addons':
        return (
          <div>
            <p className="text-[11px] font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              Pilih layanan ekstra yang diinginkan
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {cfg.addons.map(addon => {
                const sel = state.addonSlugs.includes(addon.slug);
                return (
                  <motion.button key={addon.slug} whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAddon(addon.slug)}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-2xl text-left"
                    style={{
                      background: sel ? 'linear-gradient(135deg,#E0F9FB,#CCF5F8)' : 'white',
                      border: `1.5px solid ${sel ? '#2BC5D4' : 'var(--border-light)'}`,
                    }}>
                    <span className="text-2xl">{addon.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold truncate" style={{ color: 'var(--text)' }}>{addon.label}</p>
                      <p className="text-[10.5px] font-bold" style={{ color: '#2BC5D4' }}>₺{addon.price}</p>
                    </div>
                    {sel && (
                      <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: '#2BC5D4', width: 18, height: 18 }}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            {state.addonSlugs.length > 0 && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => upd('addonSlugs', [])}
                className="mt-3 text-[11px] font-bold"
                style={{ color: 'var(--text-muted)' }}>
                Hapus semua pilihan
              </motion.button>
            )}
          </div>
        );

      // ── 6. Equipment ────────────────────────────────────────────────────────
      case 'equipment':
        return (
          <div className="space-y-3">
            <RadioCard
              selected={state.bringsEquipment}
              onClick={() => upd('bringsEquipment', true)}
              emoji="🧹"
              label="Ya, pekerja bawa alat"
              sub={`Biaya tambahan ₺${cfg.config.equipmentFee} · Pekerja membawa semua perlengkapan`}
            />
            <RadioCard
              selected={!state.bringsEquipment}
              onClick={() => upd('bringsEquipment', false)}
              emoji="✅"
              label="Tidak, saya punya alat"
              sub="Anda menyediakan sapu, pel, lap, dll. · Tanpa biaya tambahan"
            />
          </div>
        );

      // ── 7. Address ──────────────────────────────────────────────────────────
      case 'address':
        return (
          <div className="space-y-4">
            {/* GPS button */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleGps}
              disabled={gpsLoading}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
              style={{
                background: state.lat ? '#F0FDF4' : 'white',
                border: `1.5px solid ${state.lat ? '#16A34A' : 'var(--border-light)'}`,
              }}>
              {gpsLoading
                ? <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#2BC5D4' }} />
                : state.lat
                  ? <Check className="w-5 h-5" style={{ color: '#16A34A' }} />
                  : <Navigation className="w-5 h-5" style={{ color: '#2BC5D4' }} />
              }
              <div className="text-left">
                <p className="text-[13.5px] font-bold" style={{ color: state.lat ? '#16A34A' : 'var(--text)' }}>
                  {state.lat ? 'Lokasi terdeteksi' : 'Deteksi Lokasi Otomatis'}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {state.lat
                    ? `${state.lat.toFixed(4)}, ${state.lng.toFixed(4)} · ${distanceKm.toFixed(1)} km dari pusat kota`
                    : 'Ketuk untuk menggunakan GPS perangkat Anda'}
                </p>
              </div>
            </motion.button>

            {/* Manual address input */}
            <div>
              <label className="text-[12px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                ALAMAT LENGKAP
              </label>
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl"
                style={{ background: 'white', border: '1.5px solid var(--border-light)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#2BC5D4' }} />
                <textarea
                  rows={2}
                  placeholder="Cth: Jl. Merdeka No. 12, RT 03/RW 07, Kel. Kebun Jeruk..."
                  value={state.address}
                  onChange={e => upd('address', e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[13px] resize-none"
                  style={{ color: 'var(--text)' }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[12px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
                CATATAN UNTUK CLEANER (opsional)
              </label>
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl"
                style={{ background: 'white', border: '1.5px solid var(--border-light)' }}>
                <textarea
                  rows={2}
                  placeholder="Cth: Masuk lewat pintu belakang, kunci ada di bawah keset..."
                  value={state.notes}
                  onChange={e => upd('notes', e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[13px] resize-none"
                  style={{ color: 'var(--text)' }}
                />
              </div>
            </div>

            {isWeekend && (
              <div className="px-3.5 py-2.5 rounded-2xl flex items-center gap-2"
                style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <span className="text-base">📅</span>
                <p className="text-[11.5px] font-bold" style={{ color: '#D97706' }}>
                  Akhir pekan — tarif ×{cfg.config.weekendMultiplier} berlaku
                </p>
              </div>
            )}
          </div>
        );

      // ── 8. Summary ──────────────────────────────────────────────────────────
      case 'summary':
        return (
          <div className="space-y-4">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3.5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#E0F9FB,#CCF5F8)', border: '1px solid rgba(43,197,212,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Clock className="w-4 h-4" style={{ color: '#2BC5D4' }} />
                  <span className="text-[11px] font-bold" style={{ color: '#0E7490' }}>Estimasi Waktu</span>
                </div>
                <p className="text-[18px] font-black" style={{ color: 'var(--text)' }}>
                  {estimate?.hours ?? '—'} <span className="text-[13px] font-semibold">jam</span>
                </p>
              </div>
              <div className="px-4 py-3.5 rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Users className="w-4 h-4" style={{ color: '#16A34A' }} />
                  <span className="text-[11px] font-bold" style={{ color: '#166534' }}>Cleaner</span>
                </div>
                <p className="text-[18px] font-black" style={{ color: 'var(--text)' }}>
                  {estimate?.workers ?? '—'} <span className="text-[13px] font-semibold">orang</span>
                </p>
              </div>
            </div>

            {/* Breakdown */}
            {estimate && (
              <div className="bg-white rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border-light)' }}>
                <div className="px-4 py-3 border-b border-[var(--border-light)]"
                  style={{ background: 'var(--bg)' }}>
                  <p className="text-[12px] font-black" style={{ color: 'var(--text-muted)' }}>RINCIAN HARGA</p>
                </div>
                {estimate.lines.map((line, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-[var(--border-light)] last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{
                        background: line.type === 'base'      ? '#2BC5D4' :
                                    line.type === 'room'      ? '#8B5CF6' :
                                    line.type === 'surcharge' ? '#F59E0B' :
                                    line.type === 'addon'     ? '#10B981' :
                                    line.type === 'equipment' ? '#EC4899' :
                                                                '#6B7280',
                      }} />
                      <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{line.label}</span>
                    </div>
                    <span className="text-[13px] font-bold shrink-0 ml-4" style={{ color: 'var(--text)' }}>
                      ₺{line.price.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="px-4 py-3.5 flex items-center justify-between"
                  style={{ background: 'linear-gradient(135deg,#E0F9FB,#CCF5F8)' }}>
                  <span className="text-[14px] font-black" style={{ color: 'var(--text)' }}>Total</span>
                  <span className="text-[18px] font-black" style={{ color: '#2BC5D4' }}>
                    ₺{estimate.total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Address recap */}
            <div className="px-4 py-3 rounded-2xl flex items-start gap-2.5"
              style={{ background: 'white', border: '1px solid var(--border-light)' }}>
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#2BC5D4' }} />
              <p className="text-[12.5px] leading-snug" style={{ color: 'var(--text)' }}>
                {state.address}
              </p>
            </div>

            {state.notes.trim() && (
              <div className="px-4 py-3 rounded-2xl"
                style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <p className="text-[11px] font-bold mb-0.5" style={{ color: '#D97706' }}>Catatan:</p>
                <p className="text-[12px]" style={{ color: 'var(--text)' }}>{state.notes}</p>
              </div>
            )}
          </div>
        );
    }
  })();

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* Header */}
      <div className="bg-white flex-shrink-0 px-4 pt-5 pb-4"
        style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="flex items-center gap-3 mb-3">
          <motion.button whileTap={{ scale: 0.92 }} onClick={goBack}
            className="p-2 rounded-2xl" style={{ background: 'var(--bg)' }}>
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text)' }} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text)' }}>
              {STEP_TITLE[step]}
            </h2>
            <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {STEP_SUB[step]}
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: '#E0F9FB', color: '#2BC5D4' }}>
            {stepIdx + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' }}
            animate={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </div>

      {/* Animated step content */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div key={step} {...slideIn(navDir)}
            className="absolute inset-0 px-4 pt-5 pb-4 overflow-y-auto">
            {stepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white flex-shrink-0 px-4 py-4"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.07)', borderTop: '1px solid var(--border-light)' }}>
        <div className="flex items-center justify-between mb-3">
          <RunningTotal total={estimate?.total ?? null} />
          {estimate && (
            <span className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>
              {estimate.hours} jam · {estimate.workers} cleaner
            </span>
          )}
        </div>

        {step === 'summary' ? (
          <motion.button whileTap={{ scale: 0.975 }}
            onClick={handleSubmit}
            disabled={createOrder.isPending}
            className="w-full py-3.5 rounded-2xl font-black text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)', boxShadow: '0 4px 16px rgba(43,197,212,0.35)' }}>
            {createOrder.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" />Membuat Pesanan…</>
              : <><Sparkles className="w-4 h-4" />Konfirmasi & Pesan</>
            }
          </motion.button>
        ) : (
          <motion.button whileTap={{ scale: 0.975 }}
            onClick={goNext}
            disabled={!canProceed}
            className="w-full py-3.5 rounded-2xl font-black text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#4DD4E0,#2BC5D4)', boxShadow: '0 4px 16px rgba(43,197,212,0.35)' }}>
            Lanjut <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
