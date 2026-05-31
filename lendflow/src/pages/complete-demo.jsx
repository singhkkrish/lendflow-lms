import { useState, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════
const Ic = ({ d, size = 18, sw = 2, fill = "none", stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const IcCirc = ({ cx, cy, r, ...p }) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx={cx} cy={cy} r={r}/></svg>;

const Icons = {
  eye:      (open) => open
    ? <Ic d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"]} />
    : <Ic d={["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94","M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19","M1 1l22 22"]} />,
  moon:     <Ic d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  sun:      <Ic d={["M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42","M12 17a5 5 0 000-10"]} />,
  user:     <Ic d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />,
  file:     <Ic d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />,
  slider:   <Ic d={["M4 21v-7","M4 10V3","M12 21v-9","M12 8V3","M20 21v-5","M20 12V3","M1 14h6","M9 8h6","M17 16h6"]} />,
  check:    <Ic d="M20 6L9 17l-5-5" sw={2.5} />,
  arrowR:   <Ic d="M5 12h14M12 5l7 7-7 7" />,
  arrowL:   <Ic d="M19 12H5M12 19l-7-7 7-7" />,
  upload:   <Ic d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]} />,
  x:        <Ic d="M18 6L6 18M6 6l12 12" sw={2.5} />,
  alert:    <Ic d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"]} />,
  shield:   <Ic d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z","M9 12l2 2 4-4"]} />,
  send:     <Ic d={["M22 2L11 13","M22 2L15 22l-4-9-9-4 20-7z"]} />,
  grid:     <Ic d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />,
  users:    <Ic d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 11a4 4 0 100-8 4 4 0 000 8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"]} />,
  bank:     <Ic d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]} />,
  clock:    <Ic d={["M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M12 6v6l4 2"]} />,
  dollar:   <Ic d={["M12 1v22","M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"]} />,
  zap:      <Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  logout:   <Ic d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />,
  menu:     <Ic d={["M3 12h18","M3 6h18","M3 18h18"]} />,
  search:   <Ic d={["M11 19a8 8 0 100-16 8 8 0 000 16z","M21 21l-4.35-4.35"]} />,
  plus:     <Ic d={["M12 5v14","M5 12h14"]} />,
  chevR:    <Ic d="M9 18l6-6-6-6" />,
  activity: <Ic d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  trending: <Ic d={["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"]} />,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const fmt   = n => "₹" + Number(n).toLocaleString("en-IN");
const calcSI = (p, t) => Math.round((p * 12 * t) / (365 * 100));
const genId  = () => "LF-" + Math.random().toString(36).slice(2,6).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase();

const STATUS_COLORS = {
  Pending:    { bg:"#fef3c7", text:"#92400e", dot:"#f59e0b" },
  Sanctioned: { bg:"#dbeafe", text:"#1e40af", dot:"#3b82f6" },
  Active:     { bg:"#d1fae5", text:"#065f46", dot:"#10b981" },
  Closed:     { bg:"#f3f4f6", text:"#374151", dot:"#6b7280" },
  Rejected:   { bg:"#fee2e2", text:"#991b1b", dot:"#ef4444" },
};

const ROLES_META = {
  Borrower:     { color:"#6366f1", bg:"#eef2ff" },
  Admin:        { color:"#8b5cf6", bg:"#f3e8ff" },
  Sales:        { color:"#3b82f6", bg:"#dbeafe" },
  Sanction:     { color:"#f59e0b", bg:"#fef3c7" },
  Disbursement: { color:"#10b981", bg:"#d1fae5" },
  Collection:   { color:"#ef4444", bg:"#fee2e2" },
};

const DEMO_CREDS = [
  { role:"Borrower",     email:"borrower@lendflow.io" },
  { role:"Admin",        email:"admin@lendflow.io" },
  { role:"Sales",        email:"sales@lendflow.io" },
  { role:"Sanction",     email:"sanction@lendflow.io" },
  { role:"Disbursement", email:"disbursement@lendflow.io" },
  { role:"Collection",   email:"collection@lendflow.io" },
];

const INIT_LOANS = [
  { id:"APP_001", borrower:"Karan Malhotra", email:"karan@email.com", amount:450000, tenure:200, salary:65000, pan:"QBFRT7890S", status:"Pending",    date:"28 May 2026", payments:[] },
  { id:"APP_002", borrower:"Vikram Mehta",   email:"vikram@email.com", amount:500000, tenure:270, salary:65000, pan:"XYZAB5678C", status:"Pending",    date:"26 May 2026", payments:[] },
  { id:"APP_003", borrower:"Sanya Kapoor",   email:"sanya@email.com",  amount:180000, tenure:120, salary:45000, pan:"MNOPQ2345R", status:"Rejected",   date:"27 May 2026", payments:[], reason:"Insufficient salary documentation" },
  { id:"APP_004", borrower:"Rahul Sharma",   email:"rahul@email.com",  amount:260000, tenure:190, salary:80000, pan:"ABCDE1234F", status:"Sanctioned", date:"10 May 2026", approvedOn:"11 May 2026", payments:[] },
  { id:"APP_005", borrower:"Rahul Sharma",   email:"rahul@email.com",  amount:350000, tenure:180, salary:80000, pan:"ABCDE1234F", status:"Active",      date:"1 May 2026",  disbursedOn:"3 May 2026",
    payments:[
      { utr:"UTR282e69538002", amount:50000, date:"31 May 2026" },
      { utr:"UTR282e69420982", amount:50000, date:"7 May 2026"  },
    ]},
];

const LEADS = [
  { name:"Arjun Mehta",  email:"arjun@email.com",  registered:"25 May 2026", color:"#6366f1" },
  { name:"Kavita Iyer",  email:"kavita@email.com", registered:"24 May 2026", color:"#8b5cf6" },
  { name:"Rohan Desai",  email:"rohan@email.com",  registered:"22 May 2026", color:"#3b82f6" },
  { name:"Ananya Joshi", email:"ananya@email.com", registered:"21 May 2026", color:"#10b981" },
  { name:"Dev Patel",    email:"dev@email.com",    registered:"20 May 2026", color:"#f59e0b" },
  { name:"Ishita Rao",   email:"ishita@email.com", registered:"19 May 2026", color:"#ef4444" },
  { name:"Neel Kumar",   email:"neel@email.com",   registered:"18 May 2026", color:"#6366f1" },
  { name:"Priya Nair",   email:"priya@email.com",  registered:"17 May 2026", color:"#ec4899" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function Badge({ status, small }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding: small ? "2px 8px" : "3px 10px", borderRadius:20, background:c.bg, fontSize: small ? 10 : 11, fontWeight:700, color:c.text }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot }} />{status}
    </span>
  );
}

function Avatar({ name, color="#6366f1", size=34 }) {
  const init = (name||"?").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:color+"22", color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.35, fontWeight:700, flexShrink:0 }}>
      {init}
    </div>
  );
}

function ProgressBar({ pct, color="#6366f1", dark }) {
  return (
    <div style={{ background: dark ? "#374151" : "#f1f5f9", borderRadius:99, height:6, overflow:"hidden", flex:1 }}>
      <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background: pct>=100 ? "#10b981" : color, borderRadius:99, transition:"width 0.6s ease" }} />
    </div>
  );
}

