import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, LogOut, User, Mail, Phone, Shield, Star, Award, Edit2, X, Camera, MapPin, Calendar, CheckCircle, Home, Building, MapPinned, Trash2, Plus, Moon, Sun, Clock, Gift, Copy, Check, Headphones } from 'lucide-react';
import type { WorkScheduleDay } from '@/types';

const DEFAULT_CENTER = { lat: 41.6358, lng: 32.3375 };
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const easeOut = [0.16, 1, 0.3, 1] as const;

function SavedAddressesSection() {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newType, setNewType] = useState<'home' | 'work' | 'other'>('home');

  const addresses = userProfile?.savedAddresses || [];

  const handleAdd = () => {
    if (!newName.trim() || !newAddress.trim()) return;
    const newAddr = {
      id: 'ADDR-' + Date.now(),
      name: newName.trim(),
      address: newAddress.trim(),
      lat: DEFAULT_CENTER.lat,
      lng: DEFAULT_CENTER.lng,
      type: newType,
    };
    const updated = [...addresses, newAddr];
    updateUserProfile({ savedAddresses: updated });
    setNewName('');
    setNewAddress('');
    setShowAdd(false);
    toast('Address saved!', 'success');
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    updateUserProfile({ savedAddresses: updated });
    toast('Address removed', 'info');
  };

  const typeIcons = { home: Home, work: Building, other: MapPinned };
  const typeColors = { home: '#2BC5D4', work: '#8B5CF6', other: '#F59E0B' };
  const typeBg = { home: '#E8F8FA', work: '#F5F3FF', other: '#FFFBEB' };

  return (
    <motion.div className="mt-4 bg-white card-bg rounded-3xl p-5 border border-[var(--border-light)] border-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Saved Addresses</h2>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAdd(!showAdd)}
          className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#E8F8FA' }}>
          {showAdd ? <X className="w-4 h-4" style={{ color: '#2BC5D4' }} /> : <Plus className="w-4 h-4" style={{ color: '#2BC5D4' }} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 space-y-2">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (e.g. Home, Office)"
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border-[1.5px] border-[var(--border)] border-dark focus:border-[#2BC5D4] outline-none bg-white card-bg-deep" />
            <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Full address"
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border-[1.5px] border-[var(--border)] border-dark focus:border-[#2BC5D4] outline-none bg-white card-bg-deep" />
            <div className="flex gap-2">
              {(['home', 'work', 'other'] as const).map(t => (
                <button key={t} onClick={() => setNewType(t)}
                  className="flex-1 py-2 rounded-xl text-[10px] font-bold capitalize"
                  style={{ background: newType === t ? typeBg[t] : 'var(--bg)', color: newType === t ? typeColors[t] : 'var(--text-muted)', border: newType === t ? `1.5px solid ${typeColors[t]}` : '1.5px solid var(--border)' }}>
                  {t}
                </button>
              ))}
            </div>
            <motion.button onClick={handleAdd} whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' }}>
              Save Address
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 && (
        <p className="text-xs font-medium text-center py-3" style={{ color: 'var(--text-muted)' }}>No saved addresses yet</p>
      )}
      <div className="space-y-2">
        {addresses.map((addr) => {
          const TypeIcon = typeIcons[addr.type] || MapPin;
          return (
            <motion.div key={addr.id} whileHover={{ scale: 1.01 }} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: typeBg[addr.type] }}>
                <TypeIcon className="w-4 h-4" style={{ color: typeColors[addr.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--text)' }}>{addr.name}</p>
                <p className="text-[10px] font-medium truncate" style={{ color: 'var(--text-muted)' }}>{addr.address}</p>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDelete(addr.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function WorkerScheduleSection() {
  const { userProfile, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const schedule: WorkScheduleDay[] = useMemo(() => {
    const saved = userProfile?.workSchedule;
    if (saved) return saved;
    return DAYS.map(day => ({ day, active: true, start: '09:00', end: '18:00' }));
  }, [userProfile?.workSchedule]);

  const [draft, setDraft] = useState<WorkScheduleDay[]>(schedule);

  const handleSave = () => {
    updateUserProfile({ workSchedule: draft });
    setEditing(false);
    toast('Work schedule saved!', 'success');
  };

  const toggleDay = (day: string) => {
    setDraft(prev => prev.map(d => d.day === day ? { ...d, active: !d.active } : d));
  };

  const setTime = (day: string, field: 'start' | 'end', value: string) => {
    setDraft(prev => prev.map(d => d.day === day ? { ...d, [field]: value } : d));
  };

  return (
    <motion.div className="mt-4 bg-white card-bg rounded-3xl p-5 border border-[var(--border-light)] border-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: '#2BC5D4' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Work Schedule</h2>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { if (editing) setDraft(schedule); setEditing(!editing); }}
          className="text-[11px] font-bold px-3 py-1.5 rounded-lg" style={{ background: editing ? '#FEF2F2' : '#E8F8FA', color: editing ? '#EF4444' : '#2BC5D4' }}>
          {editing ? 'Cancel' : 'Edit'}
        </motion.button>
      </div>
      <div className="space-y-2">
        {draft.map((d) => (
          <div key={d.day} className="flex items-center gap-3">
            <button
              onClick={() => editing && toggleDay(d.day)}
              className={`w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${d.active ? 'text-white' : 'text-[var(--text-muted)]'}`}
              style={{ background: d.active ? 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' : 'var(--bg)', opacity: editing ? 1 : 0.8 }}>
              {d.day.slice(0, 2)}
            </button>
            {editing ? (
              <>
                <input type="time" value={d.start} onChange={e => setTime(d.day, 'start', e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg border border-[var(--border)] outline-none focus:border-[#2BC5D4]" />
                <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>to</span>
                <input type="time" value={d.end} onChange={e => setTime(d.day, 'end', e.target.value)}
                  className="flex-1 px-2 py-1.5 text-xs font-bold rounded-lg border border-[var(--border)] outline-none focus:border-[#2BC5D4]" />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: d.active ? 'var(--text)' : 'var(--text-muted)' }}>
                  {d.active ? `${d.start} – ${d.end}` : 'Off'}
                </span>
                {d.active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F8FA] text-[#2BC5D4]">Active</span>}
              </div>
            )}
          </div>
        ))}
      </div>
      {editing && (
        <motion.button onClick={handleSave} whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' }}>
          Save Schedule
        </motion.button>
      )}
    </motion.div>
  );
}

function ReferralSection() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const code = userProfile?.referralCode || generateReferralCode(userProfile?.name || 'USER');

  const handleCopy = async () => {
    const text = `Join Boh-Hizmet with my code: ${code} and get 20% off your first order!`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast('Referral code copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Failed to copy', 'error');
    }
  };

  return (
    <motion.div className="mt-4 bg-white card-bg rounded-3xl p-5 border border-[var(--border-light)] border-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-4 h-4" style={{ color: '#8B5CF6' }} />
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Refer & Earn</h2>
      </div>
      <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Invite friends and both get 20% off!</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 p-3 rounded-xl text-center text-sm font-black tracking-wider" style={{ background: 'var(--bg)', color: 'var(--text)', border: '1.5px dashed var(--border)' }}>
          {code}
        </div>
        <motion.button onClick={handleCopy} whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: copied ? '#ECFDF5' : '#E8F8FA' }}>
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" style={{ color: '#2BC5D4' }} />}
        </motion.button>
      </div>
    </motion.div>
  );
}

function generateReferralCode(name: string) {
  const prefix = name.replace(/\s+/g, '').slice(0, 4).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}

// Compress an image file to a base64 JPEG (max 300×300, ~80% quality).
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 300;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { userProfile, signOut, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const { isDark, toggle } = useTheme();

  const [isEditing, setIsEditing]       = useState(false);
  const [name,      setName]            = useState(userProfile?.name  || '');
  const [phone,     setPhone]           = useState(userProfile?.phone || '');
  const [showLogout, setShowLogout]     = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    updateUserProfile({ name: name.trim(), phone });
    setIsEditing(false);
    toast('Profil berhasil diperbarui!', 'success');
  };

  const handleCancelEdit = () => {
    setName(userProfile?.name || '');
    setPhone(userProfile?.phone || '');
    setIsEditing(false);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Hanya file gambar yang diterima', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('Ukuran gambar maksimal 5 MB', 'error');
      return;
    }
    setPhotoUploading(true);
    try {
      const dataUrl = await compressImage(file);
      updateUserProfile({ photoURL: dataUrl });
      toast('Foto profil diperbarui!', 'success');
    } catch {
      toast('Gagal memproses gambar', 'error');
    } finally {
      setPhotoUploading(false);
      e.target.value = '';
    }
  };

  const handleLogout = () => { signOut(); navigate('/'); toast('Logged out', 'info'); };

  const avatarSrc = userProfile?.photoURL || '/images/c-user.png';
  const roleLabel = userProfile?.role === 'admin' ? 'Administrator' : userProfile?.role === 'worker' ? 'Service Worker' : 'Customer';
  const roleColor = userProfile?.role === 'admin' ? '#8B5CF6' : userProfile?.role === 'worker' ? '#2BC5D4' : '#10B981';
  const roleBg    = userProfile?.role === 'admin' ? '#F5F3FF' : userProfile?.role === 'worker' ? '#E8F8FA' : '#ECFDF5';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hidden photo input */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />

      {/* Header */}
      <div className="relative px-6 pt-6 pb-24 rounded-b-[40px] gradient-hero overflow-hidden">
        <motion.div className="absolute w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', top: '-40%', right: '-20%' }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        <div className="relative z-10 flex items-center justify-between">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full glass">
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Profile</p>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full glass">
            {isEditing ? <X className="w-5 h-5 text-white" /> : <Edit2 className="w-5 h-5 text-white" />}
          </motion.button>
        </div>

        <motion.div className="flex flex-col items-center mt-7" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          {/* Avatar — click to upload */}
          <motion.div
            className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-white/40 shadow-xl relative cursor-pointer ring-2 ring-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !photoUploading && photoInputRef.current?.click()}
          >
            <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-0.5"
              style={{ background: 'rgba(0,0,0,0.38)' }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              animate={photoUploading ? { opacity: 1 } : undefined}
            >
              {photoUploading ? (
                <motion.div className="w-6 h-6 rounded-full border-[2.5px] border-white/40 border-t-white"
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[9px] font-bold text-white/90">Ganti Foto</span>
                </>
              )}
            </motion.div>
          </motion.div>

          <h2 className="text-xl font-black text-white mt-4 tracking-tight">{userProfile?.name || 'User'}</h2>
          <motion.span className="text-[11px] font-bold px-4 py-1.5 rounded-full mt-2 glass" style={{ color: 'rgba(168,212,255,0.9)' }}>{roleLabel}</motion.span>
        </motion.div>
      </div>

      <div className="px-6 -mt-14 relative z-10 max-w-lg mx-auto pb-8">
        {/* Stats Card */}
        <motion.div className="bg-white card-bg rounded-3xl p-6 shadow-sm border border-[var(--border-light)] border-dark" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex justify-around pb-5" style={{ borderBottom: '1px solid var(--border-light)' }}>
            {[{ icon: Star, value: userProfile?.rating || 0, label: 'Rating', gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' }, { icon: Award, value: userProfile?.totalRatings || 0, label: 'Reviews', gradient: 'linear-gradient(135deg, #4DD4E0 0%, #2BC5D4 100%)' }].map((s) => (
              <motion.div key={s.label} className="text-center" whileHover={{ scale: 1.08 }} transition={{ type: 'spring' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-1" style={{ background: s.gradient }}><s.icon className="w-4 h-4 text-white" /></div>
                <span className="text-xl font-black" style={{ color: 'var(--text)' }}>{s.value}</span>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-5 space-y-4">
                {/* Photo shortcut inside card */}
                <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                  style={{ background: 'var(--bg)', border: '1.5px dashed var(--border)' }}
                  onClick={() => photoInputRef.current?.click()}>
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#2BC5D4]/30">
                    <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold" style={{ color: 'var(--text)' }}>Foto Profil</p>
                    <p className="text-[10px] font-medium" style={{ color: '#2BC5D4' }}>Ketuk untuk ganti foto · JPG/PNG maks. 5 MB</p>
                  </div>
                  <Camera className="w-4 h-4 shrink-0" style={{ color: '#2BC5D4' }} />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Nama Lengkap</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Nama kamu..."
                    className="input mt-1.5 w-full px-4 py-3 text-sm rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] outline-none bg-white"
                    style={{ color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Nomor HP</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+90 5xx xxx xx xx"
                    type="tel"
                    className="input mt-1.5 w-full px-4 py-3 text-sm rounded-xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] outline-none bg-white"
                    style={{ color: 'var(--text)' }} />
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button onClick={handleCancelEdit} whileTap={{ scale: 0.97 }}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold border-[1.5px] border-[var(--border)] bg-white"
                    style={{ color: 'var(--text-secondary)' }}>
                    Batal
                  </motion.button>
                  <motion.button onClick={handleSave} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="flex-1 btn-cyan flex items-center justify-center gap-2 rounded-2xl py-3">
                    <CheckCircle className="w-4 h-4" /> Simpan
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 space-y-1">
                {[
                  { icon: User,   label: 'Nama Lengkap', value: userProfile?.name  || '-', color: roleColor, badge: false, badgeBg: '' },
                  { icon: Mail,   label: 'Email',         value: userProfile?.email || '-', color: 'var(--text-muted)', badge: false, badgeBg: '' },
                  { icon: Phone,  label: 'Nomor HP',      value: userProfile?.phone || '-', color: 'var(--text-muted)', badge: false, badgeBg: '' },
                  { icon: Shield, label: 'Role',           value: roleLabel,                color: roleColor, badge: true,  badgeBg: roleBg },
                ].map((item, i) => (
                  <motion.div key={i} className="flex items-center gap-4 py-4"
                    style={{ borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none' }}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.badge ? item.badgeBg : 'var(--bg)' }}>
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text)' }}>{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Dark Mode Toggle */}
        <motion.div className="mt-4 flex items-center gap-4 p-4 rounded-2xl bg-white card-bg border border-[var(--border-light)] border-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.01, x: 2 }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: isDark ? '#1E3D42' : '#E8F8FA' }}>
            {isDark ? <Moon className="w-5 h-5 text-[#4DD4E0]" /> : <Sun className="w-5 h-5" style={{ color: '#2BC5D4' }} />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Dark Mode</p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{isDark ? 'Enabled' : 'Disabled'}</p>
          </div>
          <button onClick={toggle} className="w-12 h-6 rounded-full relative transition-colors" style={{ background: isDark ? 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' : '#CBD5E1' }}>
            <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" animate={{ left: isDark ? 26 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
          </button>
        </motion.div>

        {/* Live Support Quick Access */}
        <motion.div onClick={() => navigate('/support-chat')} className="mt-3 flex items-center gap-4 p-4 rounded-2xl bg-white card-bg border border-[var(--border-light)] border-dark cursor-pointer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} whileHover={{ scale: 1.01, x: 2 }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F5F3FF' }}>
            <Headphones className="w-5 h-5" style={{ color: '#8B5CF6' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Live Support</p>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Chat with our admin team</p>
          </div>
          <ChevronLeft className="w-4 h-4 rotate-180" style={{ color: 'var(--text-muted)' }} />
        </motion.div>

        {/* Info Cards */}
        <div className="mt-4 space-y-3">
          {[{ icon: MapPin, label: 'Address', value: 'Bartin, Turkey', gradient: 'linear-gradient(135deg, #4DD4E0 0%, #2BC5D4 100%)' }, { icon: Calendar, label: 'Member Since', value: new Date(userProfile?.createdAt || Date.now()).toLocaleDateString('tr-TR'), gradient: 'linear-gradient(135deg, #FB923C 0%, #F59E0B 100%)' }].map((item, i) => (
            <motion.div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white card-bg border border-[var(--border-light)] border-dark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.05 }} whileHover={{ scale: 1.01, x: 2 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.gradient }}><item.icon className="w-5 h-5 text-white" /></div>
              <div className="flex-1"><p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{item.label}</p><p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text)' }}>{item.value}</p></div>
            </motion.div>
          ))}
        </div>

        {/* Worker Schedule */}
        {userProfile?.role === 'worker' && (
          <WorkerScheduleSection />
        )}

        {/* Referral Code */}
        <ReferralSection />

        {/* Saved Addresses (Customer only) */}
        {userProfile?.role === 'customer' && (
          <SavedAddressesSection />
        )}

        {/* Logout */}
        <motion.button onClick={() => setShowLogout(true)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          className="w-full mt-5 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 bg-white border-[1.5px] border-red-100 hover:bg-red-50 hover:border-red-200 transition-all" style={{ color: '#EF4444' }}>
          <LogOut className="w-4 h-4" /> Log Out
        </motion.button>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={() => setShowLogout(false)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="w-full max-w-lg p-6 rounded-t-[32px] bg-white card-bg" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--border)' }} />
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' }}><LogOut className="w-7 h-7 text-red-500" /></div>
              </div>
              <h3 className="text-lg font-black text-center" style={{ color: 'var(--text)' }}>Log Out?</h3>
              <p className="text-sm text-center mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>You will need to sign in again</p>
              <motion.button onClick={handleLogout} whileTap={{ scale: 0.98 }} className="w-full mt-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all" style={{ background: '#FEF2F2' }}>Yes, Log Out</motion.button>
              <motion.button onClick={() => setShowLogout(false)} whileTap={{ scale: 0.98 }} className="w-full mt-2 py-4 rounded-2xl text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Cancel</motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
