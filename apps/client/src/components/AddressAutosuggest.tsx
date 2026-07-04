import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, MapPin, ShoppingCart, Utensils, School,
  Building2, Trees, Landmark, Home, Navigation, Loader2,
  Clock, Phone, CookingPot,
} from 'lucide-react';
import { searchAddress, type SearchResult } from './MapLeaflet';

export type SuggestResult = SearchResult;

interface Props {
  placeholder?: string;
  accentColor?: string;
  onSelect: (result: SuggestResult) => void;
  autoFocus?: boolean;
}

// ── OSM type → label bahasa Indonesia ────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  restaurant: 'Restoran', cafe: 'Kafe', fast_food: 'Makanan Cepat Saji',
  bar: 'Bar', pub: 'Pub', bakery: 'Bakeri', ice_cream: 'Es Krim',
  supermarket: 'Supermarket', convenience: 'Minimarket', marketplace: 'Pasar',
  mall: 'Mall', clothes: 'Toko Pakaian', electronics: 'Elektronik',
  butcher: 'Toko Daging', greengrocer: 'Sayur & Buah', pharmacy: 'Apotek',
  school: 'Sekolah', university: 'Universitas', college: 'Perguruan Tinggi',
  kindergarten: 'TK',
  hospital: 'Rumah Sakit', clinic: 'Klinik', doctors: 'Dokter',
  dentist: 'Dokter Gigi',
  bank: 'Bank', atm: 'ATM',
  mosque: 'Masjid', church: 'Gereja', place_of_worship: 'Tempat Ibadah',
  hotel: 'Hotel', hostel: 'Hostel', guest_house: 'Penginapan',
  park: 'Taman', garden: 'Kebun', playground: 'Taman Bermain',
  fuel: 'SPBU', parking: 'Parkir',
  bus_station: 'Stasiun Bus', taxi: 'Taksi',
  post_office: 'Kantor Pos', police: 'Polisi', fire_station: 'Pemadam',
  library: 'Perpustakaan', cinema: 'Bioskop', theatre: 'Teater',
  sports_centre: 'Pusat Olahraga', gym: 'Gym', swimming_pool: 'Kolam Renang',
  residential: 'Perumahan', house: 'Rumah', apartments: 'Apartemen',
  road: 'Jalan', street: 'Jalan', path: 'Jalur',
  village: 'Desa', town: 'Kota', suburb: 'Kelurahan', neighbourhood: 'RT/RW',
};

function categoryLabel(type?: string, category?: string): string | undefined {
  if (type && TYPE_LABEL[type]) return TYPE_LABEL[type];
  if (category && TYPE_LABEL[category]) return TYPE_LABEL[category];
  return undefined;
}

// ── Place icon ────────────────────────────────────────────────────────────────

function PlaceIcon({ type, category }: { type?: string; category?: string }) {
  const t = (type ?? '').toLowerCase();
  const c = (category ?? '').toLowerCase();

  let Icon = MapPin;
  let bg = '#E8F8FA';
  let color = '#2BC5D4';

  if (['restaurant','cafe','bar','fast_food','food_court','pub','bakery','ice_cream'].some(v => t === v)) {
    Icon = Utensils; bg = '#FFF7ED'; color = '#F97316';
  } else if (c === 'shop' || ['supermarket','convenience','mall','market','store','clothes','electronics','butcher','greengrocer'].some(v => t === v)) {
    Icon = ShoppingCart; bg = '#F0FDF4'; color = '#22C55E';
  } else if (['school','university','college','kindergarten'].some(v => t === v) || c === 'education') {
    Icon = School; bg = '#EFF6FF'; color = '#3B82F6';
  } else if (['hospital','clinic','pharmacy','doctors','dentist'].some(v => t === v) || c === 'healthcare') {
    Icon = Building2; bg = '#FFF1F2'; color = '#F43F5E';
  } else if (['park','garden','forest','playground'].some(v => t === v) || c === 'leisure') {
    Icon = Trees; bg = '#F0FDF4'; color = '#16A34A';
  } else if (['mosque','church','temple','place_of_worship'].some(v => t === v)) {
    Icon = Landmark; bg = '#F5F3FF'; color = '#7C3AED';
  } else if (['house','residential','apartments','building'].some(v => t === v) || c === 'building') {
    Icon = Home; bg = '#F8FAFC'; color = '#64748B';
  } else if (c === 'highway' || ['road','street','path','footway'].some(v => t === v)) {
    Icon = Navigation; bg = '#FEFCE8'; color = '#CA8A04';
  } else if (['bank','atm'].some(v => t === v)) {
    Icon = Building2; bg = '#F0F9FF'; color = '#0EA5E9';
  }

  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
  );
}

