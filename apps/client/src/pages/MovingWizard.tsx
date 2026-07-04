import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Check, Truck, ArrowUp, ArrowDown,
  Package, Calendar, MapPin, Crosshair, AlertCircle, RefreshCw,
  Plus, X as XIcon,
} from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentLocation } from '@/components/MapLeaflet';
import { useToast } from '@/contexts/ToastContext';
import type { MovingConfigOutput } from '@boh/contracts';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface WizardState {
  sizeSlug:         string;
  pickupFloor:      number;
  destFloor:        number;
  hasLift:          boolean;
  heavyItemSlugs:   string[];
  customHeavyItems: string[];
  scheduledAt:      string; // ISO string or ''
  pickupAddress:    string;
  pickupLat:        number;
  pickupLng:        number;
  destAddress:      string;
  destLat:          number;
  destLng:          number;
  notes:            string;
}

const INITIAL: WizardState = {
  sizeSlug:         '',
  pickupFloor:      1,
  destFloor:        1,
  hasLift:          false,
  heavyItemSlugs:   [],
  customHeavyItems: [],
  scheduledAt:      '',
  pickupAddress:    '',
  pickupLat:        41.6358,
  pickupLng:        32.3375,
  destAddress:      '',
  destLat:          41.6358,
  destLng:          32.3375,
  notes:            '',
};

type WizardStep = 'size' | 'floor' | 'items' | 'schedule' | 'address' | 'summary';

const STEPS: WizardStep[] = ['size', 'floor', 'items', 'schedule', 'address', 'summary'];

const STEP_LABELS: Record<WizardStep, string> = {
  size:     'Ukuran',
  floor:    'Lantai',
  items:    'Barang Berat',
  schedule: 'Jadwal',
  address:  'Alamat',
  summary:  'Ringkasan',
};

// ─── Local estimate (mirrors server formula) ────────────────────────────────

