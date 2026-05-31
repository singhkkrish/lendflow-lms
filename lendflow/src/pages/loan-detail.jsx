import { useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 18, sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const Icons = {
  arrowL:   <Ic d="M19 12H5M12 19l-7-7 7-7" />,
  user:     <Ic d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />,
  file:     <Ic d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />,
  check:    <Ic d="M20 6L9 17l-5-5" sw={2.5} />,
  dollar:   <Ic d={["M12 1v22","M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"]} />,
  clock:    <Ic d={["M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M12 6v6l4 2"]} />,
  shield:   <Ic d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z","M9 12l2 2 4-4"]} />,
  edit:     <Ic d={["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"]} />,
  download: <Ic d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />,
  zap:      <Ic d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  activity: <Ic d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  moon:     <Ic d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  sun:      <Ic d={["M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42","M12 17a5 5 0 000-10"]} />,
  logout:   <Ic d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />,
  info:     <Ic d={["M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z","M12 16v-4","M12 8h.01"]} />,
  mail:     <Ic d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />,
  phone:    <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.2 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />,
  bank:     <Ic d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]} />,
  plus:     <Ic d={["M12 5v14","M5 12h14"]} />,
  x:        <Ic d="M18 6L6 18M6 6l12 12" sw={2.5} />,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt     = n => "₹" + Number(n).toLocaleString("en-IN");
const calcSI  = (p, t) => Math.round((p * 12 * t) / (365 * 100));

// ── Mock loan detail data ─────────────────────────────────────────────────────
const LOAN = {
  id: "APP_002",
  borrower: "Rahul Sharma",
  email: "rahul@lendflow.io",
  phone: "+91 98765 43210",
  pan: "ABCDE1234F",
  dob: "12 May 2000",
  age: 25,
  employment: "Salaried",
  salary: 80000,
  amount: 350000,
  tenure: 180,
  status: "Active",
  appliedOn: "1 May 2026",
  approvedOn: "3 May 2026",
  disbursedOn: "3 May 2026",
  approvedBy: "Sanction Team",
  disbursedBy: "Disbursement Team",
  salarySlip: "DBMS_previous_year.pdf",
  payments: [
    { id: "PAY_001", utr: "UTR282e69538002", amount: 50000, date: "31 May 2026", recordedBy: "Collection Officer" },
    { id: "PAY_002", utr: "UTR282e69420982", amount: 50000, date: "7 May 2026",  recordedBy: "Collection Officer" },
  ],
  auditLog: [
    { action: "Payment Recorded",   by: "Collection Officer", date: "31 May 2026, 2:14 PM", detail: "₹50,000 via UTR282e69538002",  color: "#10b981" },
    { action: "Payment Recorded",   by: "Collection Officer", date: "7 May 2026, 11:30 AM",  detail: "₹50,000 via UTR282e69420982", color: "#10b981" },
    { action: "Loan Disbursed",     by: "Disbursement Team",  date: "3 May 2026, 9:00 AM",   detail: "Funds released to borrower",  color: "#3b82f6" },
    { action: "Loan Sanctioned",    by: "Sanction Officer",   date: "3 May 2026, 8:45 AM",   detail: "Application approved",        color: "#8b5cf6" },
    { action: "Application Submitted", by: "Rahul Sharma",    date: "1 May 2026, 4:20 PM",   detail: "New loan application",        color: "#6366f1" },
  ],
};

const STATUS_COLORS = {
  Pending:    { bg:"#fef3c7", text:"#92400e", dot:"#f59e0b" },
  Sanctioned: { bg:"#dbeafe", text:"#1e40af", dot:"#3b82f6" },
  Active:     { bg:"#d1fae5", text:"#065f46", dot:"#10b981" },
  Closed:     { bg:"#f3f4f6", text:"#374151", dot:"#6b7280" },
  Rejected:   { bg:"#fee2e2", text:"#991b1b", dot:"#ef4444" },
};

// ── Small Components ──────────────────────────────────────────────────────────
function Badge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.Pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 12px", borderRadius:20, background:c.bg, fontSize:12, fontWeight:700, color:c.text }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot }} />{status}
    </span>
  );
}

