import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Sparkles, Zap, Car, FileText, Wrench, ShieldCheck } from 'lucide-react';
import type { UserRole } from '@/types';

function CheckIcon(props: any) { return <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fbLoading, setFbLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Worker fields
  const [vehicleType, setVehicleType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast('Account created with Google!', 'success');
      navigate('/');
    } catch (err: any) {
      toast(err.message || 'Google sign-in failed', 'error');
      setGoogleLoading(false);
    }
  };

  const handleFacebookRegister = async () => {
    setFbLoading(true);
    try {
      await signInWithFacebook();
      toast('Account created with Facebook!', 'success');
      navigate('/');
    } catch (err: any) {
      toast(err.message || 'Facebook sign-in failed', 'error');
      setFbLoading(false);
    }
  };

  const submit = async () => {
    if (!name || !email || !password) { toast('All fields required', 'error'); return; }
    setLoading(true);
    try {
      const extra = role === 'worker' ? {
        vehicleType,
        idNumber,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        bio,
      } : {};
      await signUp(email, password, name, phone, role, extra);
      toast('Account created!', 'success');
      if (role === 'worker') toast('Worker registration submitted for approval.', 'info');
      navigate('/');
    } catch (err: any) {
      toast(err.message || 'Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'customer' as UserRole, label: 'Customer', desc: 'Order services easily', gradient: 'linear-gradient(135deg, #4DD4E0 0%, #2BC5D4 100%)', bg: '#E8F8FA', img: '/images/c-user.png' },
    { id: 'worker' as UserRole, label: 'Worker', desc: 'Accept jobs & earn', gradient: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', bg: '#ECFDF5', img: '/images/c-worker.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="px-5 pt-5 flex items-center">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => step === 1 ? navigate(-1) : setStep(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white card-bg shadow-sm border border-[var(--border-light)] border-dark">
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text)' }} />
        </motion.button>
        <div className="flex-1 mx-4 flex gap-2">
          {role === 'worker' ? [1, 2, 3].map(s => (
            <div key={s} className="flex-1 h-1.5 rounded-full transition-all duration-500" style={{ background: s <= step ? 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' : '#CBD5E1' }} />
          )) : [1, 2].map(s => (
            <div key={s} className="flex-1 h-1.5 rounded-full transition-all duration-500" style={{ background: s <= step ? 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' : '#CBD5E1' }} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-10 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>Choose Role</h1>
              <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>How do you want to use BOH?</p>
              <div className="mt-6 space-y-3">
                {roleOptions.map((r) => (
                  <motion.button key={r.id} whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => { setRole(r.id); setStep(2); }}
                    className="w-full p-5 rounded-3xl text-left flex items-center gap-4 transition-all bg-white card-bg border-[1.5px] border-[var(--border-light)] border-dark hover:shadow-xl"
                    style={{ borderColor: role === r.id ? '#2BC5D4' : 'var(--border-light)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: r.bg }}>
                      <img src={r.img} alt={r.label} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold" style={{ color: 'var(--text)' }}>{r.label}</p>
                      <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                      style={{ background: role === r.id ? 'linear-gradient(135deg, #4DD4E0, #2BC5D4)' : 'var(--bg)', border: role === r.id ? 'none' : '1.5px solid #CBD5E1' }}>
                      {role === r.id && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>Create Account</h1>
              <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>Complete your profile</p>

              {/* Social signup — only for customers */}
              {role === 'customer' && (
                <div className="mt-5 space-y-3">
                  <motion.button onClick={handleGoogleRegister} disabled={googleLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 bg-white card-bg border-[1.5px] border-[var(--border)] border-dark hover:border-[var(--sky)] hover:shadow-md transition-all">
                    {googleLoading ? (
                      <motion.div className="w-4 h-4 border-[2.5px] border-[var(--border)] rounded-full border-t-[var(--sky)]" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                    ) : (
                      <>
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                      </>
                    )}
                  </motion.button>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>OR EMAIL</span>
                    <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-4">
                {[{ label: 'Full Name', icon: User, value: name, onChange: setName, type: 'text', placeholder: 'Your full name' }, { label: 'Email', icon: Mail, value: email, onChange: setEmail, type: 'email', placeholder: 'name@email.com' }, { label: 'Phone', icon: Phone, value: phone, onChange: setPhone, type: 'tel', placeholder: '+90 532 XXX XXXX' }].map((field) => (
                  <div key={field.label}>
                    <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#CBD5E1' }} />
                      <input type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)} placeholder={field.placeholder} className="input" />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#CBD5E1' }} />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="input" style={{ paddingRight: 48 }} />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[var(--surface-hover)] transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> : <Eye className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />}
                    </button>
                  </div>
                </div>
                <motion.button onClick={() => role === 'worker' ? setStep(3) : submit()} disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full btn-cyan flex items-center justify-center gap-2 rounded-2xl py-4" style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? (
                    <motion.div className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                  ) : role === 'worker' ? <><Sparkles className="w-4 h-4" /> Continue <ArrowRight className="w-4 h-4" /></> : <><Sparkles className="w-4 h-4" /> Sign Up <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
                <button onClick={() => setStep(1)} className="w-full text-center text-sm font-semibold py-2" style={{ color: 'var(--text-muted)' }}>Back to role selection</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Worker Details */}
          {step === 3 && role === 'worker' && (
            <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <h2 className="text-xl font-black" style={{ color: 'var(--text)' }}>Worker Details</h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Help us verify your profile</p>
              </div>
              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Vehicle Type</label>
                  <div className="relative"><Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} /><input type="text" value={vehicleType} onChange={e => setVehicleType(e.target.value)} placeholder="e.g. Motorcycle, Car, Van" className="input" /></div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>ID / TCKN Number</label>
                  <div className="relative"><FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} /><input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="Identification number" className="input" /></div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>Skills</label>
                  <div className="relative"><Wrench className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} /><input type="text" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Delivery, Cleaning, Moving" className="input" /></div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--text-secondary)' }}>About You</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about your experience..." rows={3} className="w-full px-4 py-3 text-sm font-medium resize-none outline-none rounded-2xl border-[1.5px] border-[var(--border)] focus:border-[#2BC5D4] transition-all bg-white card-bg-deep" />
                </div>
                <div className="flex items-center gap-3">
                  <motion.button onClick={() => setStep(2)} whileTap={{ scale: 0.95 }} className="flex-1 py-3 rounded-2xl text-sm font-bold border-[1.5px] border-[var(--border)] bg-white card-bg" style={{ color: 'var(--text-secondary)' }}>Back</motion.button>
                  <motion.button onClick={submit} disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="flex-[2] btn-cyan flex items-center justify-center gap-2 rounded-2xl py-3" style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? <motion.div className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /> : <><Sparkles className="w-4 h-4" /> Submit <ArrowRight className="w-4 h-4" /></>}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