// ── Highlight matching text ───────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent font-black" style={{ color: 'inherit' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Format opening hours (trim to short form) ─────────────────────────────────

function formatHours(raw: string): string {
  // "Mo-Fr 08:00-17:00; Sa 09:00-13:00" → "Mo-Fr 08:00-17:00"
  return raw.split(';')[0].trim().slice(0, 28);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AddressAutosuggest({
  placeholder = 'Search address...',
  accentColor = '#2BC5D4',
  onSelect,
  autoFocus,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SuggestResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [noResults, setNoResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    (listRef.current.children[activeIdx] as HTMLElement)?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim() || query.length < 2) {
      setResults([]); setIsOpen(false); setNoResults(false); return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true); setNoResults(false);
      const raw = await searchAddress(query);
      setIsLoading(false);
      setResults(raw);
      setNoResults(raw.length === 0);
      setIsOpen(true);
      setActiveIdx(-1);
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleSelect = useCallback((r: SuggestResult) => {
    setQuery(''); setResults([]); setIsOpen(false); setActiveIdx(-1);
    onSelect(r);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(results[activeIdx]); }
    else if (e.key === 'Escape') { setIsOpen(false); setActiveIdx(-1); }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative flex items-center">
        <span className="absolute left-3 pointer-events-none z-10">
          {isLoading
            ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
            : <Search className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </span>
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 text-sm font-medium rounded-xl border-[1.5px] outline-none transition-all"
          style={{ background: 'var(--bg)', borderColor: isOpen ? accentColor : 'var(--border)', color: 'var(--text)' }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
            className="absolute right-2.5 p-0.5 rounded-full hover:bg-[var(--border-light)] transition-colors"
          >
            <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (results.length > 0 || noResults) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-[var(--border-light)] z-[600] overflow-hidden"
            style={{ maxHeight: '360px', overflowY: 'auto' }}
          >
            {noResults ? (
              <div className="px-4 py-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-25" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Tidak ditemukan</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Coba kata kunci lain</p>
              </div>
            ) : (
              <ul ref={listRef} className="py-1">
                {results.map((r, i) => {
                  const label = categoryLabel(r.type, r.category);
                  const hours = r.openingHours ? formatHours(r.openingHours) : null;
                  const cuisine = r.cuisine?.split(';')[0].trim();
                  return (
                    <li key={r.placeId}>
                      <button
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => handleSelect(r)}
                        className="w-full px-3 py-2.5 flex items-start gap-3 text-left transition-colors border-b border-[var(--border-light)] last:border-0"
                        style={{ background: activeIdx === i ? 'var(--bg)' : 'transparent' }}
                      >
                        <PlaceIcon type={r.type} category={r.category} />

                        <div className="flex-1 min-w-0">
                          {/* Name + category badge */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text)' }}>
                              <Highlight text={r.name} query={query} />
                            </p>
                            {label && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}
                              >
                                {label}
                              </span>
                            )}
                          </div>

                          {/* Subtitle / address */}
                          {r.subtitle && (
                            <p className="text-[11px] font-medium mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                              {r.subtitle}
                            </p>
                          )}

                          {/* Extra info row */}
                          {(hours || r.phone || cuisine) && (
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {hours && (
                                <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: '#16A34A' }}>
                                  <Clock className="w-2.5 h-2.5" />
                                  {hours}
                                </span>
                              )}
                              {cuisine && (
                                <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: '#F97316' }}>
                                  <CookingPot className="w-2.5 h-2.5" />
                                  {cuisine}
                                </span>
                              )}
                              {r.phone && (
                                <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                  <Phone className="w-2.5 h-2.5" />
                                  {r.phone}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {activeIdx === i && (
                          <span className="text-[10px] font-bold shrink-0 mt-1" style={{ color: accentColor }}>↵</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="px-3 py-1.5 border-t border-[var(--border-light)]">
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>© OpenStreetMap · Nominatim</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
