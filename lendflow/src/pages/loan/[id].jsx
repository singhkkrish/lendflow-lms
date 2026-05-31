/**
 * pages/loan/[id].jsx  — Loan Detail Page
 * Accessible by borrower (own loan) and all ops roles.
 * GET /api/loans/:id  +  GET /api/payments/loan/:id
 */

import { useRouter } from 'next/router';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { useLoanDetail } from '@/hooks/useApi';
import withAuth from '@/lib/withAuth';

const fmtINR  = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const STATUS_PILL = {
  pending:    'bg-yellow-100 text-yellow-700',
  sanctioned: 'bg-blue-100 text-blue-700',
  disbursed:  'bg-green-100 text-green-700',
  rejected:   'bg-red-100 text-red-700',
  closed:     'bg-gray-100 text-gray-600',
};

// ── Timeline step ─────────────────────────────────────────────────────────────
function TimelineStep({ icon, label, date, active, last }) {
  return (
    <div className={`flex gap-3 ${!last ? 'pb-5' : ''}`}>
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 shrink-0
          ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
          {icon}
        </div>
        {!last && <div className={`w-0.5 flex-1 mt-1 ${active ? 'bg-indigo-200' : 'bg-gray-100'}`} />}
      </div>
      <div className="pt-1 pb-1">
        <p className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
}

function LoanDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuthStore();
  const { data, loading, error } = useLoanDetail(id);

  if (!id) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-3">❌</p>
          <p className="text-gray-700 font-semibold mb-2">{error}</p>
          <button onClick={() => router.back()} className="text-indigo-600 text-sm hover:underline">← Go back</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { loan, payments, totalPaid, outstanding } = data;
  const borrower = typeof loan.borrower === 'object' ? loan.borrower : null;
  const pct = loan.totalRepayment > 0
    ? Math.min(100, Math.round((totalPaid / loan.totalRepayment) * 100))
    : 0;

  const backHref = user?.role === 'borrower' ? '/dashboard' : '/ops';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push(backHref)} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-mono text-sm text-gray-500">{loan.applicationId}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_PILL[loan.status]}`}>
            ● {loan.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg" />
          <span className="font-bold text-gray-900 text-sm hidden sm:block">LendFlow</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Borrower profile */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>👤</span> Borrower Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Full Name',       loan.fullName],
                  ['PAN Number',      loan.pan],
                  ['Date of Birth',   fmtDate(loan.dateOfBirth)],
                  ['Monthly Salary',  fmtINR(loan.monthlySalary)],
                  ['Employment',      loan.employmentMode],
                  ['Email',           borrower?.email || '—'],
                  ['Member Since',    fmtDate(borrower?.createdAt)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="font-medium capitalize text-gray-900">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>💼</span> Loan Configuration
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                {[
                  ['Principal',      fmtINR(loan.amount),         'text-gray-900'],
                  ['Interest (12%)', fmtINR(loan.interest),       'text-orange-600'],
                  ['Tenure',         `${loan.tenure} days`,       'text-gray-900'],
                  ['Total Due',      fmtINR(loan.totalRepayment), 'text-indigo-700 font-bold'],
                ].map(([k, v, cls]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className={`text-lg font-bold ${cls}`}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Repayment progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Repayment Progress</span>
                  <span className="font-semibold">{pct}% — {fmtINR(totalPaid)} paid of {fmtINR(loan.totalRepayment)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {outstanding > 0 && (
                  <p className="text-xs text-red-500 mt-1">Outstanding: <strong>{fmtINR(outstanding)}</strong></p>
                )}
                {outstanding === 0 && loan.status === 'closed' && (
                  <p className="text-xs text-green-600 mt-1 font-semibold">✅ Fully repaid & closed</p>
                )}
              </div>
            </div>

            {/* Payment history */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>💳</span> Payment History
                </h3>
                <span className="text-xs text-gray-400">{payments.length} transaction{payments.length !== 1 ? 's' : ''}</span>
              </div>

              {payments.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">No payments recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">UTR Number</th>
                        <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Amount</th>
                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Date</th>
                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Recorded By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-5 py-3 font-mono text-xs text-gray-600">{p.utrNumber}</td>
                          <td className="px-5 py-3 text-right font-semibold text-green-600">{fmtINR(p.amount)}</td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{fmtDate(p.paymentDate)}</td>
                          <td className="px-5 py-3 text-gray-500 text-xs">
                            {typeof p.recordedBy === 'object' ? p.recordedBy.name : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td className="px-5 py-3 text-sm font-semibold text-gray-700">Total Paid</td>
                        <td className="px-5 py-3 text-right font-bold text-green-700">{fmtINR(totalPaid)}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ─────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Lifecycle timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <span>📋</span> Loan Lifecycle
              </h3>
              <TimelineStep icon="📝" label="Application Submitted" date={fmtDate(loan.appliedAt)}   active={true} />
              <TimelineStep icon="🛡" label="Sanction Review"
                date={loan.sanctionedAt || loan.status === 'rejected' ? fmtDate(loan.sanctionedAt || loan.updatedAt) : 'Pending'}
                active={['sanctioned','disbursed','closed','rejected'].includes(loan.status)} />
              {loan.status === 'rejected' ? (
                <TimelineStep icon="❌" label="Rejected" date={fmtDate(loan.updatedAt)} active={true} />
              ) : (
                <>
                  <TimelineStep icon="💸" label="Funds Disbursed"   date={loan.disbursedAt ? fmtDate(loan.disbursedAt) : 'Pending'} active={['disbursed','closed'].includes(loan.status)} />
                  <TimelineStep icon="✅" label="Loan Closed" date={loan.closedAt ? fmtDate(loan.closedAt) : 'Pending'} active={loan.status === 'closed'} last />
                </>
              )}
            </div>

            {/* Rejection reason */}
            {loan.status === 'rejected' && loan.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-red-700 mb-1">❌ Rejection Reason</p>
                <p className="text-sm text-red-600">{loan.rejectionReason}</p>
              </div>
            )}

            {/* Document */}
            {loan.salarySlipUrl && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📄</span> Documents
                </h3>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${loan.salarySlipUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors">
                  <span className="text-2xl">📎</span>
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Salary Slip</p>
                    <p className="text-xs text-indigo-400">Click to view</p>
                  </div>
                </a>
              </div>
            )}

            {/* Ops actors */}
            {(loan.sanctionedBy || loan.disbursedBy) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>👥</span> Processed By
                </h3>
                <div className="space-y-3 text-sm">
                  {loan.sanctionedBy && (
                    <div>
                      <p className="text-xs text-gray-400">Sanctioned by</p>
                      <p className="font-medium">{typeof loan.sanctionedBy === 'object' ? loan.sanctionedBy.name : '—'}</p>
                      <p className="text-xs text-gray-400">{fmtDate(loan.sanctionedAt)}</p>
                    </div>
                  )}
                  {loan.disbursedBy && (
                    <div>
                      <p className="text-xs text-gray-400">Disbursed by</p>
                      <p className="font-medium">{typeof loan.disbursedBy === 'object' ? loan.disbursedBy.name : '—'}</p>
                      <p className="text-xs text-gray-400">{fmtDate(loan.disbursedAt)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📊</span> Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Interest Rate',   '12% p.a. (Simple Interest)'],
                  ['Payments Made',   `${payments.length}`],
                  ['Avg. Payment',    payments.length > 0 ? fmtINR(Math.round(totalPaid / payments.length)) : '—'],
                  ['Loan ID',         <span className="font-mono text-xs">{loan.applicationId}</span>],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(LoanDetailPage);
