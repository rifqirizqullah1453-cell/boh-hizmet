import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { useToast } from '@/contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Navigation, ArrowRight,
  AlertCircle, ChevronLeft, Sparkles,
  Check, Crosshair, FileText, Banknote, Clock, X,
  Upload, FileCheck, Copy,
} from 'lucide-react';
import type { ServiceType } from '@/types';
import { SERVICE_CATEGORIES, SERVICE_LABELS } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import MapLeaflet, { type MapLeafletHandle, getCurrentLocation } from '@/components/MapLeaflet';
import AddressAutosuggest, { type SuggestResult } from '@/components/AddressAutosuggest';
import { auth } from '@/firebase/config';
import ShoppingPage, { type CartItem } from '@/pages/ShoppingPage';
import CleaningWizard from '@/pages/CleaningWizard';
import MovingWizard from '@/pages/MovingWizard';

function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Mirror of server pricing.service — keeps price display instant for all users.
const RATE_PER_METER = 70 / 500;
const STOP_FEE = 10;
const MINIMUM_FARE = 70;
function calcPrice(distanceKm: number, stopCount: number): number {
  return Math.max(MINIMUM_FARE, Math.round(distanceKm * 1000 * RATE_PER_METER)) + stopCount * STOP_FEE;
}

// BOH workers travel by bicycle (≥1 km) or on foot (<1 km).
// Speeds are urban averages including stops and traffic.
const WALK_KMH = 4.5;
const BIKE_KMH = 10;
const ACCEPT_BUFFER_MIN = 5; // worker acceptance + prep time

function calcEta(distanceKm: number): { minutes: number; mode: 'walk' | 'bike' } {
  const mode = distanceKm < 1 ? 'walk' : 'bike';
  const speed = mode === 'walk' ? WALK_KMH : BIKE_KMH;
  const travelMin = (distanceKm / speed) * 60;
  return { minutes: Math.round(travelMin + ACCEPT_BUFFER_MIN), mode };
}

const DEFAULT_CENTER = { lat: 41.6358, lng: 32.3375 };