function KpiCard({ icon, label, value, sub, accent, dark }) {
  const bg  = dark ? "#1e293b" : "#fff";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  return (
    <div style={{ background:bg, border:`1px solid ${brd}`, borderRadius:14, padding:"18px 20px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:12, color:m, fontWeight:500 }}>{label}</span>
        <div style={{ width:34, height:34, borderRadius:9, background:accent+"18", display:"flex", alignItems:"center", justifyContent:"center", color:accent }}>{icon}</div>
      </div>
      <p style={{ fontSize:24, fontWeight:800, color:t, margin:0, letterSpacing:"-0.5px" }}>{value}</p>
      {sub && <p style={{ fontSize:11, color:"#10b981", margin:"4px 0 0", fontWeight:600 }}>{sub}</p>}
    </div>
  );
}

function ConfirmModal({ title, children, onConfirm, onCancel, dark, confirmLabel="Confirm", confirmColor="#10b981" }) {
  const bg  = dark ? "#1e293b" : "#fff";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:bg, border:`1px solid ${brd}`, borderRadius:16, padding:"28px", width:420, boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:t, margin:0 }}>{title}</h3>
          <button onClick={onCancel} style={{ background:"none", border:"none", cursor:"pointer", color:m }}>{Icons.x}</button>
        </div>
        {children}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20 }}>
          <button onClick={onCancel} style={{ padding:"9px 18px", background:"none", border:`1px solid ${brd}`, borderRadius:9, color:m, fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding:"9px 18px", background:confirmColor, border:"none", borderRadius:9, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
function runBRE({ dob, salary, pan, employment }) {
  const errs = [];
  if (dob) {
    const age = Math.floor((new Date() - new Date(dob)) / (365.25*24*3600*1000));
    if (age < 23 || age > 50) errs.push(`Age ${age} not between 23–50`);
  }
  if (salary && Number(salary) < 25000) errs.push("Salary must be ≥ ₹25,000/month");
  if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase())) errs.push("Invalid PAN format (e.g. ABCDE1234F)");
  if (employment === "Unemployed") errs.push("Unemployed applicants are not eligible");
  return errs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════════════════════════════
function RoleSelect({ value, onChange, dark }) {
  const [open, setOpen] = useState(false);
  const brd = dark ? "#374151" : "#e5e7eb";
  const bg  = dark ? "#1f2937" : "#fff";
  const t   = dark ? "#f9fafb" : "#111827";
  const m   = dark ? "#9ca3af" : "#6b7280";
  const ROLES = ["Borrower","Admin","Sales","Sanction","Disbursement","Collection"];
  return (
    <div style={{ position:"relative" }}>
      <div onClick={()=>setOpen(!open)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", border:`1px solid ${brd}`, borderRadius:10, cursor:"pointer", background:bg, color:t, fontSize:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {value && <div style={{ width:22, height:22, borderRadius:"50%", background:(ROLES_META[value]?.bg||"#e0e7ff"), color:(ROLES_META[value]?.color||"#6366f1"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{value[0]}</div>}
          <span>{value}</span>
        </div>
        <Ic d="M6 9l6 6 6-6" size={16} />
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:50, background:bg, border:`1px solid ${brd}`, borderRadius:10, overflow:"hidden", boxShadow:"0 10px 25px rgba(0,0,0,0.1)" }}>
          {ROLES.map(r => (
            <div key={r} onClick={()=>{onChange(r);setOpen(false);}}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", cursor:"pointer", fontSize:14, color:t, background: value===r?(dark?"#374151":"#f3f4f6"):"transparent" }}
              onMouseEnter={e=>e.currentTarget.style.background=dark?"#374151":"#f9fafb"}
              onMouseLeave={e=>e.currentTarget.style.background=value===r?(dark?"#374151":"#f3f4f6"):"transparent"}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:(ROLES_META[r]?.bg||"#e0e7ff"), color:(ROLES_META[r]?.color||"#6366f1"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{r[0]}</div>
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AuthPage({ mode, onLogin, dark, toggleDark }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", role:"Borrower" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState(mode);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name="Name required";
    if (!form.email) e.email="Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email="Invalid email";
    if (!form.password || form.password.length<6) e.password="Min 6 characters";
    if (!isLogin && form.password!==form.confirm) e.confirm="Passwords don't match";
    if (!isLogin && !agreed) e.agreed="Please accept terms";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    setTimeout(()=>{ setLoading(false); onLogin(form.role, form.email); }, 1200);
  };

  const leftBg = "#0d1117";
  const t    = dark ? "#f1f5f9" : "#0f172a";
  const m    = dark ? "#94a3b8" : "#64748b";
  const brd  = dark ? "#334155" : "#e2e8f0";
  const ib   = dark ? "#1e293b" : "#fff";

  const inp = (err) => ({ width:"100%", padding:"10px 14px", border:`1px solid ${err?"#ef4444":brd}`, borderRadius:10, fontSize:14, background:ib, color:t, outline:"none" });

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');*{box-sizing:border-box}@keyframes spin{to{transform:rotate(360deg)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}.lbtn:hover{background:#4f46e5!important;transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.35)}`}</style>

      {/* Left */}
      <div style={{ width:"45%", background:leftBg, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:48, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(99,102,241,.15)", filter:"blur(60px)" }}/>
        <div style={{ position:"absolute", bottom:-60, right:-60, width:250, height:250, borderRadius:"50%", background:"rgba(139,92,246,.12)", filter:"blur(50px)" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:10, zIndex:1 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {Icons.zap}
          </div>
          <span style={{ color:"#fff", fontWeight:700, fontSize:20 }}>LendFlow</span>
        </div>
        <div style={{ zIndex:1 }}>
          <h1 style={{ color:"#fff", fontSize:40, fontWeight:800, lineHeight:1.15, margin:"0 0 14px", letterSpacing:"-1px" }}>
            {isLogin ? <>Smart Lending,<br/><span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Simplified.</span></> : <>Start your<br/>lending journey.</>}
          </h1>
          <p style={{ color:"#94a3b8", fontSize:15, lineHeight:1.7, margin:"0 0 36px" }}>
            {isLogin ? "Apply for loans in minutes, track your applications, and manage repayments — all from one powerful platform." : "Join thousands of users who trust LendFlow. Quick approvals, transparent terms, and total control."}
          </p>
          {[
            { icon:Icons.zap,    label:"Lightning-fast application processing" },
            { icon:Icons.shield, label:"Bank-grade security for your data" },
            { icon:Icons.clock,  label:"Real-time loan status tracking" },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:"rgba(99,102,241,.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#818cf8", flexShrink:0 }}>{item.icon}</div>
              <span style={{ color:"#cbd5e1", fontSize:14 }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ zIndex:1 }}>
          {[
            { label:"₹5,00,000", sub:"Maximum loan amount", delay:"0s" },
            { label:"24 Hours",  sub:"Fast approval turnaround", delay:"1s" },
          ].map((c,i)=>(
            <div key={i} className="float" style={{ animation:`float 5s ease-in-out ${c.delay} infinite`, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:14, padding:"14px 18px", marginBottom:8 }}>
              <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{c.label}</div>
              <div style={{ color:"#64748b", fontSize:12 }}>{c.sub}</div>
            </div>
          ))}
          <p style={{ color:"#334155", fontSize:12, marginTop:16 }}>© 2026 LendFlow. All rights reserved.</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40, background: dark?"#0f172a":"#f8fafc", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:28 }}>
            <button onClick={toggleDark} style={{ background:"none", border:`1px solid ${brd}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:m, display:"flex" }}>{dark?Icons.sun:Icons.moon}</button>
          </div>
          <h2 style={{ fontSize:26, fontWeight:700, color:t, margin:"0 0 6px" }}>{isLogin?"Welcome back":"Create your account"}</h2>
          <p style={{ color:m, fontSize:14, margin:"0 0 28px" }}>{isLogin?"Sign in to your account to continue":"Get started with LendFlow in minutes"}</p>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:t, display:"block", marginBottom:6 }}>Full Name</label>
                <input style={inp(errors.name)} value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Rahul Sharma" />
                {errors.name && <p style={{ color:"#ef4444", fontSize:11, marginTop:4 }}>{errors.name}</p>}
              </div>
            )}
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:t, display:"block", marginBottom:6 }}>Email Address</label>
              <input style={inp(errors.email)} value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@example.com" type="email" />
              {errors.email && <p style={{ color:"#ef4444", fontSize:11, marginTop:4 }}>{errors.email}</p>}
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:t, display:"block", marginBottom:6 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input style={{ ...inp(errors.password), paddingRight:42 }} value={form.password} onChange={e=>set("password",e.target.value)} type={showPw?"text":"password"} placeholder={isLogin?"Enter your password":"Min. 6 characters"} />
                <button onClick={()=>setShowPw(!showPw)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:m, display:"flex" }}>{Icons.eye(showPw)}</button>
              </div>
              {errors.password && <p style={{ color:"#ef4444", fontSize:11, marginTop:4 }}>{errors.password}</p>}
            </div>
            {!isLogin && (
              <div>
                <label style={{ fontSize:13, fontWeight:500, color:t, display:"block", marginBottom:6 }}>Confirm Password</label>
                <input style={inp(errors.confirm)} value={form.confirm} onChange={e=>set("confirm",e.target.value)} type="password" placeholder="Re-enter your password" />
                {errors.confirm && <p style={{ color:"#ef4444", fontSize:11, marginTop:4 }}>{errors.confirm}</p>}
              </div>
            )}
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:t, display:"block", marginBottom:6 }}>Switch Role</label>
              <RoleSelect value={form.role} onChange={v=>set("role",v)} dark={dark} />
            </div>
            {isLogin && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:m, cursor:"pointer" }}>
                  <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} style={{ accentColor:"#6366f1" }} />Remember me
                </label>
                <a href="#" style={{ color:"#6366f1", fontSize:13, textDecoration:"none" }}>Forgot password?</a>
              </div>
            )}
            {!isLogin && (
              <label style={{ display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:m, cursor:"pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:2, accentColor:"#6366f1" }} />
                I agree to the <a href="#" style={{ color:"#6366f1", textDecoration:"none" }}>Terms of Service</a> and <a href="#" style={{ color:"#6366f1", textDecoration:"none" }}>Privacy Policy</a>
              </label>
            )}
            <button className="lbtn" onClick={handleSubmit} style={{ width:"100%", padding:13, borderRadius:11, fontSize:15, fontWeight:600, background:"#6366f1", color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
              {loading ? <><div style={{ width:18, height:18, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }}/>{isLogin?"Signing in...":"Creating account..."}</> : (isLogin?"Sign In":"Create Account")}
            </button>
            <p style={{ textAlign:"center", fontSize:14, color:m }}>
              {isLogin ? <>Don't have an account? <a onClick={()=>setAuthMode("register")} href="#" style={{ color:"#6366f1", fontWeight:600, textDecoration:"none" }}>Create one</a></> : <>Already have an account? <a onClick={()=>setAuthMode("login")} href="#" style={{ color:"#6366f1", fontWeight:600, textDecoration:"none" }}>Sign in</a></>}
            </p>
            <div style={{ border:`1px solid ${brd}`, borderRadius:12, padding:16 }}>
              <p style={{ fontSize:11, color:m, fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 10px" }}>Demo Credentials</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {DEMO_CREDS.map(c=>(
                  <div key={c.role} onClick={()=>{set("email",c.email);set("role",c.role);}}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, cursor:"pointer", transition:"background .15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=dark?"#1e293b":"#f3f4f6"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:(ROLES_META[c.role]?.bg||"#e0e7ff"), color:(ROLES_META[c.role]?.color||"#6366f1"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{c.role[0]}</div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:t }}>{c.role}</div>
                      <div style={{ fontSize:9, color:m, maxWidth:110, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.email}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:11, color:m, textAlign:"center", margin:"10px 0 0" }}>Password: <strong style={{ color:t }}>password123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BORROWER APPLY FLOW
// ═══════════════════════════════════════════════════════════════════════════════
const STEPS = [
  { label:"Personal Details", icon:Icons.user },
  { label:"Documents",        icon:Icons.file },
  { label:"Loan Config",      icon:Icons.slider },
  { label:"Review & Submit",  icon:Icons.check },
];

function StepWizard({ current, dark }) {
  const m = dark ? "#94a3b8" : "#64748b";
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
      {STEPS.map((step,i)=>{
        const done=i<current, active=i===current;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", flex:i<STEPS.length-1?1:0 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:done?"#10b981":active?"#6366f1":(dark?"#374151":"#f1f5f9"), display:"flex", alignItems:"center", justifyContent:"center", color:done||active?"#fff":m, border:active?"3px solid #c7d2fe":"none", transition:"all .3s" }}>
                {done ? Icons.check : step.icon}
              </div>
              <span style={{ fontSize:11, fontWeight:active?700:400, color:active?"#6366f1":done?"#10b981":m, whiteSpace:"nowrap" }}>{step.label}</span>
            </div>
            {i<STEPS.length-1 && <div style={{ flex:1, height:2, background:done?"#10b981":(dark?"#374151":"#e2e8f0"), margin:"0 8px 18px", transition:"all .4s" }}/>}
          </div>
        );
      })}
    </div>
  );
}

function ApplyFlow({ userEmail, dark, onBack, onSubmitDone, loans, setLoans }) {
  const [step, setStep]       = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [appId]               = useState(genId);
  const [personal, setPersonal] = useState({ name:"", pan:"", dob:"", salary:"", employment:"Salaried" });
  const [file, setFile]       = useState(null);
  const [loan, setLoan]       = useState({ amount:250000, tenure:180 });
  const [breResult, setBreResult] = useState(null);
  const [breChecking, setBreChecking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [agreed, setAgreed]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  const brd = dark ? "#334155" : "#e2e8f0";
  const ib  = dark ? "#1e293b" : "#fff";
  const cardBg = dark ? "#1e293b" : "#fff";

  const inp = (err) => ({ width:"100%", padding:"10px 14px", border:`1px solid ${err?"#ef4444":brd}`, borderRadius:10, fontSize:14, background:ib, color:t, outline:"none" });
  const lbl = (txt) => <label style={{ fontSize:13, fontWeight:500, color:t, display:"block", marginBottom:6 }}>{txt}</label>;

  const checkBRE = () => {
    setBreChecking(true);
    setTimeout(()=>{ setBreResult(runBRE(personal).length===0?"pass":runBRE(personal)); setBreChecking(false); }, 800);
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!["application/pdf","image/jpeg","image/png"].includes(f.type)) { alert("PDF/JPG/PNG only"); return; }
    if (f.size>5*1024*1024) { alert("Max 5MB"); return; }
    setUploading(true); setProgress(0);
    let p=0;
    const iv=setInterval(()=>{ p+=Math.random()*25; if(p>=100){p=100;clearInterval(iv);setUploading(false);setFile(f);} setProgress(Math.min(Math.round(p),100)); },200);
  };

  const si    = calcSI(loan.amount, loan.tenure);
  const total = loan.amount + si;
  const monthly = Math.round(total/(loan.tenure/30));
  const pct   = Math.round((si/total)*100);

  const canNext = [
    personal.name && personal.pan && personal.dob && personal.salary && personal.employment,
    !!file, true, true,
  ];

  const doSubmit = () => {
    if (!agreed) return;
    setSubmitting(true);
    setTimeout(()=>{
      setLoans(prev => [...prev, {
        id: appId, borrower: personal.name || "Borrower",
        email: userEmail, amount: loan.amount, tenure: loan.tenure,
        salary: Number(personal.salary), pan: personal.pan,
        status: "Pending", date: new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
        payments: [],
      }]);
      setSubmitting(false); setSubmitted(true);
    }, 1500);
  };

  if (submitted) return (
    <div style={{ minHeight:"100vh", background: dark?"#0f172a":"#f8fafc", display:"flex", flexDirection:"column" }}>
      <BorrowerNav userEmail={userEmail} dark={dark} onDash={onBack} />
      <div style={{ maxWidth:600, margin:"60px auto", padding:"0 24px", textAlign:"center" }}>
        <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:18, padding:40 }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 0 0 14px rgba(99,102,241,.12)", animation:"popIn .5s cubic-bezier(.36,.07,.19,.97)" }}>{Icons.check}</div>
          <h2 style={{ fontSize:26, fontWeight:800, color:t, margin:"0 0 8px" }}>Application Submitted!</h2>
          <p style={{ color:m, fontSize:14, margin:"0 0 28px" }}>Your application has been submitted successfully. Our team will review it shortly.</p>
          <div style={{ background: dark?"#0f172a":"#f8fafc", border:`1px solid ${brd}`, borderRadius:14, padding:"20px 28px", marginBottom:24 }}>
            <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 6px" }}>Application ID</p>
            <p style={{ fontSize:20, fontWeight:800, color:t, margin:"0 0 14px" }}>{appId}</p>
            <Badge status="Pending" />
          </div>
          <div style={{ textAlign:"left", background: dark?"#0f172a":"#f8fafc", border:`1px solid ${brd}`, borderRadius:12, padding:"16px 20px", marginBottom:24 }}>
            <p style={{ fontSize:13, fontWeight:700, color:t, margin:"0 0 12px" }}>What happens next?</p>
            {["Your application will be reviewed by our sanction team","If approved, funds will be disbursed to your account","Track your application status from your dashboard"].map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"#6366f1", color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
                <span style={{ fontSize:12, color:m }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
            <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 22px", background:"#6366f1", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>{Icons.grid}Go to Dashboard</button>
            <button onClick={()=>setSubmitted(false)} style={{ padding:"10px 22px", background:"none", border:`1px solid ${brd}`, color:t, borderRadius:10, fontSize:14, cursor:"pointer" }}>New Application</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes popIn{0%{transform:scale(0)}70%{transform:scale(1.1)}100%{transform:scale(1)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background: dark?"#0f172a":"#f8fafc", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}input[type=range]{-webkit-appearance:none;height:4px;border-radius:99px}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#6366f1;cursor:pointer;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.15)}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <BorrowerNav userEmail={userEmail} dark={dark} onDash={onBack} />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"36px 24px" }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:t, margin:"0 0 4px" }}>New Loan Application</h1>
        <p style={{ color:m, fontSize:14, margin:"0 0 28px" }}>Complete all steps to submit your application</p>
        <StepWizard current={step} dark={dark} />

        <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:18, padding:32, minHeight:380, animation:"fadeUp .3s ease" }}>

          {/* STEP 0 */}
          {step===0 && (
            <div>
              <h3 style={{ fontSize:18, fontWeight:700, color:t, margin:"0 0 4px" }}>Personal Details</h3>
              <p style={{ color:m, fontSize:14, margin:"0 0 24px" }}>Fill in your information to check loan eligibility</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>{lbl("Full Name")}<input style={inp()} value={personal.name} onChange={e=>setPersonal({...personal,name:e.target.value})} placeholder="Rahul Sharma"/></div>
                <div>{lbl("PAN Number")}<input style={inp()} value={personal.pan} onChange={e=>setPersonal({...personal,pan:e.target.value.toUpperCase()})} placeholder="ABCDE1234F" maxLength={10}/>
                  {personal.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(personal.pan) && <p style={{ color:"#f59e0b", fontSize:11, marginTop:4 }}>Format: ABCDE1234F</p>}
                </div>
                <div>{lbl("Date of Birth")}
                  <input type="date" style={inp()} value={personal.dob} onChange={e=>setPersonal({...personal,dob:e.target.value})}/>
                  {personal.dob && (()=>{ const age=Math.floor((new Date()-new Date(personal.dob))/(365.25*24*3600*1000)); return <p style={{ fontSize:11, marginTop:4, color:age>=23&&age<=50?"#10b981":"#ef4444" }}>Age: {age} {age>=23&&age<=50?"✓":"(must be 23–50)"}</p>; })()}
                </div>
                <div>{lbl("Monthly Salary (₹)")}
                  <div style={{ position:"relative" }}>
                    <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:m }}>₹</span>
                    <input type="number" style={{ ...inp(), paddingLeft:28 }} value={personal.salary} onChange={e=>setPersonal({...personal,salary:e.target.value})} placeholder="45000"/>
                  </div>
                  {personal.salary && Number(personal.salary)<25000 && <p style={{ color:"#ef4444", fontSize:11, marginTop:4 }}>Minimum ₹25,000 required</p>}
                </div>
              </div>
              <div style={{ marginTop:18 }}>
                {lbl("Employment Mode")}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                  {["Salaried","Self Employed","Unemployed"].map(opt=>{
                    const icons={"Salaried":"💼","Self Employed":"🏢","Unemployed":"👤"};
                    const active=personal.employment===opt;
                    return (
                      <div key={opt} onClick={()=>setPersonal({...personal,employment:opt})}
                        style={{ border:`2px solid ${active?"#6366f1":brd}`, borderRadius:12, padding:"14px 10px", textAlign:"center", cursor:"pointer", background:active?(dark?"rgba(99,102,241,.15)":"#eef2ff"):(dark?"#1e293b":"#fff"), transition:"all .2s" }}>
                        <div style={{ fontSize:22, marginBottom:4 }}>{icons[opt]}</div>
                        <div style={{ fontSize:13, fontWeight:500, color:active?"#6366f1":t }}>{opt}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ marginTop:20, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                <button onClick={checkBRE} disabled={breChecking} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", border:`1px solid ${brd}`, borderRadius:9, background:"none", color:t, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  {breChecking ? <div style={{ width:14, height:14, border:"2px solid #6366f1", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .6s linear infinite" }}/> : Icons.shield}
                  Check Eligibility
                </button>
                {breResult==="pass" && <div style={{ display:"flex", alignItems:"center", gap:8, background:"#d1fae5", border:"1px solid #6ee7b7", borderRadius:9, padding:"7px 14px" }}>{Icons.check}<span style={{ fontSize:13, fontWeight:600, color:"#065f46" }}>Eligibility Verified ✓</span></div>}
                {Array.isArray(breResult) && (
                  <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:9, padding:"10px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>{Icons.alert}<span style={{ fontSize:13, fontWeight:600, color:"#991b1b" }}>Not Eligible</span></div>
                    {breResult.map((e,i)=><p key={i} style={{ fontSize:12, color:"#b91c1c", margin:"2px 0 0" }}>• {e}</p>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step===1 && (
            <div>
              <h3 style={{ fontSize:18, fontWeight:700, color:t, margin:"0 0 4px" }}>Upload Salary Slip</h3>
              <p style={{ color:m, fontSize:14, margin:"0 0 24px" }}>Upload your latest salary slip for verification</p>
              {!file && !uploading && (
                <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)}
                  onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
                  onClick={()=>fileRef.current?.click()}
                  style={{ border:`2px dashed ${dragging?"#6366f1":brd}`, borderRadius:16, padding:"56px 24px", textAlign:"center", cursor:"pointer", background:dragging?(dark?"rgba(99,102,241,.1)":"#eef2ff"):(dark?"#1e293b":"#fafafa"), transition:"all .2s" }}>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:dark?"#374151":"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", color:"#6366f1" }}>{Icons.upload}</div>
                  <p style={{ fontSize:15, fontWeight:600, color:t, margin:"0 0 6px" }}>Drag & drop your salary slip here</p>
                  <p style={{ fontSize:13, color:m, margin:"0 0 16px" }}>or click to browse</p>
                  <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
                    {["PDF","JPG","PNG"].map(f=><span key={f} style={{ padding:"3px 10px", background:dark?"#374151":"#f1f5f9", borderRadius:6, fontSize:11, fontWeight:600, color:m }}>📄 {f}</span>)}
                  </div>
                  <p style={{ fontSize:11, color:m, marginTop:8 }}>Maximum file size: 5 MB</p>
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
                </div>
              )}
              {uploading && (
                <div style={{ border:`1px solid ${brd}`, borderRadius:16, padding:"32px 24px", textAlign:"center", background:cardBg }}>
                  <p style={{ color:t, fontWeight:600, marginBottom:14 }}>Uploading...</p>
                  <div style={{ background:dark?"#374151":"#f1f5f9", borderRadius:99, height:8, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:99, transition:"width .2s" }}/>
                  </div>
                  <p style={{ color:m, fontSize:13, marginTop:8 }}>{progress}%</p>
                </div>
              )}
              {file && (
                <div style={{ border:"1px solid #6ee7b7", borderRadius:16, padding:"18px 22px", background:dark?"rgba(16,185,129,.08)":"#f0fdf4" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:44, height:52, borderRadius:8, background:dark?"#374151":"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                        <span style={{ fontSize:16 }}>📄</span>
                        <span style={{ fontSize:9, fontWeight:700, color:"#6366f1" }}>{file.name.split(".").pop().toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ fontWeight:600, color:t, margin:0, fontSize:14 }}>{file.name}</p>
                        <p style={{ color:m, fontSize:11, margin:"2px 0 0" }}>Salary Slip · {(file.size/1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, background:"#d1fae5", borderRadius:8, padding:"5px 10px" }}>{Icons.check}<span style={{ fontSize:11, fontWeight:600, color:"#065f46" }}>Uploaded</span></div>
                      <button onClick={()=>setFile(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"#ef4444", display:"flex" }}>{Icons.x}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step===2 && (
            <div>
              <h3 style={{ fontSize:18, fontWeight:700, color:t, margin:"0 0 4px" }}>Configure Your Loan</h3>
              <p style={{ color:m, fontSize:14, margin:"0 0 24px" }}>Adjust the sliders to choose your loan amount and tenure</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                <div>
                  {[{
                    label:"Loan Amount", val:loan.amount, min:50000, max:500000, step:10000,
                    disp:fmt(loan.amount), marks:[50000,100000,200000,300000,500000].map(v=>({v,l:v>=100000?`₹${v/100000}L`:`₹${v/1000}K`})),
                    onChange:v=>setLoan({...loan,amount:v})
                  },{
                    label:"Tenure", val:loan.tenure, min:30, max:365, step:1,
                    disp:`${loan.tenure} days`, marks:[{v:30,l:"1Mo"},{v:90,l:"3Mo"},{v:180,l:"6Mo"},{v:270,l:"9Mo"},{v:365,l:"1Yr"}],
                    onChange:v=>setLoan({...loan,tenure:v})
                  }].map(s=>(
                    <div key={s.label} style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"18px", marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                        <span style={{ fontSize:13, fontWeight:500, color:t }}>{s.label}</span>
                        <span style={{ fontSize:17, fontWeight:800, color:"#6366f1" }}>{s.disp}</span>
                      </div>
                      <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={e=>s.onChange(Number(e.target.value))} style={{ width:"100%", accentColor:"#6366f1", cursor:"pointer" }}/>
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                        {s.marks.map(mk=><span key={mk.v} onClick={()=>s.onChange(mk.v)} style={{ fontSize:10, color:s.val===mk.v?"#6366f1":m, fontWeight:s.val===mk.v?700:400, cursor:"pointer" }}>{mk.l}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"18px" }}>
                  <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 16px" }}>Loan Summary</p>
                  {[["Principal",fmt(loan.amount),false],["Interest (12% p.a.)",`+ ${fmt(si)}`,true],["Tenure",`${loan.tenure} days`,false]].map(([label,value,green])=>(
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${brd}` }}>
                      <span style={{ fontSize:13, color:m }}>{label}</span>
                      <span style={{ fontSize:13, fontWeight:600, color:green?"#10b981":t }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0 10px" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:t }}>Total Repayment</span>
                    <span style={{ fontSize:20, fontWeight:800, color:"#6366f1" }}>{fmt(total)}</span>
                  </div>
                  <div style={{ background:dark?"#374151":"#f8fafc", borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontSize:12, color:m }}>Approx. Monthly</span>
                      <span style={{ fontSize:14, fontWeight:700, color:"#8b5cf6" }}>{fmt(monthly)}</span>
                    </div>
                  </div>
                  <div style={{ height:8, borderRadius:99, overflow:"hidden", display:"flex" }}>
                    <div style={{ width:`${100-pct}%`, background:"#6366f1" }}/>
                    <div style={{ width:`${pct}%`, background:"#10b981" }}/>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:8, height:8, borderRadius:2, background:"#6366f1" }}/><span style={{ fontSize:11, color:m }}>Principal</span></div>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:8, height:8, borderRadius:2, background:"#10b981" }}/><span style={{ fontSize:11, color:m }}>Interest</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step===3 && (
            <div>
              <h3 style={{ fontSize:18, fontWeight:700, color:t, margin:"0 0 4px" }}>Review & Submit</h3>
              <p style={{ color:m, fontSize:14, margin:"0 0 24px" }}>Verify all details before submitting your application</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
                <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>{Icons.user}<span style={{ fontSize:13, fontWeight:700, color:t }}>Personal Information</span></div>
                  {[["Full Name",personal.name],["PAN",personal.pan],["Date of Birth",personal.dob?new Date(personal.dob).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—"],["Monthly Salary",personal.salary?fmt(personal.salary):"—"],["Employment",personal.employment]].map(([label,value])=>(
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${brd}` }}>
                      <span style={{ fontSize:12, color:m }}>{label}</span>
                      <span style={{ fontSize:12, fontWeight:600, color:t }}>{value||"—"}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:12, background:"#d1fae5", border:"1px solid #6ee7b7", borderRadius:8, padding:"6px 12px", display:"flex", alignItems:"center", gap:6 }}>{Icons.check}<span style={{ fontSize:11, fontWeight:600, color:"#065f46" }}>Eligibility Verified</span></div>
                </div>
                <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:18 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>{Icons.file}<span style={{ fontSize:13, fontWeight:700, color:t }}>Document Uploaded</span></div>
                  {file ? (
                    <div style={{ display:"flex", alignItems:"center", gap:10, background:dark?"#374151":"#f8fafc", borderRadius:10, padding:12 }}>
                      <div style={{ width:38, height:44, borderRadius:7, background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:16 }}>📄</span></div>
                      <div><p style={{ fontWeight:600, color:t, margin:0, fontSize:13 }}>{file.name}</p><p style={{ color:m, fontSize:11, margin:"2px 0 0" }}>Salary Slip</p></div>
                    </div>
                  ) : <p style={{ color:m, fontSize:13 }}>No document uploaded</p>}
                </div>
              </div>
              <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:18, marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>{Icons.slider}<span style={{ fontSize:13, fontWeight:700, color:t }}>Loan Configuration</span></div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                  {[["Loan Amount",fmt(loan.amount),false],["Tenure",`${loan.tenure} days`,false],["Interest",fmt(si),false],["Total Repayment",fmt(total),true]].map(([label,value,hi])=>(
                    <div key={label} style={{ background:hi?(dark?"rgba(99,102,241,.15)":"#eef2ff"):(dark?"#374151":"#f8fafc"), borderRadius:10, padding:"12px 14px" }}>
                      <p style={{ fontSize:9, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 5px" }}>{label}</p>
                      <p style={{ fontSize:15, fontWeight:800, color:hi?"#6366f1":t, margin:0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", fontSize:13, color:m, lineHeight:1.6 }}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} style={{ marginTop:2, accentColor:"#6366f1", flexShrink:0 }}/>
                I confirm that all information provided is accurate and I agree to the loan terms and conditions.
              </label>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:16 }}>
                <button onClick={doSubmit} disabled={!agreed||submitting}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 24px", background:agreed?"#6366f1":(dark?"#374151":"#e2e8f0"), color:agreed?"#fff":m, border:"none", borderRadius:11, fontSize:14, fontWeight:600, cursor:agreed?"pointer":"default", transition:"all .2s" }}>
                  {submitting?<div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .6s linear infinite" }}/>:Icons.send}
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </div>

        {step<3 && (
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:20 }}>
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", background:"none", border:`1px solid ${brd}`, borderRadius:10, color:step===0?m:t, fontSize:14, cursor:step===0?"default":"pointer", opacity:step===0?.4:1 }}>
              {Icons.arrowL}Back
            </button>
            <button onClick={()=>setStep(s=>Math.min(3,s+1))} disabled={!canNext[step]}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 22px", background:canNext[step]?"#6366f1":(dark?"#374151":"#e2e8f0"), color:canNext[step]?"#fff":m, border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:canNext[step]?"pointer":"default", transition:"all .2s" }}>
              {step===0?"Continue to Documents":step===1?"Continue to Loan Config":"Review Application"}{Icons.arrowR}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BORROWER NAV
// ═══════════════════════════════════════════════════════════════════════════════
function BorrowerNav({ userEmail, dark, toggleDark, onDash, onApply, onLogout }) {
  const bg  = dark ? "#0f172a" : "#fff";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  return (
    <nav style={{ background:bg, borderBottom:`1px solid ${brd}`, padding:"0 28px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>{Icons.zap}</div>
        <span style={{ fontWeight:700, fontSize:16, color:t }}>LendFlow</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:12, color:m }}>{userEmail}</span>
        {onApply && <button onClick={onApply} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>{Icons.plus}+ New Application</button>}
        {toggleDark && <button onClick={toggleDark} style={{ background:"none", border:`1px solid ${brd}`, borderRadius:7, padding:"5px 8px", cursor:"pointer", color:m, display:"flex" }}>{dark?Icons.sun:Icons.moon}</button>}
        {onDash && <button onClick={onDash} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", border:`1px solid ${brd}`, borderRadius:8, color:m, fontSize:12, background:"none", cursor:"pointer" }}>{Icons.grid}Dashboard</button>}
        {onLogout && <button onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#ef4444", fontSize:12, cursor:"pointer" }}>{Icons.logout}Logout</button>}
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BORROWER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function BorrowerDashboard({ loans, dark, toggleDark, userEmail, onApply, onLogout }) {
  const [activeTab, setActiveTab] = useState("All");
  const [drawer, setDrawer]       = useState(null);
  const bg  = dark ? "#0f172a" : "#f8fafc";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  const cardBg = dark ? "#1e293b" : "#fff";

  const myLoans = loans.filter(l => l.email === userEmail);
  const totalBorrowed = myLoans.reduce((s,l)=>s+l.amount, 0);
  const totalRepaid   = myLoans.reduce((s,l)=>s+l.payments.reduce((a,p)=>a+p.amount,0), 0);
  const activeCount   = myLoans.filter(l=>l.status==="Active").length;

  const TABS = ["All","Pending","Sanctioned","Active","Closed","Rejected"];
  const filtered = activeTab==="All" ? myLoans : myLoans.filter(l=>l.status===activeTab);
  const drawerLoan = drawer ? myLoans.find(l=>l.id===drawer) : null;

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.tab-btn:hover{background:rgba(99,102,241,.08)!important}`}</style>
      <BorrowerNav userEmail={userEmail} dark={dark} toggleDark={toggleDark} onApply={onApply} onLogout={onLogout}/>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:t, margin:"0 0 4px", letterSpacing:"-0.5px" }}>Welcome back, {userEmail.split("@")[0]}</h1>
          <p style={{ color:m, fontSize:14 }}>Track your loan applications and repayments</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          <KpiCard icon={Icons.file}    label="Total Loans"    value={myLoans.length}   dark={dark} accent="#6366f1" />
          <KpiCard icon={Icons.activity} label="Active Loans"  value={activeCount}      dark={dark} accent="#10b981" />
          <KpiCard icon={Icons.dollar}  label="Total Borrowed" value={fmt(totalBorrowed)} dark={dark} accent="#8b5cf6" />
          <KpiCard icon={Icons.check}   label="Total Repaid"   value={fmt(totalRepaid)} dark={dark} accent="#f59e0b" />
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:2, borderBottom:`1px solid ${brd}`, marginBottom:18 }}>
          {TABS.map(tab=>{
            const active=activeTab===tab;
            const count=tab==="All"?myLoans.length:myLoans.filter(l=>l.status===tab).length;
            return (
              <button key={tab} className="tab-btn" onClick={()=>setActiveTab(tab)}
                style={{ padding:"8px 14px", fontSize:13, fontWeight:active?700:400, color:active?"#6366f1":m, background:"none", border:"none", cursor:"pointer", borderBottom:active?"2px solid #6366f1":"2px solid transparent", marginBottom:-1, borderRadius:"6px 6px 0 0", display:"flex", alignItems:"center", gap:5 }}>
                {tab}{count>0&&<span style={{ fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:10, background:active?"#6366f1":(dark?"#374151":"#f1f5f9"), color:active?"#fff":m }}>{count}</span>}
              </button>
            );
          })}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12, animation:"fadeUp .3s ease" }}>
          {filtered.length===0 ? (
            <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:16, padding:"56px 24px", textAlign:"center" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:dark?"#374151":"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", color:m }}>{Icons.file}</div>
              <p style={{ fontSize:16, fontWeight:700, color:t, margin:"0 0 6px" }}>No applications yet</p>
              <p style={{ fontSize:13, color:m, margin:"0 0 18px" }}>Start your first loan application to see it here</p>
              <button onClick={onApply} style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"9px 20px", background:"#6366f1", color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer" }}>{Icons.plus}Apply for a Loan</button>
            </div>
          ) : filtered.map(loan=>{
            const si=calcSI(loan.amount,loan.tenure);
            const total=loan.amount+si;
            const paid=loan.payments.reduce((s,p)=>s+p.amount,0);
            const pct=total>0?Math.round((paid/total)*100):0;
            const hasPay=loan.status==="Active"||loan.status==="Closed";
            return (
              <div key={loan.id} style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:16, overflow:"hidden" }}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.07)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                <div style={{ padding:"16px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:9, background:dark?"#374151":"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", color:"#6366f1" }}>{Icons.file}</div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:700, color:t, margin:0 }}>{loan.id}</p>
                        <p style={{ fontSize:11, color:m, margin:0 }}>Applied {loan.date}</p>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Badge status={loan.status}/>
                      <button onClick={()=>setDrawer(drawer===loan.id?null:loan.id)} style={{ background:"none", border:"none", cursor:"pointer", color:m }}>{Icons.chevR}</button>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                    {[
                      ["Loan Amount", fmt(loan.amount), null],
                      ["Total Repayment", fmt(total), null],
                      ...(hasPay?[["Paid",fmt(paid),"#10b981"],["Outstanding",fmt(total-paid),total-paid>0?"#ef4444":"#10b981"]]:[["Interest (12%)",fmt(si),null],["Tenure",`${loan.tenure} days`,null]]),
                    ].map(([label,value,color])=>(
                      <div key={label} style={{ background:dark?"#0f172a":"#f8fafc", borderRadius:9, padding:"9px 12px" }}>
                        <p style={{ fontSize:10, color:m, fontWeight:500, textTransform:"uppercase", margin:"0 0 3px" }}>{label}</p>
                        <p style={{ fontSize:13, fontWeight:800, color:color||t, margin:0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  {hasPay && (
                    <div style={{ marginTop:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:11, color:m }}>Repayment Progress</span>
                        <span style={{ fontSize:11, fontWeight:700, color:pct>=100?"#10b981":"#6366f1" }}>{pct}%</span>
                      </div>
                      <ProgressBar pct={pct} dark={dark}/>
                    </div>
                  )}
                </div>
                {hasPay && loan.payments.length>0 && (
                  <div style={{ borderTop:`1px solid ${brd}`, padding:"12px 20px" }}>
                    <p style={{ fontSize:10, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 8px" }}>Recent Payments</p>
                    {loan.payments.slice(0,2).map((pay,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                        <span style={{ fontSize:11, color:m, fontFamily:"monospace" }}>{pay.utr}</span>
                        <div style={{ display:"flex", gap:14 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:"#10b981" }}>{fmt(pay.amount)}</span>
                          <span style={{ fontSize:11, color:m }}>{pay.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {drawerLoan && (
        <div style={{ position:"fixed", inset:0, zIndex:200, display:"flex" }}>
          <div onClick={()=>setDrawer(null)} style={{ flex:1, background:"rgba(0,0,0,.4)" }}/>
          <div style={{ width:400, background:cardBg, borderLeft:`1px solid ${brd}`, overflowY:"auto", padding:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div><p style={{ fontSize:15, fontWeight:800, color:t, margin:0 }}>{drawerLoan.id}</p><p style={{ fontSize:11, color:m, margin:0 }}>Applied {drawerLoan.date}</p></div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><Badge status={drawerLoan.status}/><button onClick={()=>setDrawer(null)} style={{ background:"none", border:`1px solid ${brd}`, borderRadius:7, padding:"5px 8px", cursor:"pointer", color:m }}>✕</button></div>
            </div>
            {/* Timeline */}
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", margin:"0 0 16px" }}>Status Timeline</p>
              <div style={{ display:"flex", alignItems:"center" }}>
                {["Applied","Sanctioned","Disbursed","Closed"].map((stage,i)=>{
                  const cur={"Pending":0,"Sanctioned":1,"Active":2,"Closed":3}[drawerLoan.status]??0;
                  const done=i<=cur, active=i===cur;
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", flex:i<3?1:0 }}>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", background:done?(active?"#6366f1":"#10b981"):(dark?"#374151":"#f1f5f9"), display:"flex", alignItems:"center", justifyContent:"center", border:active?"3px solid #c7d2fe":"none", color:done?"#fff":m }}>
                          {done&&!active?<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>:<span style={{ fontSize:10, fontWeight:700 }}>{i+1}</span>}
                        </div>
                        <span style={{ fontSize:9, fontWeight:active?700:400, color:active?"#6366f1":done?"#10b981":m, whiteSpace:"nowrap" }}>{stage}</span>
                      </div>
                      {i<3&&<div style={{ flex:1, height:2, background:i<cur?"#10b981":(dark?"#374151":"#e2e8f0"), margin:"0 4px 16px" }}/>}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Details */}
            <div style={{ borderTop:`1px solid ${brd}`, paddingTop:16, marginBottom:16 }}>
              <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", margin:"0 0 12px" }}>Loan Details</p>
              {[["Loan Amount",fmt(drawerLoan.amount)],["Interest (12% p.a.)",fmt(calcSI(drawerLoan.amount,drawerLoan.tenure))],["Tenure",`${drawerLoan.tenure} days`],["Total Repayment",fmt(drawerLoan.amount+calcSI(drawerLoan.amount,drawerLoan.tenure))]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${brd}` }}>
                  <span style={{ fontSize:12, color:m }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:t }}>{v}</span>
                </div>
              ))}
            </div>
            {drawerLoan.payments.length>0 && (
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", margin:"0 0 12px" }}>Payment History</p>
                {drawerLoan.payments.map((pay,i)=>(
                  <div key={i} style={{ background:dark?"#0f172a":"#f8fafc", borderRadius:10, padding:"10px 12px", display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div><p style={{ fontSize:10, fontFamily:"monospace", color:m, margin:0 }}>{pay.utr}</p><p style={{ fontSize:10, color:m, margin:0 }}>{pay.date}</p></div>
                    <span style={{ fontSize:13, fontWeight:800, color:"#10b981" }}>{fmt(pay.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPERATIONS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const OPS_NAV = [
  { id:"dashboard",    label:"Dashboard",    icon:Icons.grid,   roles:["Admin"] },
  { id:"sales",        label:"Sales",        icon:Icons.users,  roles:["Admin","Sales"] },
  { id:"sanction",     label:"Sanction",     icon:Icons.shield, roles:["Admin","Sanction"] },
  { id:"disbursement", label:"Disbursement", icon:Icons.bank,   roles:["Admin","Disbursement"] },
  { id:"collection",   label:"Collection",   icon:Icons.clock,  roles:["Admin","Collection"] },
];

function OpsSidebar({ module, setModule, collapsed, role, dark }) {
  const bg  = "#0d1117";
  const allowed = OPS_NAV.filter(n=>n.roles.includes(role));
  return (
    <div style={{ width:collapsed?58:210, background:bg, display:"flex", flexDirection:"column", flexShrink:0, transition:"width .25s", height:"100vh", position:"sticky", top:0 }}>
      <div style={{ height:56, display:"flex", alignItems:"center", padding:collapsed?"0 15px":"0 18px", borderBottom:"1px solid rgba(255,255,255,.06)" }}>
        <div style={{ width:26, height:26, borderRadius:7, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{Icons.zap}</div>
        {!collapsed && <span style={{ color:"#fff", fontWeight:700, fontSize:15, marginLeft:9 }}>LendFlow</span>}
      </div>
      <nav style={{ flex:1, padding:"10px 6px" }}>
        {allowed.map(item=>{
          const active=module===item.id;
          return (
            <button key={item.id} onClick={()=>setModule(item.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:collapsed?"10px":"9px 12px", justifyContent:collapsed?"center":"flex-start", borderRadius:9, marginBottom:2, background:active?"rgba(99,102,241,.2)":"transparent", border:"none", cursor:"pointer", color:active?"#818cf8":"#94a3b8", transition:"all .15s" }}
              onMouseEnter={e=>!active&&(e.currentTarget.style.background="rgba(255,255,255,.06)")}
              onMouseLeave={e=>!active&&(e.currentTarget.style.background="transparent")}>
              {item.icon}
              {!collapsed&&<span style={{ fontSize:13, fontWeight:active?700:400 }}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding:"10px 6px", borderTop:"1px solid rgba(255,255,255,.06)" }}>
        <button style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:collapsed?"10px":"9px 12px", justifyContent:collapsed?"center":"flex-start", borderRadius:9, background:"transparent", border:"none", cursor:"pointer", color:"#ef4444" }}>
          {Icons.logout}{!collapsed&&<span style={{ fontSize:13 }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}

function OpsTopBar({ role, onToggle, dark, toggleDark, onLogout }) {
  const bg  = dark ? "#0f172a" : "#fff";
  const brd = dark ? "#334155" : "#e2e8f0";
  const m   = dark ? "#94a3b8" : "#64748b";
  const meta = ROLES_META[role]||{color:"#6366f1",bg:"#eef2ff"};
  return (
    <div style={{ height:56, background:bg, borderBottom:`1px solid ${brd}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", flexShrink:0 }}>
      <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", color:m, display:"flex" }}>{Icons.menu}</button>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:12, color:m }}>admin@lendflow.io</span>
        <button onClick={toggleDark} style={{ background:"none", border:`1px solid ${brd}`, borderRadius:7, padding:"5px 8px", cursor:"pointer", color:m, display:"flex" }}>{dark?Icons.sun:Icons.moon}</button>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 12px", background:meta.bg, borderRadius:20 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:meta.color }}/>
          <span style={{ fontSize:11, fontWeight:700, color:meta.color }}>{role}</span>
        </div>
        <div style={{ width:30, height:30, borderRadius:"50%", background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:12 }}>P</div>
        <button onClick={onLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#ef4444", fontSize:12, cursor:"pointer" }}>{Icons.logout}Logout</button>
      </div>
    </div>
  );
}

function OpsDashboard({ loans, setLoans, dark, toggleDark, role, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [previewRole, setPreviewRole] = useState(role);
  const allowed = OPS_NAV.filter(n=>n.roles.includes(previewRole));
  const [module, setModule] = useState(allowed[0]?.id||"dashboard");
  const safeModule = allowed.find(n=>n.id===module)?module:allowed[0]?.id||"dashboard";

  const bg  = dark ? "#0f172a" : "#f8fafc";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  const cardBg = dark ? "#1e293b" : "#fff";

  // ── Dashboard module ──────────────────────────────────────────────────────
  const DashMod = () => {
    const totalDisbursed = loans.filter(l=>l.status==="Active"||l.status==="Closed").reduce((s,l)=>s+l.amount,0);
    const totalCollected = loans.reduce((s,l)=>s+l.payments.reduce((a,p)=>a+p.amount,0),0);
    return (
      <div style={{ animation:"fadeUp .3s ease" }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:t, margin:"0 0 4px" }}>Operations Dashboard</h2>
        <p style={{ color:m, fontSize:13, margin:"0 0 22px" }}>Overview of all lending operations</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          <KpiCard icon={Icons.grid}     label="Total Applications" value={loans.length}              sub="+12% this month" accent="#6366f1" dark={dark}/>
          <KpiCard icon={Icons.bank}     label="Total Disbursed"    value={fmt(totalDisbursed)}        sub="+8% this month"  accent="#10b981" dark={dark}/>
          <KpiCard icon={Icons.clock}    label="Total Collected"    value={fmt(totalCollected)}        sub="+15% this month" accent="#8b5cf6" dark={dark}/>
          <KpiCard icon={Icons.activity} label="Active Loans"       value={loans.filter(l=>l.status==="Active").length} sub="this month" accent="#f59e0b" dark={dark}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
          {[
            { icon:Icons.users,  label:"Sales Leads",      value:LEADS.length,                                         color:"#6366f1" },
            { icon:Icons.shield, label:"Pending Review",   value:loans.filter(l=>l.status==="Pending").length,         color:"#f59e0b" },
            { icon:Icons.bank,   label:"Ready to Disburse",value:loans.filter(l=>l.status==="Sanctioned").length,      color:"#10b981" },
            { icon:Icons.clock,  label:"Active Loans",     value:loans.filter(l=>l.status==="Active").length,          color:"#ef4444" },
          ].map(c=>(
            <div key={c.label} style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:c.color+"18", display:"flex", alignItems:"center", justifyContent:"center", color:c.color }}>{c.icon}</div>
              <div><p style={{ fontSize:11, color:m, margin:0 }}>{c.label}</p><p style={{ fontSize:20, fontWeight:800, color:t, margin:0 }}>{c.value}</p></div>
            </div>
          ))}
        </div>
        <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:16, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:`1px solid ${brd}` }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:t, margin:0 }}>Recent Applications</h3>
            <button style={{ fontSize:12, color:"#6366f1", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>View all</button>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:dark?"#0f172a":"#f8fafc" }}>
              {["Applicant","Amount","Status","Date"].map(h=><th key={h} style={{ padding:"9px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>)}
            </tr></thead>
            <tbody>{loans.slice(0,5).map((loan,i)=>(
              <tr key={loan.id} style={{ borderBottom:`1px solid ${brd}` }}
                onMouseEnter={e=>e.currentTarget.style.background=dark?"#0f172a":"#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"11px 18px" }}><div style={{ display:"flex", alignItems:"center", gap:9 }}><Avatar name={loan.borrower} color={["#6366f1","#8b5cf6","#3b82f6","#10b981","#f59e0b"][i%5]} size={28}/><span style={{ fontSize:13, fontWeight:600, color:t }}>{loan.borrower}</span></div></td>
                <td style={{ padding:"11px 18px", fontSize:13, color:t, fontWeight:600 }}>{fmt(loan.amount)}</td>
                <td style={{ padding:"11px 18px" }}><Badge status={loan.status} small/></td>
                <td style={{ padding:"11px 18px", fontSize:11, color:m }}>{loan.date}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── Sales module ──────────────────────────────────────────────────────────
  const SalesMod = () => {
    const [search,setSearch]=useState(""); const [page,setPage]=useState(1); const PER=6;
    const filtered=LEADS.filter(l=>l.name.toLowerCase().includes(search.toLowerCase())||l.email.toLowerCase().includes(search.toLowerCase()));
    const paged=filtered.slice((page-1)*PER,page*PER); const pages=Math.ceil(filtered.length/PER);
    return (
      <div style={{ animation:"fadeUp .3s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div><h2 style={{ fontSize:20, fontWeight:800, color:t, margin:"0 0 4px" }}>Sales Module</h2><p style={{ color:m, fontSize:13 }}>Track registered users who haven't applied yet</p></div>
          <div style={{ background:"#dbeafe", borderRadius:20, padding:"4px 14px", display:"flex", alignItems:"center", gap:6 }}>{Icons.users}<span style={{ fontSize:11, fontWeight:700, color:"#1e40af" }}>{filtered.length} Leads</span></div>
        </div>
        <div style={{ position:"relative", marginBottom:16, maxWidth:280 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:m }}>{Icons.search}</span>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search leads..."
            style={{ width:"100%", padding:"8px 14px 8px 34px", border:`1px solid ${brd}`, borderRadius:9, fontSize:13, background:dark?"#1e293b":"#fff", color:t, outline:"none" }}/>
        </div>
        <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:dark?"#0f172a":"#f8fafc" }}>
              {["Name","Email","Registered","Applied"].map(h=><th key={h} style={{ padding:"10px 18px", textAlign:"left", fontSize:10, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>)}
            </tr></thead>
            <tbody>{paged.map((lead,i)=>(
              <tr key={lead.email} style={{ borderBottom:`1px solid ${brd}` }}
                onMouseEnter={e=>e.currentTarget.style.background=dark?"#0f172a":"#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"12px 18px" }}><div style={{ display:"flex", alignItems:"center", gap:9 }}><div style={{ width:28, height:28, borderRadius:"50%", background:lead.color+"22", color:lead.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{lead.name[0]}</div><span style={{ fontSize:13, fontWeight:600, color:t }}>{lead.name}</span></div></td>
                <td style={{ padding:"12px 18px", fontSize:12, color:m }}>{lead.email}</td>
                <td style={{ padding:"12px 18px", fontSize:11, color:m }}>{lead.registered}</td>
                <td style={{ padding:"12px 18px" }}><span style={{ fontSize:10, fontWeight:700, color:"#f59e0b", background:"#fef3c7", padding:"2px 9px", borderRadius:20 }}>Not Applied</span></td>
              </tr>
            ))}</tbody>
          </table>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 18px", borderTop:`1px solid ${brd}` }}>
            <span style={{ fontSize:11, color:m }}>Showing {(page-1)*PER+1}–{Math.min(page*PER,filtered.length)} of {filtered.length}</span>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({length:pages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)} style={{ width:28, height:28, borderRadius:7, border:`1px solid ${p===page?"#6366f1":brd}`, background:p===page?"#6366f1":"none", color:p===page?"#fff":m, fontSize:11, cursor:"pointer" }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Sanction module ───────────────────────────────────────────────────────
  const SanctionMod = () => {
    const [rejectId, setRejectId] = useState(null);
    const [reason, setReason]     = useState("");
    const pending = loans.filter(l=>l.status==="Pending");
    const approve = id => setLoans(loans.map(l=>l.id===id?{...l,status:"Sanctioned",approvedOn:"Today"}:l));
    const reject  = ()  => { setLoans(loans.map(l=>l.id===rejectId?{...l,status:"Rejected",reason}:l)); setRejectId(null); setReason(""); };
    return (
      <div style={{ animation:"fadeUp .3s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div><h2 style={{ fontSize:20, fontWeight:800, color:t, margin:"0 0 4px" }}>Sanction Module</h2><p style={{ color:m, fontSize:13 }}>Review and approve or reject loan applications</p></div>
          <div style={{ background:"#fef3c7", borderRadius:20, padding:"4px 14px", display:"flex", alignItems:"center", gap:6 }}>{Icons.shield}<span style={{ fontSize:11, fontWeight:700, color:"#92400e" }}>{pending.length} Pending</span></div>
        </div>
        {pending.length===0 ? (
          <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"48px 24px", textAlign:"center", color:m }}>
            {Icons.check}<p style={{ marginTop:10 }}>All applications reviewed</p>
          </div>
        ) : pending.map(loan=>(
          <div key={loan.id} style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <Avatar name={loan.borrower} color="#6366f1" size={34}/>
                  <div><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:14, fontWeight:700, color:t }}>{loan.borrower}</span><Badge status="Pending" small/></div><p style={{ fontSize:11, color:m, margin:0 }}>{loan.email}</p></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,auto)", gap:"6px 24px" }}>
                  {[["Amount",fmt(loan.amount)],["Tenure",`${loan.tenure} days`],["Salary",fmt(loan.salary)],["PAN",loan.pan]].map(([lbl,val])=>(
                    <div key={lbl}><p style={{ fontSize:9, color:m, fontWeight:600, textTransform:"uppercase", margin:"0 0 2px" }}>{lbl}</p><p style={{ fontSize:12, fontWeight:700, color:t, margin:0 }}>{val}</p></div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:10, flexShrink:0 }}>
                <button onClick={()=>setRejectId(loan.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"none", border:"1px solid #ef4444", borderRadius:9, color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer" }}>{Icons.x}Reject</button>
                <button onClick={()=>approve(loan.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#10b981", border:"none", borderRadius:9, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>{Icons.check}Approve</button>
              </div>
            </div>
          </div>
        ))}
        {rejectId && (
          <ConfirmModal title="Reject Application" onConfirm={reject} onCancel={()=>{setRejectId(null);setReason("");}} dark={dark} confirmLabel="Confirm Rejection" confirmColor="#ef4444">
            <p style={{ fontSize:13, color:m, marginBottom:14, lineHeight:1.6 }}>Please provide a reason for rejecting this application. This will be visible to the applicant.</p>
            <label style={{ fontSize:12, fontWeight:600, color:t, display:"block", marginBottom:6 }}>Rejection Reason</label>
            <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Enter rejection reason..."
              style={{ width:"100%", minHeight:90, padding:"9px 12px", border:`1px solid ${brd}`, borderRadius:9, fontSize:13, background:dark?"#0f172a":"#fff", color:t, resize:"vertical", outline:"none" }}/>
          </ConfirmModal>
        )}
      </div>
    );
  };

  // ── Disbursement module ───────────────────────────────────────────────────
  const DisburMod = () => {
    const [confirmId, setConfirmId] = useState(null);
    const sanctioned = loans.filter(l=>l.status==="Sanctioned");
    const confirmLoan = sanctioned.find(l=>l.id===confirmId);
    const disburse = id => { setLoans(loans.map(l=>l.id===id?{...l,status:"Active",disbursedOn:"Today"}:l)); setConfirmId(null); };
    return (
      <div style={{ animation:"fadeUp .3s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div><h2 style={{ fontSize:20, fontWeight:800, color:t, margin:"0 0 4px" }}>Disbursement Module</h2><p style={{ color:m, fontSize:13 }}>Release funds for approved loan applications</p></div>
          <div style={{ background:"#d1fae5", borderRadius:20, padding:"4px 14px", display:"flex", alignItems:"center", gap:6 }}>{Icons.bank}<span style={{ fontSize:11, fontWeight:700, color:"#065f46" }}>{sanctioned.length} Ready</span></div>
        </div>
        {sanctioned.length===0 ? (
          <div style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"48px 24px", textAlign:"center", color:m }}>
            {Icons.bank}<p style={{ marginTop:10 }}>No loans ready for disbursement</p>
          </div>
        ) : sanctioned.map(loan=>{
          const si=calcSI(loan.amount,loan.tenure);
          return (
            <div key={loan.id} style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}><Avatar name={loan.borrower} color="#10b981" size={34}/><div><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:14, fontWeight:700, color:t }}>{loan.borrower}</span><Badge status="Sanctioned" small/></div></div></div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,auto)", gap:"6px 24px" }}>
                    {[["Loan Amount",fmt(loan.amount)],["Tenure",`${loan.tenure} days`],["Approved On",loan.approvedOn||"11 May 2026"],["Total Repayment",fmt(loan.amount+si)]].map(([lbl,val])=>(
                      <div key={lbl}><p style={{ fontSize:9, color:m, fontWeight:600, textTransform:"uppercase", margin:"0 0 2px" }}>{lbl}</p><p style={{ fontSize:12, fontWeight:700, color:t, margin:0 }}>{val}</p></div>
                    ))}
                  </div>
                </div>
                <button onClick={()=>setConfirmId(loan.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", background:"#10b981", border:"none", borderRadius:10, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>{Icons.bank}Disburse Funds</button>
              </div>
            </div>
          );
        })}
        {confirmLoan && (
          <ConfirmModal title="Confirm Disbursement" onConfirm={()=>disburse(confirmId)} onCancel={()=>setConfirmId(null)} dark={dark} confirmLabel="Confirm Disbursement" confirmColor="#10b981">
            <div style={{ background:dark?"#0f172a":"#f0fdf4", border:"1px solid #6ee7b7", borderRadius:10, padding:"12px 14px", display:"flex", gap:10 }}>
              <span style={{ color:"#10b981" }}>{Icons.alert}</span>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:t, margin:"0 0 4px" }}>Are you sure?</p>
                <p style={{ fontSize:12, color:m, margin:0, lineHeight:1.6 }}>This will release {fmt(confirmLoan.amount)} to {confirmLoan.borrower}.<br/>This action cannot be undone.</p>
              </div>
            </div>
          </ConfirmModal>
        )}
      </div>
    );
  };

  // ── Collection module ─────────────────────────────────────────────────────
  const CollectMod = () => {
    const [payId, setPayId]   = useState(null);
    const [payForm, setPayForm] = useState({ utr:"", amount:"", date:"" });
    const [payErr, setPayErr] = useState("");
    const active = loans.filter(l=>l.status==="Active"||l.status==="Closed");
    const recordPayment = () => {
      if (!payForm.utr||!payForm.amount||!payForm.date) { setPayErr("All fields required"); return; }
      const allUTRs = loans.flatMap(l=>l.payments.map(p=>p.utr));
      if (allUTRs.includes(payForm.utr)) { setPayErr("UTR already used"); return; }
      const loan = loans.find(l=>l.id===payId);
      const si   = calcSI(loan.amount,loan.tenure);
      const total= loan.amount+si;
      const paid = loan.payments.reduce((s,p)=>s+p.amount,0)+Number(payForm.amount);
      setLoans(loans.map(l=>l.id===payId?{...l,status:paid>=total?"Closed":"Active",payments:[...l.payments,{utr:payForm.utr,amount:Number(payForm.amount),date:payForm.date}]}:l));
      setPayId(null); setPayForm({utr:"",amount:"",date:""}); setPayErr("");
    };
    return (
      <div style={{ animation:"fadeUp .3s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div><h2 style={{ fontSize:20, fontWeight:800, color:t, margin:"0 0 4px" }}>Collection Module</h2><p style={{ color:m, fontSize:13 }}>Record payments for active loans</p></div>
          <div style={{ background:"#fee2e2", borderRadius:20, padding:"4px 14px", display:"flex", alignItems:"center", gap:6 }}>{Icons.clock}<span style={{ fontSize:11, fontWeight:700, color:"#991b1b" }}>{loans.filter(l=>l.status==="Active").length} Active</span></div>
        </div>
        {active.map(loan=>{
          const si=calcSI(loan.amount,loan.tenure);
          const total=loan.amount+si;
          const paid=loan.payments.reduce((s,p)=>s+p.amount,0);
          const pct=Math.round((paid/total)*100);
          return (
            <div key={loan.id} style={{ background:cardBg, border:`1px solid ${brd}`, borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><Avatar name={loan.borrower} color={loan.status==="Closed"?"#6b7280":"#ef4444"} size={34}/><div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:14, fontWeight:700, color:t }}>{loan.borrower}</span><Badge status={loan.status} small/></div></div>
                {loan.status==="Active"&&<button onClick={()=>setPayId(loan.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#6366f1", border:"none", borderRadius:9, color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>{Icons.plus}Record Payment</button>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12 }}>
                {[["Loan",fmt(loan.amount),null],["Total Due",fmt(total),null],["Paid",fmt(paid),"#10b981"],["Outstanding",fmt(total-paid),total-paid>0?"#ef4444":"#10b981"]].map(([lbl,val,col])=>(
                  <div key={lbl} style={{ background:dark?"#0f172a":"#f8fafc", borderRadius:8, padding:"8px 10px" }}>
                    <p style={{ fontSize:9, color:m, fontWeight:600, textTransform:"uppercase", margin:"0 0 3px" }}>{lbl}</p>
                    <p style={{ fontSize:12, fontWeight:800, color:col||t, margin:0 }}>{val}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: loan.payments.length>0?12:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}><span style={{ fontSize:10, color:m }}>Repayment Progress</span><span style={{ fontSize:10, fontWeight:700, color:pct>=100?"#10b981":"#6366f1" }}>{pct}%</span></div>
                <ProgressBar pct={pct} dark={dark}/>
              </div>
              {loan.payments.length>0&&(
                <div style={{ borderTop:`1px solid ${brd}`, paddingTop:10 }}>
                  <p style={{ fontSize:9, fontWeight:700, color:m, textTransform:"uppercase", margin:"0 0 7px" }}>Recent Payments</p>
                  {loan.payments.slice(0,3).map((pay,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                      <span style={{ fontSize:11, color:m, fontFamily:"monospace" }}>{pay.utr}</span>
                      <div style={{ display:"flex", gap:14 }}><span style={{ fontSize:12, fontWeight:700, color:"#10b981" }}>{fmt(pay.amount)}</span><span style={{ fontSize:10, color:m }}>{pay.date}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {payId && (
          <ConfirmModal title="Record Payment" onConfirm={recordPayment} onCancel={()=>{setPayId(null);setPayErr("");}} dark={dark} confirmLabel="Record Payment" confirmColor="#6366f1">
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {payErr&&<div style={{ background:"#fee2e2", borderRadius:8, padding:"7px 12px", fontSize:12, color:"#991b1b", fontWeight:600 }}>{payErr}</div>}
              {[{label:"UTR Number",key:"utr",placeholder:"UTR282e69538099",type:"text"},{label:"Amount (₹)",key:"amount",placeholder:"50000",type:"number"},{label:"Payment Date",key:"date",placeholder:"",type:"date"}].map(f=>(
                <div key={f.key}>
                  <label style={{ fontSize:12, fontWeight:600, color:t, display:"block", marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} value={payForm[f.key]} placeholder={f.placeholder} onChange={e=>setPayForm({...payForm,[f.key]:e.target.value})}
                    style={{ width:"100%", padding:"8px 12px", border:`1px solid ${brd}`, borderRadius:8, fontSize:13, background:dark?"#0f172a":"#fff", color:t, outline:"none" }}/>
                </div>
              ))}
            </div>
          </ConfirmModal>
        )}
      </div>
    );
  };

  // ── Role switcher bar ─────────────────────────────────────────────────────
  const RoleBar = () => (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 16px", borderBottom:`1px solid ${brd}`, background:dark?"#0f172a":"#f8fafc", flexShrink:0 }}>
      <span style={{ fontSize:11, color:m, fontWeight:500 }}>Preview as:</span>
      {Object.keys(ROLES_META).filter(r=>r!=="Borrower").map(r=>{
        const meta=ROLES_META[r]; const active=previewRole===r;
        return (
          <button key={r} onClick={()=>{ setPreviewRole(r); setModule(OPS_NAV.find(n=>n.roles.includes(r))?.id||"dashboard"); }}
            style={{ padding:"3px 11px", borderRadius:20, border:`1px solid ${active?meta.color:brd}`, background:active?meta.bg:"none", color:active?meta.color:m, fontSize:11, fontWeight:active?700:400, cursor:"pointer" }}>
            {r}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ display:"flex", height:"100vh", background:bg, fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}`}</style>
      <OpsSidebar module={safeModule} setModule={setModule} collapsed={collapsed} role={previewRole} dark={dark}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <OpsTopBar role={previewRole} onToggle={()=>setCollapsed(!collapsed)} dark={dark} toggleDark={toggleDark} onLogout={onLogout}/>
        <RoleBar/>
        <main style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
          {safeModule==="dashboard"    && <DashMod/>}
          {safeModule==="sales"        && <SalesMod/>}
          {safeModule==="sanction"     && <SanctionMod/>}
          {safeModule==="disbursement" && <DisburMod/>}
          {safeModule==="collection"   && <CollectMod/>}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP — FULL ROUTER
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [dark, setDark]         = useState(false);
  const [page, setPage]         = useState("login");    // login | borrower-dash | borrower-apply | ops-dash
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [loans, setLoans]       = useState(INIT_LOANS);

  const handleLogin = (role, email) => {
    setUserRole(role); setUserEmail(email);
    if (role === "Borrower") setPage("borrower-dash");
    else setPage("ops-dash");
  };

  const handleLogout = () => { setUserRole(null); setUserEmail(""); setPage("login"); };

  if (page === "login")           return <AuthPage mode="login"    onLogin={handleLogin} dark={dark} toggleDark={()=>setDark(!dark)} />;
  if (page === "borrower-apply")  return <ApplyFlow userEmail={userEmail} dark={dark} onBack={()=>setPage("borrower-dash")} loans={loans} setLoans={setLoans} />;
  if (page === "borrower-dash")   return <BorrowerDashboard loans={loans} dark={dark} toggleDark={()=>setDark(!dark)} userEmail={userEmail} onApply={()=>setPage("borrower-apply")} onLogout={handleLogout}/>;
  if (page === "ops-dash")        return <OpsDashboard loans={loans} setLoans={setLoans} dark={dark} toggleDark={()=>setDark(!dark)} role={userRole} onLogout={handleLogout}/>;
  return null;
}