function SectionCard({ title, icon, children, dark, action }) {
  const bg  = dark ? "#1e293b" : "#fff";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  return (
    <div style={{ background:bg, border:`1px solid ${brd}`, borderRadius:16, overflow:"hidden", marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${brd}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#6366f1" }}>{icon}</span>
          <span style={{ fontSize:14, fontWeight:700, color:t }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding:"18px 20px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, dark, mono }) {
  const t = dark ? "#f1f5f9" : "#0f172a";
  const m = dark ? "#94a3b8" : "#64748b";
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${dark?"#334155":"#f1f5f9"}` }}>
      <span style={{ fontSize:13, color:m }}>{label}</span>
      <span style={{ fontSize:13, fontWeight:600, color:t, fontFamily:mono?"monospace":"inherit" }}>{value}</span>
    </div>
  );
}

function StatBox({ label, value, color, dark }) {
  const bg  = dark ? "#0f172a" : "#f8fafc";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  return (
    <div style={{ background:bg, borderRadius:12, padding:"14px 16px", flex:1 }}>
      <p style={{ fontSize:10, color:m, fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 4px" }}>{label}</p>
      <p style={{ fontSize:18, fontWeight:800, color:color||t, margin:0 }}>{value}</p>
    </div>
  );
}

// ── Status Timeline ───────────────────────────────────────────────────────────
function StatusTimeline({ loan, dark }) {
  const m   = dark ? "#94a3b8" : "#64748b";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const brd = dark ? "#334155" : "#e2e8f0";

  const stages = [
    { label:"Applied",    date:loan.appliedOn,    done:true },
    { label:"Sanctioned", date:loan.approvedOn,   done:!!loan.approvedOn },
    { label:"Disbursed",  date:loan.disbursedOn,  done:!!loan.disbursedOn },
    { label:"Closed",     date:null,               done:loan.status==="Closed" },
  ];
  const currentIdx = stages.reduce((acc, s, i) => s.done ? i : acc, 0);

  return (
    <div>
      {/* Horizontal bar */}
      <div style={{ display:"flex", alignItems:"flex-start", marginBottom:24 }}>
        {stages.map((stage, i) => {
          const active = i === currentIdx;
          const done   = i <= currentIdx;
          return (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", flex: i < stages.length-1 ? 1 : 0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{
                  width:38, height:38, borderRadius:"50%",
                  background: done ? (active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#10b981") : (dark?"#374151":"#f1f5f9"),
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: done ? "#fff" : m,
                  border: active ? "3px solid #c7d2fe" : "none",
                  boxShadow: active ? "0 0 0 6px rgba(99,102,241,.15)" : "none",
                  transition:"all .3s",
                }}>
                  {done && !active
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    : <span style={{ fontSize:13, fontWeight:700 }}>{i+1}</span>
                  }
                </div>
                <span style={{ fontSize:11, fontWeight:active?700:500, color:active?"#6366f1":done?"#10b981":m, whiteSpace:"nowrap" }}>{stage.label}</span>
                {stage.date && <span style={{ fontSize:10, color:m, whiteSpace:"nowrap" }}>{stage.date}</span>}
              </div>
              {i < stages.length-1 && (
                <div style={{ flex:1, height:3, background: i < currentIdx ? "#10b981" : (dark?"#374151":"#e2e8f0"), margin:"18px 8px 0", borderRadius:99, transition:"background .4s" }}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Repayment Chart (SVG bar chart) ──────────────────────────────────────────
function RepaymentChart({ principal, interest, paid, dark }) {
  const total = principal + interest;
  const outstanding = total - paid;
  const bars = [
    { label:"Principal",   value:principal,   color:"#6366f1", pct:100 },
    { label:"Interest",    value:interest,    color:"#8b5cf6", pct:Math.round((interest/principal)*100) },
    { label:"Total Due",   value:total,       color:"#3b82f6", pct:100 },
    { label:"Paid",        value:paid,        color:"#10b981", pct:Math.round((paid/total)*100) },
    { label:"Outstanding", value:outstanding, color:"#ef4444", pct:Math.round((outstanding/total)*100) },
  ];
  const m = dark ? "#94a3b8" : "#64748b";
  const t = dark ? "#f1f5f9" : "#0f172a";
  const maxW = 240;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {bars.map(b => (
        <div key={b.label} style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:12, color:m, width:80, flexShrink:0 }}>{b.label}</span>
          <div style={{ flex:1, background: dark?"#374151":"#f1f5f9", borderRadius:99, height:8, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${b.pct}%`, background:b.color, borderRadius:99, transition:"width .6s ease" }}/>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:b.color, width:90, textAlign:"right", flexShrink:0 }}>{fmt(b.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Payment Record Modal ──────────────────────────────────────────────────────
function PayModal({ loan, onClose, onRecord, dark }) {
  const [form, setForm] = useState({ utr:"", amount:"", date:"" });
  const [err, setErr]   = useState("");
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  const brd = dark ? "#334155" : "#e2e8f0";
  const bg  = dark ? "#1e293b" : "#fff";
  const ib  = dark ? "#0f172a" : "#fff";

  const si    = calcSI(loan.amount, loan.tenure);
  const total = loan.amount + si;
  const paid  = loan.payments.reduce((s,p) => s+p.amount, 0);
  const outstanding = total - paid;

  const submit = () => {
    if (!form.utr || !form.amount || !form.date) { setErr("All fields are required"); return; }
    if (Number(form.amount) > outstanding) { setErr(`Cannot exceed outstanding amount ${fmt(outstanding)}`); return; }
    if (Number(form.amount) <= 0) { setErr("Amount must be positive"); return; }
    onRecord(form);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:bg, border:`1px solid ${brd}`, borderRadius:18, padding:28, width:440, boxShadow:"0 24px 64px rgba(0,0,0,.25)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:t, margin:0 }}>Record Payment</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:m }}>{Icons.x}</button>
        </div>

        <div style={{ background: dark?"#0f172a":"#f8fafc", borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <div><p style={{ fontSize:10, color:m, fontWeight:600, textTransform:"uppercase", margin:"0 0 3px" }}>Outstanding</p><p style={{ fontSize:18, fontWeight:800, color:"#ef4444", margin:0 }}>{fmt(outstanding)}</p></div>
            <div style={{ textAlign:"right" }}><p style={{ fontSize:10, color:m, fontWeight:600, textTransform:"uppercase", margin:"0 0 3px" }}>Total Due</p><p style={{ fontSize:18, fontWeight:800, color:t, margin:0 }}>{fmt(total)}</p></div>
          </div>
        </div>

        {err && <div style={{ background:"#fee2e2", borderRadius:9, padding:"9px 14px", marginBottom:16, fontSize:12, color:"#991b1b", fontWeight:600 }}>{err}</div>}

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { label:"UTR Number",    key:"utr",    placeholder:"UTR282e69538099", type:"text" },
            { label:"Amount (₹)",    key:"amount", placeholder:`Max ${fmt(outstanding)}`, type:"number" },
            { label:"Payment Date",  key:"date",   placeholder:"",                type:"date" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize:12, fontWeight:600, color:t, display:"block", marginBottom:6 }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} placeholder={f.placeholder}
                onChange={e => setForm({...form,[f.key]:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", border:`1px solid ${brd}`, borderRadius:10, fontSize:13, background:ib, color:t, outline:"none" }}/>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", background:"none", border:`1px solid ${brd}`, borderRadius:10, color:m, fontSize:13, cursor:"pointer" }}>Cancel</button>
          <button onClick={submit} style={{ flex:1, padding:"10px", background:"#6366f1", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Record Payment</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Loan Detail Page ─────────────────────────────────────────────────────
export default function LoanDetailPage() {
  const [dark, setDark]       = useState(false);
  const [loan, setLoan]       = useState(LOAN);
  const [payModal, setPayModal] = useState(false);

  const si          = calcSI(loan.amount, loan.tenure);
  const total       = loan.amount + si;
  const paid        = loan.payments.reduce((s,p) => s+p.amount, 0);
  const outstanding = total - paid;
  const pct         = Math.round((paid / total) * 100);

  const bg  = dark ? "#0f172a" : "#f8fafc";
  const brd = dark ? "#334155" : "#e2e8f0";
  const t   = dark ? "#f1f5f9" : "#0f172a";
  const m   = dark ? "#94a3b8" : "#64748b";
  const navBg = dark ? "#0f172a" : "#fff";

  const recordPayment = (form) => {
    const newPaid   = paid + Number(form.amount);
    const newStatus = newPaid >= total ? "Closed" : loan.status;
    const newEntry  = { id:`PAY_00${loan.payments.length+1}`, utr:form.utr, amount:Number(form.amount), date:form.date, recordedBy:"Collection Officer" };
    const newAudit  = { action:"Payment Recorded", by:"Collection Officer", date:`${form.date}, Now`, detail:`${fmt(Number(form.amount))} via ${form.utr}`, color:"#10b981" };
    setLoan(l => ({ ...l, status:newStatus, payments:[newEntry,...l.payments], auditLog:[newAudit,...l.auditLog] }));
    setPayModal(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:bg, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
      `}</style>

      {/* Nav */}
      <nav style={{ background:navBg, borderBottom:`1px solid ${brd}`, padding:"0 28px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:`1px solid ${brd}`, borderRadius:8, padding:"5px 12px", cursor:"pointer", color:m, fontSize:13 }}>
            {Icons.arrowL}<span>Back</span>
          </button>
          <div style={{ width:1, height:20, background:brd }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>{Icons.zap}</div>
            <span style={{ fontWeight:700, fontSize:16, color:t }}>LendFlow</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"none", border:`1px solid ${brd}`, borderRadius:8, color:m, fontSize:12, cursor:"pointer" }}>
            {Icons.edit}<span>Edit</span>
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 14px", background:"none", border:`1px solid ${brd}`, borderRadius:8, color:m, fontSize:12, cursor:"pointer" }}>
            {Icons.download}<span>Export</span>
          </button>
          <button onClick={()=>setDark(!dark)} style={{ background:"none", border:`1px solid ${brd}`, borderRadius:7, padding:"5px 8px", cursor:"pointer", color:m, display:"flex" }}>
            {dark ? Icons.sun : Icons.moon}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px", animation:"fadeUp .3s ease" }}>
        {/* Page header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
              <h1 style={{ fontSize:26, fontWeight:800, color:t, letterSpacing:"-0.5px" }}>{loan.id}</h1>
              <Badge status={loan.status} />
            </div>
            <p style={{ color:m, fontSize:14 }}>Applied on {loan.appliedOn} · Last updated {loan.auditLog[0]?.date}</p>
          </div>
          {loan.status === "Active" && (
            <button onClick={()=>setPayModal(true)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 22px", background:"#6366f1", color:"#fff", border:"none", borderRadius:11, fontSize:14, fontWeight:600, cursor:"pointer", boxShadow:"0 4px 14px rgba(99,102,241,.35)" }}>
              {Icons.plus}Record Payment
            </button>
          )}
        </div>

        {/* Status timeline */}
        <div style={{ background: dark?"#1e293b":"#fff", border:`1px solid ${brd}`, borderRadius:16, padding:"22px 24px", marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".08em", margin:"0 0 20px" }}>Loan Lifecycle</p>
          <StatusTimeline loan={loan} dark={dark}/>
        </div>

        {/* KPI strip */}
        <div style={{ display:"flex", gap:12, marginBottom:20 }}>
          <StatBox label="Loan Amount"   value={fmt(loan.amount)}   dark={dark} />
          <StatBox label="Total Due"     value={fmt(total)}         dark={dark} color="#6366f1" />
          <StatBox label="Total Paid"    value={fmt(paid)}          dark={dark} color="#10b981" />
          <StatBox label="Outstanding"   value={fmt(outstanding)}   dark={dark} color={outstanding>0?"#ef4444":"#10b981"} />
          <StatBox label="Progress"      value={`${pct}%`}          dark={dark} color={pct>=100?"#10b981":"#8b5cf6"} />
        </div>

        {/* Two-col layout */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>

          {/* Customer Profile */}
          <SectionCard title="Customer Profile" icon={Icons.user} dark={dark}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20, fontWeight:700 }}>
                {loan.borrower.split(" ").map(w=>w[0]).join("")}
              </div>
              <div>
                <p style={{ fontSize:17, fontWeight:800, color:t, margin:"0 0 2px" }}>{loan.borrower}</p>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:11, background:"#eef2ff", color:"#4f46e5", padding:"2px 9px", borderRadius:20, fontWeight:600 }}>{loan.employment}</span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom:`1px solid ${dark?"#334155":"#f1f5f9"}` }}>
                <span style={{ color:m }}>{Icons.mail}</span>
                <span style={{ fontSize:13, color:t }}>{loan.email}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom:`1px solid ${dark?"#334155":"#f1f5f9"}` }}>
                <span style={{ color:m }}>{Icons.phone}</span>
                <span style={{ fontSize:13, color:t }}>{loan.phone}</span>
              </div>
              <InfoRow label="PAN Number"    value={loan.pan}        dark={dark} mono />
              <InfoRow label="Date of Birth" value={loan.dob}        dark={dark} />
              <InfoRow label="Age"           value={`${loan.age} years`} dark={dark} />
              <InfoRow label="Monthly Salary" value={fmt(loan.salary)} dark={dark} />
              <div style={{ marginTop:14 }}>
                <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 8px" }}>Salary Slip</p>
                <div style={{ display:"flex", alignItems:"center", gap:10, background:dark?"#0f172a":"#f8fafc", borderRadius:10, padding:"10px 12px" }}>
                  <span style={{ fontSize:20 }}>📄</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:600, color:t, margin:0 }}>{loan.salarySlip}</p>
                    <p style={{ fontSize:10, color:m, margin:0 }}>Salary Slip</p>
                  </div>
                  <button style={{ marginLeft:"auto", background:"none", border:`1px solid ${brd}`, borderRadius:7, padding:"4px 10px", cursor:"pointer", color:m, fontSize:11 }}>View</button>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Loan Summary */}
          <SectionCard title="Loan Summary" icon={Icons.dollar} dark={dark}>
            <InfoRow label="Application ID" value={loan.id}                   dark={dark} mono />
            <InfoRow label="Loan Amount"    value={fmt(loan.amount)}           dark={dark} />
            <InfoRow label="Interest Rate"  value="12% p.a. (Simple Interest)" dark={dark} />
            <InfoRow label="Tenure"         value={`${loan.tenure} days`}      dark={dark} />
            <InfoRow label="Interest"       value={fmt(si)}                    dark={dark} />
            <div style={{ display:"flex", justifyContent:"space-between", padding:"11px 0" }}>
              <span style={{ fontSize:14, fontWeight:700, color:t }}>Total Repayment</span>
              <span style={{ fontSize:18, fontWeight:800, color:"#6366f1" }}>{fmt(total)}</span>
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontSize:12, color:m }}>Repayment Progress</span>
                <span style={{ fontSize:12, fontWeight:700, color:pct>=100?"#10b981":"#6366f1" }}>{pct}%</span>
              </div>
              <div style={{ background:dark?"#374151":"#f1f5f9", borderRadius:99, height:10, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:pct>=100?"#10b981":"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:99, transition:"width .6s" }}/>
              </div>
            </div>
            <div style={{ marginTop:18 }}>
              <p style={{ fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".06em", margin:"0 0 12px" }}>Repayment Breakdown</p>
              <RepaymentChart principal={loan.amount} interest={si} paid={paid} dark={dark}/>
            </div>
          </SectionCard>
        </div>

        {/* Payment History */}
        <SectionCard title="Payment History" icon={Icons.activity} dark={dark}
          action={
            <span style={{ fontSize:12, fontWeight:700, color:"#10b981", background:"#d1fae5", padding:"3px 12px", borderRadius:20 }}>
              {loan.payments.length} payments · {fmt(paid)} collected
            </span>
          }>
          {loan.payments.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:m }}>
              <div style={{ fontSize:32, marginBottom:8 }}>💳</div>
              <p style={{ fontSize:14, fontWeight:600, color:t, margin:"0 0 4px" }}>No payments yet</p>
              <p style={{ fontSize:13, color:m }}>Payments will appear here once recorded</p>
            </div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:dark?"#0f172a":"#f8fafc" }}>
                  {["Payment ID","UTR Number","Amount","Date","Recorded By","Status"].map(h => (
                    <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:m, textTransform:"uppercase", letterSpacing:".06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loan.payments.map((pay, i) => (
                  <tr key={pay.id} style={{ borderBottom:`1px solid ${brd}` }}
                    onMouseEnter={e => e.currentTarget.style.background = dark?"#0f172a":"#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding:"13px 16px", fontSize:12, color:m, fontFamily:"monospace" }}>{pay.id}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:t, fontFamily:"monospace" }}>{pay.utr}</td>
                    <td style={{ padding:"13px 16px", fontSize:14, fontWeight:800, color:"#10b981" }}>{fmt(pay.amount)}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:m }}>{pay.date}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:m }}>{pay.recordedBy}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ fontSize:10, fontWeight:700, color:"#065f46", background:"#d1fae5", padding:"2px 10px", borderRadius:20 }}>✓ Recorded</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>

        {/* Audit Log */}
        <SectionCard title="Audit Log" icon={Icons.shield} dark={dark}
          action={<span style={{ fontSize:12, color:m }}>{loan.auditLog.length} events</span>}>
          <div style={{ position:"relative" }}>
            {/* vertical line */}
            <div style={{ position:"absolute", left:14, top:0, bottom:0, width:2, background:dark?"#334155":"#e2e8f0", borderRadius:99 }}/>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {loan.auditLog.map((entry, i) => (
                <div key={i} style={{ display:"flex", gap:16, paddingBottom:i < loan.auditLog.length-1 ? 20 : 0 }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:entry.color+"22", border:`2px solid ${entry.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:entry.color }}/>
                  </div>
                  <div style={{ flex:1, paddingTop:4 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:t }}>{entry.action}</span>
                      <span style={{ fontSize:11, color:m }}>{entry.date}</span>
                    </div>
                    <p style={{ fontSize:12, color:m, margin:0 }}>{entry.detail}</p>
                    <p style={{ fontSize:11, color:m, margin:"2px 0 0" }}>by <span style={{ fontWeight:600, color:t }}>{entry.by}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {payModal && <PayModal loan={loan} onClose={()=>setPayModal(false)} onRecord={recordPayment} dark={dark}/>}
    </div>
  );
}
