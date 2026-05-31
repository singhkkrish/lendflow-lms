import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { useApplyLoan, useUploadSalarySlip } from '@/hooks/useApi';
import withAuth from '@/lib/withAuth';
 
// ── SI Calculator ─────────────────────────────────────────────────────────────
function calcSI(principal, tenure, rate = 12) {
  const interest = Math.round((principal * rate * tenure) / (365 * 100));
  return { interest, totalRepayment: principal + interest };
}
 
// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN');
 
const STEPS = ['Personal Details', 'Documents', 'Loan Config', 'Review & Submit'];
 
function StepBar({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors
              ${i < current ? 'bg-green-500 border-green-500 text-white'
                : i === current ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-gray-300 text-gray-400'}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs mt-1 whitespace-nowrap ${i === current ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mt-[-14px] ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
 
// ── Main Component ────────────────────────────────────────────────────────────
function ApplyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { apply, loading: applyLoading, error: applyError, breErrors } = useApplyLoan();
  const { upload, loading: uploadLoading, error: uploadError } = useUploadSalarySlip();
 
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(null); // loan object on success
 
  // Step 1 state
  const [personal, setPersonal] = useState({
    fullName: user?.name || '',
    pan: '',
    dateOfBirth: '',
    monthlySalary: '',
    employmentMode: 'salaried',
  });
  const [eligChecked, setEligChecked] = useState(false);
  const [eligOk, setEligOk] = useState(false);
 
  // Client-side BRE preview (for UX; server is authoritative)
  function clientBRE() {
    const errors = [];
    const dob = new Date(personal.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    if (age < 23 || age > 50) errors.push(`Age must be 23–50 (yours: ${age})`);
    if (Number(personal.monthlySalary) < 25000) errors.push('Salary must be ≥ ₹25,000');
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(personal.pan.toUpperCase())) errors.push('Invalid PAN format (e.g. ABCDE1234F)');
    if (personal.employmentMode === 'unemployed') errors.push('Unemployed applicants are not eligible');
    return errors;
  }
 
  function checkEligibility() {
    const errors = clientBRE();
    setEligChecked(true);
    setEligOk(errors.length === 0);
  }
 
  // Step 2 state
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
 
  async function handleUpload(f) {
    setFile(f);
    const url = await upload(f);
    if (url) setFileUrl(url);
  }
 
  // Step 3 state
  const [amount, setAmount] = useState(150000);
  const [tenure, setTenure] = useState(180);
  const { interest, totalRepayment } = calcSI(amount, tenure);
 
  // Step 4 submit
  const [confirmed, setConfirmed] = useState(false);
 
  async function handleSubmit() {
    if (!confirmed) return;
    const loan = await apply({
      fullName: personal.fullName,
      pan: personal.pan.toUpperCase(),
      dateOfBirth: personal.dateOfBirth,
      monthlySalary: Number(personal.monthlySalary),
      employmentMode: personal.employmentMode,
      salarySlipUrl: fileUrl,
      amount,
      tenure,
    });
    if (loan) setSubmitted(loan);
  }
 
  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">Your loan application has been submitted successfully. Our team will review it shortly.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">APPLICATION ID</p>
            <p className="font-bold text-gray-900 font-mono">{submitted.applicationId}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              ● Status: Pending Review
            </span>
          </div>
          <div className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <p>1️⃣ Your application will be reviewed by our sanction team</p>
            <p>2️⃣ If approved, funds will be disbursed to your account</p>
            <p>3️⃣ Track your application status from your dashboard</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-indigo-700">
              Go to Dashboard
            </Link>
            <button onClick={() => { setSubmitted(null); setStep(0); setEligChecked(false); setEligOk(false); setFile(null); setFileUrl(''); setConfirmed(false); }}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50">
              New Application
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  // ── Page shell ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg" />
          <span className="font-bold text-gray-900">LendFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</Link>
          <button onClick={() => { useAuthStore.getState().logout(); router.push('/login'); }}
            className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>
 
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">New Loan Application</h1>
        <p className="text-gray-500 text-sm mb-6">Complete all steps to submit your application</p>
 
        <StepBar current={step} />
 
        {/* ── Step 1: Personal Details ───────────────────────────────────────── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">PAN Number</label>
                <input value={personal.pan} onChange={(e) => setPersonal({ ...personal, pan: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F" maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
                <input type="date" value={personal.dateOfBirth} onChange={(e) => setPersonal({ ...personal, dateOfBirth: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">Monthly Salary (₹)</label>
                <input type="number" value={personal.monthlySalary} onChange={(e) => setPersonal({ ...personal, monthlySalary: e.target.value })}
                  placeholder="45000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-2">Employment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {['salaried', 'self-employed', 'unemployed'].map((m) => (
                    <button key={m} type="button"
                      onClick={() => setPersonal({ ...personal, employmentMode: m })}
                      className={`py-2 rounded-lg border text-sm capitalize transition-colors
                        ${personal.employmentMode === m
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Client-side BRE preview */}
            {eligChecked && (
              <div className={`mt-4 p-4 rounded-xl border ${eligOk ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {eligOk ? (
                  <p className="text-green-700 text-sm font-semibold">✅ Eligibility Verified — you may proceed</p>
                ) : (
                  <div>
                    <p className="text-red-700 text-sm font-semibold mb-2">❌ Eligibility Check Failed</p>
                    {clientBRE().map((e, i) => <p key={i} className="text-red-600 text-xs">• {e}</p>)}
                  </div>
                )}
              </div>
            )}
 
            <div className="flex justify-between mt-6">
              <button onClick={checkEligibility}
                className="flex items-center gap-2 text-sm text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">
                🛡 Check Eligibility
              </button>
              <button onClick={() => setStep(1)} disabled={!eligOk}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40">
                Continue to Documents →
              </button>
            </div>
          </div>
        )}
 
        {/* ── Step 2: Document Upload ────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upload Salary Slip</h3>
            <p className="text-sm text-gray-500 mb-4">Upload your latest salary slip for verification</p>
 
            {!fileUrl ? (
              <label className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                ${uploadLoading ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                {uploadLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-indigo-600">Uploading…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="text-4xl">📤</span>
                    <p className="text-sm">Drag & drop your salary slip here</p>
                    <p className="text-xs">or click to browse</p>
                    <div className="flex gap-2 mt-1">
                      {['PDF', 'JPG', 'PNG'].map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{t}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Maximum file size: 5 MB</p>
                  </div>
                )}
              </label>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">{file?.name}</p>
                  <p className="text-xs text-green-600">Uploaded successfully ✓</p>
                </div>
                <button onClick={() => { setFile(null); setFileUrl(''); }}
                  className="text-gray-400 hover:text-red-500 text-xs border border-gray-200 px-2 py-1 rounded">
                  Remove
                </button>
              </div>
            )}
 
            {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
 
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(0)} className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">← Back</button>
              <button onClick={() => setStep(2)} disabled={!fileUrl}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40">
                Continue to Loan Config →
              </button>
            </div>
          </div>
        )}
 
        {/* ── Step 3: Loan Config ───────────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Configure Your Loan</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-600">Loan Amount</label>
                  <span className="text-sm font-bold text-indigo-600">{fmtINR(amount)}</span>
                </div>
                <input type="range" min={50000} max={500000} step={10000} value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-indigo-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹50K</span><span>₹5L</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[100000, 200000, 300000, 500000].map((v) => (
                    <button key={v} onClick={() => setAmount(v)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors
                        ${amount === v ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-500 hover:border-indigo-300'}`}>
                      {fmtINR(v / 100000)}L
                    </button>
                  ))}
                </div>
 
                <div className="flex justify-between mt-6 mb-2">
                  <label className="text-sm text-gray-600">Tenure</label>
                  <span className="text-sm font-bold text-indigo-600">{tenure} days</span>
                </div>
                <input type="range" min={30} max={365} step={5} value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-indigo-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>30 days</span><span>365 days</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[[30,'1Mo'],[90,'3Mo'],[180,'6Mo'],[270,'9Mo'],[365,'1Yr']].map(([d, l]) => (
                    <button key={d} onClick={() => setTenure(Number(d))}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors
                        ${tenure === d ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-500 hover:border-indigo-300'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
 
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Loan Summary</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Principal</span><span className="font-semibold">{fmtINR(amount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Interest (12% p.a.)</span><span className="font-semibold text-orange-600">+ {fmtINR(interest)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tenure</span><span className="font-semibold">{tenure} days</span></div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total Repayment</span>
                    <span className="font-bold text-indigo-700 text-base">{fmtINR(totalRepayment)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Approx. Monthly</span>
                    <span className="font-medium text-gray-600">{fmtINR(Math.round(totalRepayment / (tenure / 30)))}</span>
                  </div>
                </div>
                {/* Principal vs Interest bar */}
                <div className="mt-4">
                  <div className="flex rounded-full overflow-hidden h-2">
                    <div className="bg-indigo-500" style={{ width: `${(amount / totalRepayment) * 100}%` }} />
                    <div className="bg-orange-400" style={{ width: `${(interest / totalRepayment) * 100}%` }} />
                  </div>
                  <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full" />Principal</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full" />Interest</span>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">← Back</button>
              <button onClick={() => setStep(3)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                Review Application →
              </button>
            </div>
          </div>
        )}
 
        {/* ── Step 4: Review & Submit ───────────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Review & Submit</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Personal Information</p>
                {[['Full Name', personal.fullName], ['PAN', personal.pan], ['Date of Birth', personal.dateOfBirth], ['Monthly Salary', fmtINR(personal.monthlySalary)], ['Employment', personal.employmentMode]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium capitalize">{v}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-1 text-green-600 text-xs font-medium">
                  <span>✓</span><span>Eligibility Verified</span>
                </div>
              </div>
 
              {/* Document */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Document Uploaded</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-medium">{file?.name || 'salary-slip'}</p>
                    <p className="text-xs text-gray-400">Salary Slip</p>
                  </div>
                </div>
              </div>
 
              {/* Loan Config */}
              <div className="col-span-2 bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Loan Configuration</p>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  {[['Loan Amount', fmtINR(amount)], ['Tenure', `${tenure} days`], ['Interest', fmtINR(interest)], ['Total Repayment', fmtINR(totalRepayment)]].map(([k, v], i) => (
                    <div key={k}>
                      <p className="text-xs text-gray-500 uppercase">{k}</p>
                      <p className={`font-bold ${i === 3 ? 'text-indigo-700' : 'text-gray-900'}`}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            {/* BRE / API errors */}
            {breErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm font-semibold mb-1">Eligibility check failed on server:</p>
                {breErrors.map((e, i) => <p key={i} className="text-red-600 text-xs">• {e}</p>)}
              </div>
            )}
            {applyError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm mb-4">
                {applyError}
              </div>
            )}
 
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-600">
                I confirm that all the information provided is accurate and I agree to the loan terms and conditions.
                I understand that false information may lead to rejection of my application.
              </span>
            </label>
 
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">← Back</button>
              <button onClick={handleSubmit} disabled={!confirmed || applyLoading}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 flex items-center gap-2">
                {applyLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {applyLoading ? 'Submitting…' : 'Submit Application ✈'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
export default withAuth(ApplyPage, ['borrower']);