
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';

const ROLES = [
  { id: 'borrower',     label: 'Borrower',     email: 'borrower@lendflow.io',     color: '#6366f1', bg: '#eef2ff', icon: '👤' },
  { id: 'admin',        label: 'Admin',         email: 'admin@lendflow.io',        color: '#7c3aed', bg: '#f5f3ff', icon: '🔑' },
  { id: 'sales',        label: 'Sales',         email: 'sales@lendflow.io',        color: '#2563eb', bg: '#eff6ff', icon: '📊' },
  { id: 'sanction',     label: 'Sanction',      email: 'sanction@lendflow.io',     color: '#d97706', bg: '#fffbeb', icon: '🛡' },
  { id: 'disbursement', label: 'Disbursement',  email: 'disbursement@lendflow.io', color: '#059669', bg: '#ecfdf5', icon: '💸' },
  { id: 'collection',   label: 'Collection',    email: 'collection@lendflow.io',   color: '#dc2626', bg: '#fef2f2', icon: '💰' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectRole(role) {
  setSelectedRole(role);
  clearError();
  setDropOpen(false);
}

function fillDemoCredentials(role) {
  setSelectedRole(role);
  setEmail(role.email);
  setPassword('password123');
  clearError();
}

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    try {
      const user = await login(email, password);
      if (user.role === 'borrower') router.push('/dashboard');
      else router.push('/ops');
    } catch {
      // error already in store
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Left brand panel ─────────────────────────────────────────────── */}
      <div style={{
        width: '45%', background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1b2a 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '2.5rem', color: '#fff', position: 'relative', overflow: 'hidden',
      }} className="hidden-mobile">
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '100px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(139,92,246,0.12)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⊙</div>
          <span style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.3px' }}>LendFlow</span>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative' }}>
          <h1 style={{ fontSize: '2.6rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-1px' }}>
            Smart Lending,<br />Simplified.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '340px' }}>
            Apply for loans in minutes, track your applications, and manage repayments — all from one powerful platform built for modern finance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '⚡', color: '#6366f1', text: 'Lightning-fast application processing' },
              { icon: '🔒', color: '#10b981', text: 'Bank-grade security for your data' },
              { icon: '⏱',  color: '#8b5cf6', text: 'Real-time loan status tracking' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: f.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>{f.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', position: 'relative' }}>© 2026 LendFlow. All rights reserved.</p>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Welcome back</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email" value={email} required
                onChange={e => { setEmail(e.target.value); clearError(); }}
                placeholder="you@example.com"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} required
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '10px 42px 10px 14px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9ca3af' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Role Switcher */}
            <div style={{ marginBottom: '1.5rem' }} ref={dropRef}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Switch Role</label>
              <div style={{ position: 'relative' }}>
                {/* Selected display */}
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
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '12px', transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {/* Dropdown */}
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
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          borderBottom: '1px solid #f3f4f6', transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = role.bg}
                        onMouseLeave={e => e.currentTarget.style.background = selectedRole.id === role.id ? role.bg : '#fff'}
                      >
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: role.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                          {role.icon}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: role.color, margin: 0 }}>{role.label}</p>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{role.email}</p>
                        </div>
                        {selectedRole.id === role.id && <span style={{ marginLeft: 'auto', color: role.color, fontSize: '14px' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '5px' }}>
                Selecting a role auto-fills demo credentials
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              style={{
                width: '100%', background: isLoading ? '#a5b4fc' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', border: 'none', borderRadius: '10px', padding: '12px',
                fontSize: '0.95rem', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'opacity 0.15s',
                marginBottom: '1rem',
              }}>
              {isLoading && <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />}
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
            </p>
          </form>

          {/* Demo creds grid */}
          <div style={{ marginTop: '2rem', border: '1.5px solid #f3f4f6', borderRadius: '14px', padding: '1rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Demo Credentials — click any to auto-fill
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {ROLES.map(role => (
                <button key={role.id} type="button" onClick={() => fillDemoCredentials(role)}
                  style={{
                    textAlign: 'left', padding: '8px 10px', borderRadius: '10px',
                    border: `1.5px solid ${selectedRole.id === role.id ? role.color + '55' : '#f3f4f6'}`,
                    background: selectedRole.id === role.id ? role.bg : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px' }}>{role.icon}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: role.color }}>{role.label}</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.email}</p>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: '#d1d5db', textAlign: 'center', marginTop: '8px' }}>Password for all: password123</p>
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