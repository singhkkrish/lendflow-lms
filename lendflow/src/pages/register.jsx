
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';

const ROLES = [
  { id: 'borrower',     label: 'Borrower',     color: '#6366f1', bg: '#eef2ff', icon: '👤', public: true,  desc: 'Apply for loans' },
  { id: 'admin',        label: 'Admin',         color: '#7c3aed', bg: '#f5f3ff', icon: '🔑', public: false, desc: 'System administrator' },
  { id: 'sales',        label: 'Sales',         color: '#2563eb', bg: '#eff6ff', icon: '📊', public: false, desc: 'Track loan leads' },
  { id: 'sanction',     label: 'Sanction',      color: '#d97706', bg: '#fffbeb', icon: '🛡', public: false, desc: 'Approve applications' },
  { id: 'disbursement', label: 'Disbursement',  color: '#059669', bg: '#ecfdf5', icon: '💸', public: false, desc: 'Release funds' },
  { id: 'collection',   label: 'Collection',    color: '#dc2626', bg: '#fef2f2', icon: '💰', public: false, desc: 'Record payments' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [dropOpen, setDropOpen]   = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [validationErr, setValidationErr] = useState('');
  const dropRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function setField(field) {
    return (e) => { setForm(f => ({ ...f, [field]: e.target.value })); clearError(); setValidationErr(''); };
  }

  function selectRole(role) {
    setSelectedRole(role);
    setDropOpen(false);
    clearError();
    setValidationErr('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Ops roles can't register publicly
    if (!selectedRole.public) {
      setValidationErr(`${selectedRole.label} accounts are created by the admin. Please use the Login page with your provided credentials.`);
      return;
    }

    if (form.password !== form.confirm) {
      setValidationErr('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setValidationErr('Password must be at least 6 characters.');
      return;
    }

    try {
      await register(form.name, form.email, form.password, 'borrower');
      router.push('/dashboard');
    } catch {
      // error already in store
    }
  }

  const displayError = validationErr || error;
  const isOpsRole = !selectedRole.public;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Left panel ───────────────────────────────────────────────────── */}
      <div style={{
        width: '45%', background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '2.5rem', color: '#fff', position: 'relative', overflow: 'hidden',
      }} className="hidden-mobile">
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(139,92,246,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⊙</div>
          <span style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.3px' }}>LendFlow</span>
        </div>

        {/* Hero */}
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-1px' }}>
            Start your<br />lending journey.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '340px' }}>
            Join thousands of users who trust LendFlow for their lending needs. Quick approvals, transparent terms, and total control.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '✓', color: '#10b981', label: '₹5,00,000', sub: 'Maximum loan amount' },
              { icon: '⏱', color: '#6366f1', label: '24 Hours',  sub: 'Fast approval turnaround' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: f.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, fontWeight: 'bold' }}>{f.icon}</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: '700', margin: 0, fontSize: '0.95rem' }}>{f.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', margin: 0, fontSize: '0.78rem' }}>{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', position: 'relative' }}>© 2026 LendFlow. All rights reserved.</p>
      </div>

      {/* ── Right form ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fff', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Create your account</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Get started with LendFlow in minutes</p>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Full Name</label>
              <input value={form.name} onChange={setField('name')} required placeholder="Rahul Sharma"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <input type="email" value={form.email} onChange={setField('email')} required placeholder="you@example.com"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={setField('password')} required placeholder="Min. 6 characters"
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 42px 10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: '#9ca3af' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
              <input type="password" value={form.confirm} onChange={setField('confirm')} required placeholder="Re-enter your password"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Role Switcher */}
            <div style={{ marginBottom: '1.25rem' }} ref={dropRef}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Switch Role</label>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setDropOpen(!dropOpen)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: `1.5px solid ${dropOpen ? '#6366f1' : '#e5e7eb'}`, borderRadius: '10px',
                    padding: '10px 14px', background: '#fff', cursor: 'pointer', boxSizing: 'border-box',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: selectedRole.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                      {selectedRole.icon}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#111' }}>{selectedRole.label}</span>
                    {!selectedRole.public && (
                      <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>OPS</span>
                    )}
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '12px', transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {dropOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                    background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)', overflow: 'hidden',
                  }}>
                    {ROLES.map(role => (
                      <button key={role.id} type="button" onClick={() => selectRole(role)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 14px', background: selectedRole.id === role.id ? role.bg : '#fff',
                          border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = role.bg}
                        onMouseLeave={e => e.currentTarget.style.background = selectedRole.id === role.id ? role.bg : '#fff'}
                      >
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: role.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                          {role.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: role.color, margin: 0 }}>{role.label}</p>
                            {!role.public && <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '3px', fontWeight: '600' }}>OPS</span>}
                          </div>
                          <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: 0 }}>{role.desc}</p>
                        </div>
                        {selectedRole.id === role.id && <span style={{ color: role.color, fontSize: '14px' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ops role notice */}
            {isOpsRole && (
              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.825rem', color: '#92400e', fontWeight: '600', margin: '0 0 4px' }}>
                  {selectedRole.icon} {selectedRole.label} accounts are pre-created
                </p>
                <p style={{ fontSize: '0.78rem', color: '#b45309', margin: 0 }}>
                  Use the{' '}
                  <Link href="/login" style={{ color: '#6366f1', fontWeight: '700', textDecoration: 'none' }}>Login page</Link>
                  {' '}with email <strong>{selectedRole.id}@lendflow.io</strong> and password <strong>password123</strong>
                </p>
              </div>
            )}

            {/* Error */}
            {displayError && !isOpsRole && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {displayError}
              </div>
            )}

            {/* Submit — only active for borrower */}
            <button type="submit" disabled={isLoading || isOpsRole}
              style={{
                width: '100%',
                background: isOpsRole ? '#e5e7eb' : isLoading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: isOpsRole ? '#9ca3af' : '#fff',
                border: 'none', borderRadius: '10px', padding: '12px',
                fontSize: '0.95rem', fontWeight: '700',
                cursor: isOpsRole || isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: isOpsRole ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                marginBottom: '1rem', transition: 'all 0.15s',
              }}>
              {isLoading && !isOpsRole && <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
              {isOpsRole ? `Use Login for ${selectedRole.label}` : isLoading ? 'Creating account…' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </form>

          {/* Demo creds */}
          <div style={{ marginTop: '1.5rem', background: '#f9fafb', borderRadius: '14px', padding: '1rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
              Demo Credentials (use Login instead)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {ROLES.filter(r => !r.public).map(role => (
                <div key={role.id} style={{ padding: '7px 10px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: '700', color: role.color, margin: '0 0 1px' }}>{role.icon} {role.label}</p>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.id}@lendflow.io</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: '#d1d5db', textAlign: 'center', marginTop: '6px' }}>
              All passwords: password123 &nbsp;·&nbsp;{' '}
              <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Go to Login →</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </div>
  );
}