function CheckIcon(props: any) {
  return (
    <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAuth();
  const { createOrder } = useOrders();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [showShopping, setShowShopping] = useState(false);
  const [showCleaning, setShowCleaning] = useState(false);
  const [showMoving,   setShowMoving]   = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>('delivery');
  const [locationStep, setLocationStep] = useState<'pickup' | 'destination' | 'review'>('pickup');

  // Pickup
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupLat, setPickupLat] = useState(DEFAULT_CENTER.lat);
  const [pickupLng, setPickupLng] = useState(DEFAULT_CENTER.lng);
  const [pickupConfirmed, setPickupConfirmed] = useState(false);

  // Destination
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destLat, setDestLat] = useState(0);
  const [destLng, setDestLng] = useState(0);
  const [destConfirmed, setDestConfirmed] = useState(false);

  // REAL-TIME map center (from MapLeaflet onCenterChange)
  const [mapCenterLat, setMapCenterLat] = useState(DEFAULT_CENTER.lat);
  const [mapCenterLng, setMapCenterLng] = useState(DEFAULT_CENTER.lng);
  const [mapCenterAddress, setMapCenterAddress] = useState('');

  // Promo, multi-stop, scheduled, payment
  const [promoCode, setPromoCode] = useState('');
  const [stops, setStops] = useState<Array<{ address: string; lat: number; lng: number }>>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [proofError, setProofError] = useState('');
  const proofInputRef = useRef<HTMLInputElement>(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showScheduleInput, setShowScheduleInput] = useState(false);
  const [showStopsInput, setShowStopsInput] = useState(false);

  // Detail alamat lengkap
  const [pickupDetail, setPickupDetail] = useState('');
  const [destDetail, setDestDetail] = useState('');

  // Other
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [error, setError] = useState('');

  const mapRef = useRef<MapLeafletHandle>(null);

  // Price and distance calculated client-side — instant, works for guests too.
  const estimatedDistanceKm =
    pickupConfirmed && destConfirmed && destLat && destLng
      ? calcDistanceKm(pickupLat, pickupLng, destLat, destLng)
      : null;
  const deliveryFee = estimatedDistanceKm != null ? calcPrice(estimatedDistanceKm, stops.length) : null;
  const estimatedPrice = deliveryFee != null ? deliveryFee + cartSubtotal : null;
  const etaResult = estimatedDistanceKm ? calcEta(estimatedDistanceKm) : null;
  const estimatedEtaMin = etaResult?.minutes ?? null;
  const travelMode = etaResult?.mode ?? null;

  // GPS: pan map to pickup area (does NOT auto-confirm — user still pins the store)
  const handleGpsPickup = async () => {
    setIsGpsLoading(true);
    try {
      const pos = await getCurrentLocation();
      mapRef.current?.flyTo(pos.lat, pos.lng, 17);
      toast('Peta dipusatkan ke lokasi kamu', 'info');
    } catch {
      toast('GPS tidak tersedia', 'error');
    }
    setIsGpsLoading(false);
  };

  // GPS: Set destination to customer's real GPS location
  const handleGpsDestination = async () => {
    setIsGpsLoading(true);
    try {
      const pos = await getCurrentLocation();
      setDestLat(pos.lat);
      setDestLng(pos.lng);
      setDestinationAddress('Lokasi Saya (GPS)');
      setDestConfirmed(true);
      toast('Lokasi kamu berhasil dideteksi!', 'success');
      setLocationStep('review');
    } catch {
      toast('GPS gagal. Aktifkan layanan lokasi.', 'error');
    }
    setIsGpsLoading(false);
  };

  // Map center changed (real-time from MapLeaflet)
  const handleCenterChange = (lat: number, lng: number, address: string) => {
    setMapCenterLat(lat);
    setMapCenterLng(lng);
    setMapCenterAddress(address);
  };

  // Confirm pickup from center pin
  const confirmPickupFromPin = () => {
    setPickupLat(mapCenterLat);
    setPickupLng(mapCenterLng);
    setPickupAddress(mapCenterAddress || 'Selected Location');
    setPickupConfirmed(true);
    toast('Pickup confirmed!', 'success');
    setLocationStep('destination');
  };

  // Confirm destination from center pin
  const confirmDestFromPin = () => {
    setDestLat(mapCenterLat);
    setDestLng(mapCenterLng);
    setDestinationAddress(mapCenterAddress || 'Selected Location');
    setDestConfirmed(true);
    toast('Destination confirmed!', 'success');
    setLocationStep('review');
  };

  const selectSearchResult = (result: SuggestResult) => {
    mapRef.current?.flyTo(result.lat, result.lng, 17);
    if (locationStep === 'pickup') {
      setPickupLat(result.lat);
      setPickupLng(result.lng);
      setPickupAddress(result.name);
      setPickupConfirmed(true);
      toast('Pickup set!', 'success');
      setLocationStep('destination');
    } else {
      setDestLat(result.lat);
      setDestLng(result.lng);
      setDestinationAddress(result.name);
      setDestConfirmed(true);
      toast('Destination set!', 'success');
      setLocationStep('review');
    }
  };

  const handleSubmit = async () => {
    if (!pickupAddress || !destinationAddress) {
      setError('Confirm both pickup and destination');
      return;
    }
    if (userProfile?.uid?.startsWith('guest-')) {
      setError('Silakan login atau buat akun untuk membuat pesanan.');
      return;
    }

    // Check Firebase Auth session is still valid before submitting
    if (!auth.currentUser) {
      setError('Sesi login kamu sudah berakhir. Silakan login ulang.');
      return;
    }
    let token: string | null = null;
    try {
      token = await auth.currentUser.getIdToken();
    } catch {
      setError('Sesi login kamu sudah berakhir. Silakan login ulang.');
      return;
    }
    if (!token) {
      setError('Sesi login kamu sudah berakhir. Silakan login ulang.');
      return;
    }

    if (paymentMethod === 'online' && !paymentProof) {
      setError('Upload bukti transfer terlebih dahulu.');
      return;
    }

    setError('');
    setIsLoading(true);
    const cartNote = cartItems.length > 0
      ? `BELANJAAN:\n${cartItems.map(i => `- ${i.storeName}: ${i.name} x${i.quantity} = ₺${i.price * i.quantity}`).join('\n')}\nSubtotal produk: ₺${cartSubtotal}`
      : '';
    const proofNote = paymentProof
      ? `BUKTI TRANSFER: ${paymentProof.name} (${(paymentProof.size / 1024 / 1024).toFixed(2)} MB)`
      : '';
    const fullNotes = [
      cartNote,
      pickupDetail && `Pickup Detail: ${pickupDetail}`,
      destDetail && `Destination Detail: ${destDetail}`,
      proofNote,
      notes,
    ].filter(Boolean).join('\n\n');
    try {
      const id = await createOrder({
        serviceType, pickupAddress, pickupLat, pickupLng,
        destinationAddress, destinationLat: destLat, destinationLng: destLng,
        notes: fullNotes, price: 0,
        stops: stops.length > 0 ? stops : undefined,
        stopCount: stops.length,
        scheduledAt: scheduledAt ? new Date(scheduledAt).getTime() : undefined,
        paymentMethod,
        promoCode: promoCode || undefined,
      });
      toast('Order created!', 'success');
      navigate(`/track/${id}`);
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      if (msg === 'Failed to fetch' || msg.includes('network') || msg.includes('fetch')) {
        setError('Tidak dapat terhubung ke server. Pastikan server sedang berjalan.');
      } else if (msg.includes('UNAUTHORIZED') || msg.includes('Authentication')) {
        setError('Sesi login kamu sudah berakhir. Silakan login ulang.');
      } else {
        setError(msg || 'Terjadi kesalahan. Coba lagi.');
      }
      setIsLoading(false);
    }
  };

  const serviceColors: Record<string, { bg: string; border: string }> = {
    delivery: { bg: '#E8F8FA', border: '#2BC5D4' },
    shopping: { bg: '#ECFDF5', border: '#10B981' },
    cleaning: { bg: '#F5F3FF', border: '#8B5CF6' },
    moving: { bg: '#FDF2F8', border: '#EC4899' },
  };

  const modeColor = locationStep === 'pickup' ? '#2BC5D4' : '#F59E0B';

  // ===== MOVING WIZARD =====
  if (showMoving) {
    return <MovingWizard onBack={() => setShowMoving(false)} />;
  }

  // ===== CLEANING WIZARD =====
  if (showCleaning) {
    return <CleaningWizard onBack={() => setShowCleaning(false)} />;
  }

  // ===== SHOPPING STEP (step 1.5 when serviceType === 'shopping') =====
  if (showShopping) {
    return (
      <ShoppingPage
        onBack={() => setShowShopping(false)}
        onCheckout={(items, subtotal, storeAddr, storeLat, storeLng) => {
          setCartItems(items);
          setCartSubtotal(subtotal);
          // Auto-confirm pickup at the store's real address
          setPickupAddress(storeAddr);
          setPickupLat(storeLat);
          setPickupLng(storeLng);
          setPickupConfirmed(true);
          setShowShopping(false);
          setStep(2);
          setLocationStep('destination');
          // Immediately try to auto-detect customer GPS for destination
          setIsGpsLoading(true);
          getCurrentLocation()
            .then(pos => {
              setDestLat(pos.lat);
              setDestLng(pos.lng);
              setDestinationAddress('Lokasi Saya (GPS)');
              setDestConfirmed(true);
              setLocationStep('review');
            })
            .catch(() => { /* GPS denied — user picks manually */ })
            .finally(() => setIsGpsLoading(false));
        }}
      />
    );
  }

  // ===== STEP 1 =====
  if (step === 1) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="px-5 pt-5 pb-4 bg-white border-b border-[var(--border-light)]">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm font-semibold mb-4 hover:text-[#2BC5D4] transition-colors" style={{ color: 'var(--text-muted)' }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Choose Service</h1>
            <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>What do you need today?</p>
          </div>
          <div className="px-5 pt-4 pb-10 max-w-lg mx-auto space-y-3">
            {SERVICE_CATEGORIES.map((s, i) => (
              <motion.button key={s.id} onClick={() => setServiceType(s.id)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.98 }}
                className="w-full p-4 rounded-3xl text-left flex items-center gap-4 bg-white border-[1.5px] hover:shadow-xl transition-all"
                style={{ borderColor: serviceType === s.id ? serviceColors[s.id]?.border : 'var(--border-light)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: serviceColors[s.id]?.bg }}>
                  <img src={s.img} alt={s.name} className="w-12 h-12 object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{s.name}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>{SERVICE_LABELS[s.id]}</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: serviceType === s.id ? 'linear-gradient(135deg,#4DD4E0,#2BC5D4)' : 'var(--bg)', border: serviceType === s.id ? 'none' : '1.5px solid #CBD5E1' }}>
                  {serviceType === s.id && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </div>
              </motion.button>
            ))}
            <motion.button
              onClick={() => {
                if (serviceType === 'shopping') setShowShopping(true);
                else if (serviceType === 'cleaning') setShowCleaning(true);
                else if (serviceType === 'moving') setShowMoving(true);
                else setStep(2);
              }}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 btn-cyan flex items-center justify-center gap-2 rounded-2xl mt-2">
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== STEP 2: SPLIT LAYOUT =====
  return (
    <div className="h-screen flex flex-col md:flex-row" style={{ background: 'var(--bg)' }}>
      {/* MAP AREA — full, clean, no overlays except tiny header */}
      <div className="flex-1 relative min-h-[55vh] md:min-h-0 md:h-full">
        {/* Floating header — small, transparent */}
        <div className="absolute top-0 left-0 right-0 z-[400] px-3 py-2 flex items-center gap-2 pointer-events-none">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => {
            if (locationStep === 'destination') setLocationStep('pickup');
            else if (locationStep === 'review') setLocationStep('destination');
            else { setStep(1); navigate('/'); }
          }} className="p-2 rounded-xl bg-white/90 backdrop-blur shadow-md border border-[var(--border-light)] pointer-events-auto">
            <ChevronLeft className="w-4 h-4" style={{ color: '#2BC5D4' }} />
          </motion.button>
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow-md border border-[var(--border-light)]">
            <div className={`w-2 h-2 rounded-full ${pickupConfirmed ? 'bg-[#2BC5D4]' : 'bg-[var(--border)]'}`} />
            <span className="text-[10px] font-bold" style={{ color: pickupConfirmed ? '#2BC5D4' : 'var(--text-muted)' }}>Pickup</span>
            <div className="w-3 h-px mx-0.5" style={{ background: 'var(--border)' }} />
            <div className={`w-2 h-2 rounded-full ${destConfirmed ? 'bg-[#F59E0B]' : 'bg-[var(--border)]'}`} />
            <span className="text-[10px] font-bold" style={{ color: destConfirmed ? '#F59E0B' : 'var(--text-muted)' }}>Dest</span>
          </div>
        </div>

        {/* The Map */}
        {locationStep === 'review' ? (
          <MapLeaflet ref={mapRef} pickupLat={pickupLat} pickupLng={pickupLng}
            destLat={destLat || undefined} destLng={destLng || undefined}
            showRoute={true} interactive={true} height="100%" />
        ) : (
          <MapLeaflet
            ref={mapRef}
            // Show pickup marker while picking destination so user sees both points
            pickupLat={pickupConfirmed ? pickupLat : (locationStep === 'pickup' ? pickupLat : 0)}
            pickupLng={pickupConfirmed ? pickupLng : (locationStep === 'pickup' ? pickupLng : 0)}
            destLat={locationStep === 'destination' ? (destLat || 0) : 0}
            destLng={locationStep === 'destination' ? (destLng || 0) : 0}
            showRoute={false} interactive={true} height="100%"
            centerPinMode={true}
            pinColor={modeColor}
            onCenterChange={handleCenterChange}
            autoLocate={locationStep === 'destination' && !destConfirmed}
          />
        )}
      </div>

      {/* SIDE PANEL — all controls, NO overlap with map */}
      <div className="w-full md:w-[380px] lg:w-[400px] shrink-0 bg-white border-t md:border-t-0 md:border-l border-[var(--border-light)] overflow-y-auto">
        <div className="p-4 md:p-5 space-y-3">

          {/* Title */}
          <div>
            <h2 className="text-lg font-black" style={{ color: 'var(--text)' }}>
              {locationStep === 'pickup' && 'Lokasi Pickup'}
              {locationStep === 'destination' && 'Lokasi Kamu'}
              {locationStep === 'review' && 'Review Order'}
            </h2>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {locationStep === 'pickup' && 'Tempat pengambilan barang (toko, warung, dll)'}
              {locationStep === 'destination' && 'Alamat pengiriman — lokasi kamu'}
              {locationStep === 'review' && 'Cek detail pesanan kamu'}
            </p>
          </div>

          {/* Search with Autocomplete */}
          {locationStep !== 'review' && (
            <div>
              <AddressAutosuggest
                placeholder={locationStep === 'pickup' ? 'Cari toko, warung, alamat...' : 'Cari alamat tujuan...'}
                accentColor={modeColor}
                onSelect={selectSearchResult}
              />

              {/* GPS Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={locationStep === 'pickup' ? handleGpsPickup : handleGpsDestination}
                disabled={isGpsLoading}
                className="mt-2 w-full py-2.5 flex items-center justify-center gap-2 rounded-xl text-xs font-bold"
                style={{ background: '#E8F8FA', color: '#2BC5D4' }}
              >
                {isGpsLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-3.5 h-3.5 border-2 border-[#2BC5D4]/30 border-t-[#2BC5D4] rounded-full" />
                ) : locationStep === 'pickup' ? (
                  <><Crosshair className="w-3.5 h-3.5" /> Pusatkan ke Lokasi Saya</>
                ) : (
                  <><Crosshair className="w-3.5 h-3.5" /> Gunakan Lokasi GPS Saya</>
                )}
              </motion.button>

              {/* Saved Addresses */}
              {userProfile?.savedAddresses && userProfile.savedAddresses.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Saved Addresses</p>
                  <div className="space-y-2">
                    {userProfile.savedAddresses.map((addr) => (
                      <motion.button
                        key={addr.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          mapRef.current?.flyTo(addr.lat, addr.lng, 17);
                          if (locationStep === 'pickup') {
                            setPickupLat(addr.lat);
                            setPickupLng(addr.lng);
                            setPickupAddress(addr.address);
                            setPickupConfirmed(true);
                            toast(`Pickup: ${addr.name}`, 'success');
                            setLocationStep('destination');
                          } else {
                            setDestLat(addr.lat);
                            setDestLng(addr.lng);
                            setDestinationAddress(addr.address);
                            setDestConfirmed(true);
                            toast(`Destination: ${addr.name}`, 'success');
                            setLocationStep('review');
                          }
                        }}
                        className="w-full p-2.5 rounded-xl text-left flex items-center gap-2 bg-white border border-[var(--border-light)] hover:border-[#2BC5D4] transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#E8F8FA' }}>
                          <MapPin className="w-4 h-4" style={{ color: '#2BC5D4' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>{addr.name}</p>
                          <p className="text-[10px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>{addr.address}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-3 rounded-xl" style={{ background: '#FEF2F2' }}>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                  <p className="text-xs font-medium" style={{ color: '#EF4444' }}>{error}</p>
                </div>
                {(userProfile?.uid?.startsWith('guest-') || error.includes('Sesi login') || error.includes('login ulang')) && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/login')}
                    className="mt-2 w-full py-2 rounded-lg text-xs font-bold text-white"
                    style={{ background: '#EF4444' }}
                  >
                    {userProfile?.uid?.startsWith('guest-') ? 'Login / Buat Akun' : 'Login Ulang'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pickup Card */}
          <div className={`p-3 rounded-xl border-[1.5px] ${pickupConfirmed ? 'border-[#2BC5D4] bg-[#E8F8FA]' : 'border-[var(--border)] bg-[var(--bg)]'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: pickupConfirmed ? '#2BC5D4' : 'var(--border)' }}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Lokasi Pickup</p>
                <p className="text-xs font-semibold truncate" style={{ color: pickupConfirmed ? 'var(--text)' : 'var(--text-muted)' }}>
                  {pickupAddress || 'Not set'}
                </p>
              </div>
              {pickupConfirmed ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setPickupAddress('');
                    setPickupConfirmed(false);
                    setLocationStep('pickup');
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 hover:bg-[#2BC5D4]/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" style={{ color: '#2BC5D4' }} />
                </motion.button>
              ) : null}
            </div>
          </div>

          {/* Destination Card */}
          <div className={`p-3 rounded-xl border-[1.5px] ${destConfirmed ? 'border-[#F59E0B] bg-[#FEF3C7]' : 'border-[var(--border)] bg-[var(--bg)]'}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: destConfirmed ? '#F59E0B' : 'var(--border)' }}>
                <Navigation className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Lokasi Kamu</p>
                <p className="text-xs font-semibold truncate" style={{ color: destConfirmed ? 'var(--text)' : 'var(--text-muted)' }}>
                  {destinationAddress || 'Not set'}
                </p>
              </div>
              {destConfirmed ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDestinationAddress('');
                    setDestLat(0);
                    setDestLng(0);
                    setDestConfirmed(false);
                    setLocationStep('destination');
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 hover:bg-[#F59E0B]/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                </motion.button>
              ) : null}
            </div>
          </div>

          {/* Price / Distance / ETA Estimate */}
          {locationStep === 'review' && (
            <div className="rounded-2xl border-[1.5px] border-[#2BC5D4] overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#E8F8FA,#F0FDFF)' }}>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5" style={{ color: '#2BC5D4' }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#2BC5D4' }}>Estimasi Biaya</p>
                    <p className="text-xl font-black" style={{ color: 'var(--text)' }}>
                      {estimatedPrice != null ? `₺${estimatedPrice}` : '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {estimatedDistanceKm != null && (
                    <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                      {estimatedDistanceKm.toFixed(1)} km
                    </p>
                  )}
                  {estimatedEtaMin != null && (
                    <div className="flex flex-col items-end gap-0.5">
                      <p className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" />
                        ~{estimatedEtaMin} menit
                      </p>
                      <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {travelMode === 'walk' ? '🚶 Jalan kaki' : '🚲 Sepeda'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {cartSubtotal > 0 && deliveryFee != null && (
                <div className="px-4 pb-3 border-t border-[#2BC5D4]/20 pt-2 space-y-1">
                  <div className="flex justify-between text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    <span>Subtotal produk</span><span>₺{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    <span>Ongkir</span><span>₺{deliveryFee}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {locationStep === 'review' && (
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions..." rows={2}
              className="w-full px-3 py-2 text-xs font-medium resize-none outline-none rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] transition-all bg-white" />
          )}

          {/* Payment Method */}
          {locationStep === 'review' && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Payment Method</label>
              <div className="flex gap-2">
                <button onClick={() => setPaymentMethod('cod')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${paymentMethod === 'cod' ? 'border-[1.5px] border-[#2BC5D4] bg-[#E8F8FA] text-[#2BC5D4]' : 'border border-[var(--border-light)] bg-white text-[var(--text-muted)]'}`}>
                  Cash on Delivery
                </button>
                <button onClick={() => setPaymentMethod('online')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${paymentMethod === 'online' ? 'border-[1.5px] border-[#2BC5D4] bg-[#E8F8FA] text-[#2BC5D4]' : 'border border-[var(--border-light)] bg-white text-[var(--text-muted)]'}`}>
                  Online Payment
                </button>
              </div>

              {/* IBAN info + proof upload — shown when Online Payment is selected */}
              <AnimatePresence>
                {paymentMethod === 'online' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {/* IBAN card */}
                    <div className="rounded-2xl overflow-hidden border border-[#2BC5D4]">
                      <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#E8F8FA,#F0FDFF)' }}>
                        <Banknote className="w-4 h-4 shrink-0" style={{ color: '#2BC5D4' }} />
                        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#2BC5D4' }}>Transfer Bank — IBAN</p>
                      </div>
                      <div className="px-4 py-3 bg-white space-y-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Nomor IBAN</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black tracking-wide" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                              TR 5000 0100 9010 1756 9390 5006
                            </p>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => {
                                navigator.clipboard.writeText('TR5000010090101756939050006');
                                toast('IBAN disalin!', 'success');
                              }}
                              className="p-1.5 rounded-lg shrink-0"
                              style={{ background: '#E8F8FA' }}
                            >
                              <Copy className="w-3.5 h-3.5" style={{ color: '#2BC5D4' }} />
                            </motion.button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Atas Nama</p>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Muhammad Syachrez Arrazi</p>
                        </div>
                        <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                          Transfer sesuai nominal estimasi. Setelah transfer, upload bukti di bawah.
                        </p>
                      </div>
                    </div>

                    {/* PDF upload */}
                    <input
                      ref={proofInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setProofError('');
                        if (!file) { setPaymentProof(null); return; }
                        if (file.type !== 'application/pdf') {
                          setProofError('Hanya file PDF yang diterima.');
                          e.target.value = '';
                          return;
                        }
                        if (file.size > 3 * 1024 * 1024) {
                          setProofError('Ukuran file maksimal 3 MB.');
                          e.target.value = '';
                          return;
                        }
                        setPaymentProof(file);
                      }}
                    />

                    {paymentProof ? (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#2BC5D4] bg-[#E8F8FA]"
                      >
                        <FileCheck className="w-5 h-5 shrink-0" style={{ color: '#2BC5D4' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>{paymentProof.name}</p>
                          <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                            {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => { setPaymentProof(null); if (proofInputRef.current) proofInputRef.current.value = ''; }}
                          className="p-1 rounded-lg hover:bg-red-50"
                        >
                          <X className="w-4 h-4" style={{ color: '#EF4444' }} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => proofInputRef.current?.click()}
                        className="w-full py-3 rounded-xl border-[1.5px] border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all"
                        style={{ borderColor: proofError ? '#EF4444' : '#2BC5D4', color: proofError ? '#EF4444' : '#2BC5D4', background: proofError ? '#FEF2F2' : '#E8F8FA' }}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Bukti Transfer (PDF, maks. 3 MB)
                      </motion.button>
                    )}

                    {proofError && (
                      <p className="text-[11px] font-semibold flex items-center gap-1" style={{ color: '#EF4444' }}>
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {proofError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Schedule Toggle */}
          {locationStep === 'review' && (
            <div>
              <motion.button onClick={() => setShowScheduleInput(!showScheduleInput)} whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-3 bg-white border border-[var(--border-light)]">
                <span style={{ color: 'var(--text-secondary)' }}>Schedule for Later</span>
                <span className="text-[10px] font-bold" style={{ color: scheduledAt ? '#2BC5D4' : 'var(--text-muted)' }}>
                  {scheduledAt ? new Date(scheduledAt).toLocaleString('tr-TR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </span>
              </motion.button>
              <AnimatePresence>
                {showScheduleInput && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                    <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] outline-none bg-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Promo Code Toggle */}
          {locationStep === 'review' && (
            <div>
              <motion.button onClick={() => setShowPromoInput(!showPromoInput)} whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-3 bg-white border border-[var(--border-light)]">
                <span style={{ color: 'var(--text-secondary)' }}>Promo Code</span>
                <span className="text-[10px] font-bold" style={{ color: promoCode ? '#2BC5D4' : 'var(--text-muted)' }}>
                  {promoCode || 'Add'}
                </span>
              </motion.button>
              <AnimatePresence>
                {showPromoInput && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                    <div className="flex gap-2">
                      <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code"
                        className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] outline-none bg-white" />
                      <motion.button whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 rounded-xl text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' }}>
                        Apply
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Multi-Stop Toggle */}
          {locationStep === 'review' && (
            <div>
              <motion.button onClick={() => setShowStopsInput(!showStopsInput)} whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-between px-3 bg-white border border-[var(--border-light)]">
                <span style={{ color: 'var(--text-secondary)' }}>Add Stops</span>
                <span className="text-[10px] font-bold" style={{ color: stops.length > 0 ? '#2BC5D4' : 'var(--text-muted)' }}>
                  {stops.length > 0 ? `${stops.length} stop(s)` : 'None'}
                </span>
              </motion.button>
              <AnimatePresence>
                {showStopsInput && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-2">
                    {stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[var(--border-light)]">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: '#F5F3FF', color: '#8B5CF6' }}>{i + 1}</div>
                        <p className="text-xs font-medium flex-1 truncate" style={{ color: 'var(--text)' }}>{stop.address}</p>
                        <button onClick={() => setStops(stops.filter((_, idx) => idx !== i))}
                          className="p-1 rounded-lg hover:bg-red-50"><span className="text-red-400 text-xs font-bold">X</span></button>
                      </div>
                    ))}
                    <button onClick={() => setStops([...stops, { address: 'Stop ' + (stops.length + 1), lat: 41.6358, lng: 32.3375 }])}
                      className="w-full py-2 rounded-xl text-xs font-bold text-center border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[#2BC5D4] hover:text-[#2BC5D4] transition-all">
                      + Add Stop
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Current address preview (when in pin mode) */}
          {locationStep !== 'review' && mapCenterAddress && (
            <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border-light)]">
              <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Pin Location</p>
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{mapCenterAddress}</p>
            </div>
          )}

          {/* Detail Alamat Lengkap */}
          {locationStep !== 'review' && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <FileText className="w-3 h-3" />
                {locationStep === 'pickup' ? 'Pickup Address Detail' : 'Destination Address Detail'}
              </label>
              <textarea
                value={locationStep === 'pickup' ? pickupDetail : destDetail}
                onChange={(e) => locationStep === 'pickup' ? setPickupDetail(e.target.value) : setDestDetail(e.target.value)}
                placeholder={locationStep === 'pickup' ? 'e.g. Apartment 5B, 3rd floor, white building...' : 'e.g. Office building, near the park...'}
                rows={3}
                className="w-full px-3 py-2.5 text-xs font-medium resize-none outline-none rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] transition-all bg-white"
              />
              <p className="text-[10px] font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
                Add house number, floor, landmark, or other details to help the driver find the exact location.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <motion.button onClick={() => {
              if (locationStep === 'destination') setLocationStep('pickup');
              else if (locationStep === 'review') setLocationStep('destination');
              else { setStep(1); navigate('/'); }
            }} whileTap={{ scale: 0.95 }}
              className="px-4 py-3 text-xs font-bold rounded-xl border-[1.5px] border-[var(--border)] bg-white"
              style={{ color: 'var(--text-secondary)' }}>Back</motion.button>

            {locationStep !== 'review' ? (
              <motion.button onClick={locationStep === 'pickup' ? confirmPickupFromPin : confirmDestFromPin}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 flex items-center justify-center gap-2 rounded-xl font-bold text-xs text-white"
                style={{ background: modeColor }}>
                <Check className="w-4 h-4" />
                {locationStep === 'pickup' ? 'Confirm Pickup' : 'Confirm Destination'}
              </motion.button>
            ) : (
              <motion.button onClick={handleSubmit} disabled={isLoading || !pickupAddress || !destinationAddress}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 btn-cyan flex items-center justify-center gap-2 rounded-xl"
                style={{ opacity: !pickupAddress || !destinationAddress ? 0.4 : 1 }}>
                {isLoading ? (
                  <motion.div className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white"
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                ) : <><Sparkles className="w-4 h-4" /> Order Now</>}
              </motion.button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