function localEstimate(cfg: MovingConfigOutput, state: WizardState) {
  const size = cfg.sizes.find(s => s.slug === state.sizeSlug);
  if (!size) return { lines: [], total: 0, vehicleType: '', helperCount: 0 };

  type Line = { label: string; price: number };
  const lines: Line[] = [];

  lines.push({ label: size.label, price: size.basePrice });

  if (!state.hasLift && (state.pickupFloor > 1 || state.destFloor > 1)) {
    const extra = (state.pickupFloor - 1) + (state.destFloor - 1);
    const surcharge = cfg.config.floorBaseSurcharge + extra * cfg.config.floorPerFloorFee;
    lines.push({ label: 'Surcharge Lantai (tanpa lift)', price: surcharge });
  }

  for (const slug of state.heavyItemSlugs) {
    const item = cfg.heavyItems.find(i => i.slug === slug);
    if (item) {
      lines.push({ label: [item.emoji, item.label].filter(Boolean).join(' '), price: item.price });
    }
  }

  const customCount = state.customHeavyItems.filter(s => s.trim().length > 0).length;
  if (customCount > 0) {
    lines.push({ label: `Barang Lain (${customCount} item)`, price: customCount * cfg.config.customItemFee });
  }

  const subtotal = lines.reduce((s, l) => s + l.price, 0);
  const isWeekend = state.scheduledAt
    ? [0, 6].includes(new Date(state.scheduledAt).getDay())
    : [0, 6].includes(new Date().getDay());

  if (isWeekend) {
    const ws = Math.round(subtotal * (cfg.config.weekendMultiplier - 1));
    if (ws > 0) lines.push({ label: 'Akhir Pekan', price: ws });
  }

  return {
    lines,
    total: lines.reduce((s, l) => s + l.price, 0),
    vehicleType:  size.vehicleType,
    helperCount:  size.helperCount,
  };
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Stepper({ title, value, min = 1, max = 30, onChange }: {
  title: string; value: number; min?: number; max?: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[var(--border-light)]">
      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</span>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
          style={{ background: value <= min ? 'var(--border)' : 'linear-gradient(135deg,#2BC5D4,#4DD4E0)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        <span className="w-8 text-center text-lg font-black" style={{ color: 'var(--text)' }}>{value}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
          style={{ background: value >= max ? 'var(--border)' : 'linear-gradient(135deg,#2BC5D4,#4DD4E0)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}

function RunningTotal({ total, className = '' }: { total: number; className?: string }) {
  if (total <= 0) return null;
  return (
    <motion.div
      key={total}
      initial={{ scale: 0.95, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center justify-between px-4 py-3 rounded-2xl ${className}`}
      style={{ background: 'linear-gradient(135deg,#E8F8FA,#F0FDFF)', border: '1.5px solid #2BC5D4' }}
    >
      <span className="text-xs font-bold" style={{ color: '#2BC5D4' }}>Estimasi Harga</span>
      <span className="text-xl font-black" style={{ color: '#0E9FAD' }}>₺{total.toLocaleString()}</span>
    </motion.div>
  );
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

export default function MovingWizard({ onBack }: { onBack: () => void }) {
  const navigate   = useNavigate();
  const { toast }  = useToast();
  const { userProfile } = useAuth();

  const [stepIdx, setStepIdx] = useState(0);
  const [dir,     setDir]     = useState(1);
  const [state,   setState]   = useState<WizardState>(INITIAL);
  const [customInput, setCustomInput] = useState('');
  const [gpsLoading, setGpsLoading] = useState<'pickup' | 'dest' | null>(null);
  const [submitError, setSubmitError] = useState('');

  const step = STEPS[stepIdx];

  const {
    data: cfg,
    isLoading: cfgLoading,
    isError: cfgError,
    refetch: refetchCfg,
  } = trpc.moving.getConfig.useQuery(undefined, { staleTime: Infinity, retry: 1 });

  const createOrder = trpc.moving.createOrder.useMutation({
    onSuccess: (data: { orderId: string }) => {
      toast('Pesanan pindahan berhasil dibuat!', 'success');
      navigate(`/track/${data.orderId}`);
    },
    onError: (err: { message: string }) => setSubmitError(err.message),
  });

  const estimate = cfg ? localEstimate(cfg, state) : null;

  function go(delta: number) {
    setDir(delta);
    setStepIdx(i => i + delta);
  }

  const canProceed: Record<WizardStep, boolean> = {
    size:     !!state.sizeSlug,
    floor:    true,
    items:    true,
    schedule: true,
    address:  !!(state.pickupAddress && state.destAddress),
    summary:  true,
  };

  async function handleGps(type: 'pickup' | 'dest') {
    setGpsLoading(type);
    try {
      const pos = await getCurrentLocation();
      if (type === 'pickup') {
        setState(s => ({ ...s, pickupLat: pos.lat, pickupLng: pos.lng, pickupAddress: 'Lokasi Saya (GPS)' }));
      } else {
        setState(s => ({ ...s, destLat: pos.lat, destLng: pos.lng, destAddress: 'Lokasi Saya (GPS)' }));
      }
      toast('Lokasi terdeteksi!', 'success');
    } catch {
      toast('GPS gagal. Aktifkan layanan lokasi.', 'error');
    }
    setGpsLoading(null);
  }

  function addCustomItem() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    setState(s => ({ ...s, customHeavyItems: [...s.customHeavyItems, trimmed] }));
    setCustomInput('');
  }

  function handleSubmit() {
    if (!userProfile || userProfile.uid?.startsWith('guest-')) {
      setSubmitError('Silakan login untuk membuat pesanan.');
      return;
    }
    if (!cfg) return;

    const isWeekend = state.scheduledAt
      ? [0, 6].includes(new Date(state.scheduledAt).getDay())
      : [0, 6].includes(new Date().getDay());

    createOrder.mutate({
      sizeSlug:           state.sizeSlug,
      pickupFloor:        state.pickupFloor,
      destFloor:          state.destFloor,
      hasLift:            state.hasLift,
      heavyItemSlugs:     state.heavyItemSlugs,
      customHeavyItems:   state.customHeavyItems,
      isWeekend,
      pickupAddress:      state.pickupAddress,
      pickupLat:          state.pickupLat,
      pickupLng:          state.pickupLng,
      destinationAddress: state.destAddress,
      destinationLat:     state.destLat,
      destinationLng:     state.destLng,
      scheduledAt:        state.scheduledAt || undefined,
      notes:              state.notes || undefined,
    });
  }

  // ── Loading / error state ──
  if (cfgLoading || !cfg) {
    if (cfgError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6" style={{ background: 'var(--bg)' }}>
          <AlertCircle className="w-12 h-12" style={{ color: '#EF4444' }} />
          <p className="text-sm font-semibold text-center" style={{ color: 'var(--text)' }}>
            Gagal memuat konfigurasi harga. Pastikan server berjalan.
          </p>
          <div className="flex gap-3">
            <button onClick={onBack} className="px-4 py-2 rounded-xl text-sm font-bold border border-[var(--border)] bg-white" style={{ color: 'var(--text-secondary)' }}>
              Kembali
            </button>
            <button onClick={() => refetchCfg()} className="px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2"
              style={{ background: '#2BC5D4' }}>
              <RefreshCw className="w-4 h-4" /> Coba Lagi
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-[#A5F3FC] border-t-[#2BC5D4]" />
      </div>
    );
  }

  // ── Step content ──
  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-white border-b border-[var(--border-light)]">
        <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-4 hover:text-[#2BC5D4] transition-colors" style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#E8F8FA' }}>
            <Truck className="w-5 h-5" style={{ color: '#2BC5D4' }} />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text)' }}>Pindahan</h1>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{STEP_LABELS[step]}</p>
          </div>
        </div>
        {/* Progress */}
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 h-1.5 rounded-full transition-all"
              style={{ background: i <= stepIdx ? '#2BC5D4' : 'var(--border-light)' }} />
          ))}
        </div>
      </div>

      {/* Step body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="space-y-4"
          >
            {/* ── Step: Ukuran ── */}
            {step === 'size' && (
              <>
                <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>Ukuran Pindahan</h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Pilih ukuran yang paling sesuai dengan jumlah barang kamu.</p>
                <div className="space-y-3">
                  {cfg.sizes.map(s => (
                    <motion.button key={s.slug}
                      onClick={() => setState((p: WizardState) => ({ ...p, sizeSlug: s.slug }))}
                      whileHover={{ scale: 1.01, x: 3 }} whileTap={{ scale: 0.98 }}
                      className="w-full p-4 rounded-3xl text-left flex items-center gap-4 bg-white border-[1.5px] transition-all"
                      style={{ borderColor: state.sizeSlug === s.slug ? '#2BC5D4' : 'var(--border-light)' }}
                    >
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: state.sizeSlug === s.slug ? '#E8F8FA' : 'var(--bg)' }}>
                        <Truck className="w-7 h-7" style={{ color: state.sizeSlug === s.slug ? '#2BC5D4' : 'var(--text-muted)' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{s.label}</p>
                        {s.description && (
                          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.description}</p>
                        )}
                        <p className="text-xs font-semibold mt-1" style={{ color: '#2BC5D4' }}>
                          Mulai ₺{s.basePrice.toLocaleString()} · {s.vehicleType} · {s.helperCount} helper
                        </p>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: state.sizeSlug === s.slug ? '#2BC5D4' : 'var(--bg)', border: state.sizeSlug === s.slug ? 'none' : '1.5px solid var(--border)' }}>
                        {state.sizeSlug === s.slug && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </>
            )}

            {/* ── Step: Lantai ── */}
            {step === 'floor' && (
              <>
                <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>Informasi Lantai</h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Lantai mempengaruhi harga jika tidak ada lift. Lantai 1 = tidak ada tangga.
                </p>
                <div className="space-y-3">
                  <Stepper title="Lantai Pickup" value={state.pickupFloor} onChange={v => setState(s => ({ ...s, pickupFloor: v }))} />
                  <Stepper title="Lantai Tujuan" value={state.destFloor} onChange={v => setState(s => ({ ...s, destFloor: v }))} />
                  {/* Lift toggle */}
                  <motion.button
                    onClick={() => setState(s => ({ ...s, hasLift: !s.hasLift }))}
                    whileTap={{ scale: 0.97 }}
                    className="w-full p-4 rounded-2xl flex items-center justify-between bg-white border-[1.5px] transition-all"
                    style={{ borderColor: state.hasLift ? '#22C55E' : 'var(--border-light)' }}
                  >
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Ada Lift</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        {state.hasLift ? 'Tidak ada surcharge tangga' : 'Surcharge tangga berlaku jika lantai > 1'}
                      </p>
                    </div>
                    <div className="w-12 h-6 rounded-full relative transition-colors"
                      style={{ background: state.hasLift ? '#22C55E' : 'var(--border)' }}>
                      <motion.div animate={{ x: state.hasLift ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </motion.button>

                  {!state.hasLift && (state.pickupFloor > 1 || state.destFloor > 1) && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl" style={{ background: '#E8F8FA', border: '1px solid #A5F3FC' }}>
                      <p className="text-xs font-semibold" style={{ color: '#2BC5D4' }}>
                        Surcharge tangga akan ditambahkan karena tidak ada lift dan lantai &gt; 1.
                      </p>
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {/* ── Step: Barang Berat ── */}
            {step === 'items' && (
              <>
                <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>Barang Berat</h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Centang barang yang perlu penanganan khusus.</p>
                <div className="grid grid-cols-2 gap-2">
                  {cfg.heavyItems.map(item => {
                    const selected = state.heavyItemSlugs.includes(item.slug);
                    return (
                      <motion.button key={item.slug}
                        onClick={() => setState(s => ({
                          ...s,
                          heavyItemSlugs: selected
                            ? s.heavyItemSlugs.filter(x => x !== item.slug)
                            : [...s.heavyItemSlugs, item.slug],
                        }))}
                        whileTap={{ scale: 0.96 }}
                        className="p-3 rounded-2xl text-left flex flex-col gap-1 bg-white border-[1.5px] transition-all"
                        style={{ borderColor: selected ? '#2BC5D4' : 'var(--border-light)' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{item.emoji ?? ''}</span>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: selected ? '#2BC5D4' : 'var(--bg)', border: selected ? 'none' : '1.5px solid var(--border)' }}>
                            {selected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>{item.label}</p>
                        <p className="text-[11px] font-semibold" style={{ color: '#2BC5D4' }}>+₺{item.price}</p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Custom items */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Barang Lainnya</p>
                  {state.customHeavyItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[var(--border-light)]">
                      <Package className="w-4 h-4 shrink-0" style={{ color: '#2BC5D4' }} />
                      <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text)' }}>{item}</span>
                      <button onClick={() => setState(s => ({ ...s, customHeavyItems: s.customHeavyItems.filter((_, idx) => idx !== i) }))}>
                        <XIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                      placeholder="Nama barang lain (mis. Mesin jahit)..."
                      className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] outline-none bg-white"
                    />
                    <motion.button whileTap={{ scale: 0.9 }} onClick={addCustomItem}
                      className="px-3 py-2 rounded-xl text-white flex items-center gap-1 text-xs font-bold"
                      style={{ background: '#2BC5D4' }}>
                      <Plus className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}

            {/* ── Step: Jadwal ── */}
            {step === 'schedule' && (
              <>
                <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>Kapan Pindahan?</h2>
                <div className="space-y-3">
                  <motion.button
                    onClick={() => setState(s => ({ ...s, scheduledAt: '' }))}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-2xl text-left flex items-center gap-3 bg-white border-[1.5px] transition-all"
                    style={{ borderColor: !state.scheduledAt ? '#2BC5D4' : 'var(--border-light)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: !state.scheduledAt ? '#E8F8FA' : 'var(--bg)' }}>
                      <Truck className="w-5 h-5" style={{ color: !state.scheduledAt ? '#2BC5D4' : 'var(--text-muted)' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Sekarang</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Worker akan segera dikirim</p>
                    </div>
                    {!state.scheduledAt && <Check className="w-5 h-5" style={{ color: '#2BC5D4' }} />}
                  </motion.button>

                  <div className="p-4 rounded-2xl bg-white border-[1.5px] transition-all"
                    style={{ borderColor: state.scheduledAt ? '#2BC5D4' : 'var(--border-light)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: state.scheduledAt ? '#E8F8FA' : 'var(--bg)' }}>
                        <Calendar className="w-5 h-5" style={{ color: state.scheduledAt ? '#2BC5D4' : 'var(--text-muted)' }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Jadwalkan</p>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Pilih tanggal & waktu</p>
                      </div>
                    </div>
                    <input
                      type="datetime-local"
                      value={state.scheduledAt}
                      onChange={e => setState(s => ({ ...s, scheduledAt: e.target.value }))}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] outline-none bg-white"
                    />
                  </div>

                  {state.scheduledAt && [0, 6].includes(new Date(state.scheduledAt).getDay()) && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl" style={{ background: '#E8F8FA', border: '1px solid #A5F3FC' }}>
                      <p className="text-xs font-semibold" style={{ color: '#2BC5D4' }}>
                        Jadwal akhir pekan — pengali harga weekend berlaku (+{Math.round((cfg.config.weekendMultiplier - 1) * 100)}%).
                      </p>
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {/* ── Step: Alamat ── */}
            {step === 'address' && (
              <>
                <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>Alamat Pindahan</h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Semua dalam wilayah Bartın. Alamat disimpan untuk koordinasi operasional.
                </p>

                {/* Pickup address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: '#2BC5D4' }}>
                    <ArrowUp className="w-3.5 h-3.5" /> Alamat Pickup (Asal)
                  </label>
                  <textarea
                    value={state.pickupAddress}
                    onChange={e => setState(s => ({ ...s, pickupAddress: e.target.value }))}
                    placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Bartın..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-xs font-medium resize-none outline-none rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] transition-all bg-white"
                  />
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => handleGps('pickup')} disabled={gpsLoading === 'pickup'}
                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                    style={{ background: '#E8F8FA', color: '#2BC5D4' }}>
                    {gpsLoading === 'pickup'
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-[#A5F3FC] border-t-[#2BC5D4] rounded-full" />
                      : <><Crosshair className="w-3.5 h-3.5" /> Gunakan GPS Saya</>}
                  </motion.button>
                </div>

                {/* Destination address */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: '#10B981' }}>
                    <ArrowDown className="w-3.5 h-3.5" /> Alamat Tujuan
                  </label>
                  <textarea
                    value={state.destAddress}
                    onChange={e => setState(s => ({ ...s, destAddress: e.target.value }))}
                    placeholder="Jl. Tujuan No. 2, Kelurahan, Kecamatan, Bartın..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-xs font-medium resize-none outline-none rounded-xl border-[1.5px] border-[var(--border)] focus:border-green-400 transition-all bg-white"
                  />
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => handleGps('dest')} disabled={gpsLoading === 'dest'}
                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                    style={{ background: '#ECFDF5', color: '#10B981' }}>
                    {gpsLoading === 'dest'
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-green-200 border-t-green-500 rounded-full" />
                      : <><Crosshair className="w-3.5 h-3.5" /> Gunakan GPS Saya</>}
                  </motion.button>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-muted)' }}>Catatan (opsional)</label>
                  <textarea
                    value={state.notes}
                    onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
                    placeholder="Instruksi khusus, akses jalan, dll..."
                    rows={2}
                    className="w-full px-3 py-2 text-xs font-medium resize-none outline-none rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] transition-all bg-white"
                  />
                </div>
              </>
            )}

            {/* ── Step: Ringkasan ── */}
            {step === 'summary' && estimate && (
              <>
                <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>Ringkasan Pesanan</h2>

                {/* Vehicle & helpers */}
                <div className="p-4 rounded-2xl bg-white border border-[var(--border-light)] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#E8F8FA' }}>
                    <Truck className="w-6 h-6" style={{ color: '#2BC5D4' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{estimate.vehicleType}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{estimate.helperCount} helper · {cfg.sizes.find(s => s.slug === state.sizeSlug)?.label}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="p-3 rounded-xl bg-white border border-[var(--border-light)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0" style={{ color: '#2BC5D4' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                    {state.scheduledAt
                      ? new Date(state.scheduledAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                      : 'Sekarang'}
                  </span>
                </div>

                {/* Addresses */}
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white border border-[var(--border-light)] flex items-start gap-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#2BC5D4' }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase" style={{ color: '#2BC5D4' }}>Pickup</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{state.pickupAddress}</p>
                      {state.pickupFloor > 1 && <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Lantai {state.pickupFloor} {state.hasLift ? '(ada lift)' : '(tanpa lift)'}</p>}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[var(--border-light)] flex items-start gap-2">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#10B981' }} />
                    <div>
                      <p className="text-[10px] font-bold uppercase" style={{ color: '#10B981' }}>Tujuan</p>
                      <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>{state.destAddress}</p>
                      {state.destFloor > 1 && <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Lantai {state.destFloor} {state.hasLift ? '(ada lift)' : '(tanpa lift)'}</p>}
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="rounded-2xl overflow-hidden border border-[var(--border-light)]">
                  <div className="px-4 py-2 bg-[var(--bg)]">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Rincian Harga</p>
                  </div>
                  {estimate.lines.map((line, i) => (
                    <div key={i} className="px-4 py-2.5 flex justify-between items-center bg-white border-t border-[var(--border-light)]">
                      <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{line.label}</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>₺{line.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="px-4 py-3 flex justify-between items-center border-t-[2px] border-[#A5F3FC]"
                    style={{ background: 'linear-gradient(135deg,#E8F8FA,#F0FDFF)' }}>
                    <span className="text-sm font-black" style={{ color: '#0E9FAD' }}>Total</span>
                    <span className="text-xl font-black" style={{ color: '#0E9FAD' }}>₺{estimate.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit error */}
                <AnimatePresence>
                  {submitError && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#FEF2F2' }}>
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                      <p className="text-xs font-medium" style={{ color: '#EF4444' }}>{submitError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Running total (all steps except summary) */}
        {step !== 'summary' && estimate && estimate.total > 0 && (
          <div className="mt-5">
            <RunningTotal total={estimate.total} />
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="px-5 py-4 bg-white border-t border-[var(--border-light)] flex gap-3">
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { if (stepIdx === 0) onBack(); else go(-1); }}
          className="px-5 py-3 rounded-2xl text-sm font-bold border-[1.5px] border-[var(--border)] bg-white"
          style={{ color: 'var(--text-secondary)' }}>
          {stepIdx === 0 ? 'Batal' : 'Kembali'}
        </motion.button>

        {step !== 'summary' ? (
          <motion.button
            onClick={() => go(1)}
            disabled={!canProceed[step]}
            whileHover={canProceed[step] ? { scale: 1.01 } : undefined}
            whileTap={canProceed[step] ? { scale: 0.98 } : undefined}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#2BC5D4,#0E9FAD)', opacity: canProceed[step] ? 1 : 0.4 }}
          >
            Lanjut <ChevronRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            onClick={handleSubmit}
            disabled={createOrder.isPending}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#2BC5D4,#0E9FAD)' }}
          >
            {createOrder.isPending ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <><Check className="w-4 h-4" /> Buat Pesanan</>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
