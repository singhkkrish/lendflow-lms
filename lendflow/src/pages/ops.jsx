import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';
import {
  useAdminLoans,
  useLeads,
  useSanctionLoans,
  useSanctionAction,
  useDisbursementLoans,
  useDisburse,
  useCollectionLoans,
  useRecordPayment,
} from '@/hooks/useApi';
import withAuth from '@/lib/withAuth';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const STATUS_PILL = {
  pending:    'bg-yellow-100 text-yellow-700',
  sanctioned: 'bg-blue-100 text-blue-700',
  disbursed:  'bg-green-100 text-green-700',
  rejected:   'bg-red-100 text-red-700',
  closed:     'bg-gray-100 text-gray-600',
};

// ── Sidebar nav config ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',     icon: '▦',  roles: ['admin'] },
  { id: 'sales',         label: 'Sales',        icon: '👤', roles: ['admin', 'sales'] },
  { id: 'sanction',      label: 'Sanction',     icon: '🛡', roles: ['admin', 'sanction'] },
  { id: 'disbursement',  label: 'Disbursement', icon: '💸', roles: ['admin', 'disbursement'] },
  { id: 'collection',    label: 'Collection',   icon: '💰', roles: ['admin', 'collection'] },
];

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function Empty({ message }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-4xl mb-3">📭</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE: OVERVIEW (admin only)
// ════════════════════════════════════════════════════════════════════════════
function OverviewModule() {
  const { data, loading, error } = useAdminLoans('all', 1);
  const kpis = data?.kpis;
  const loans = data?.loans || [];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Operations Dashboard</h2>
      <p className="text-sm text-gray-500 mb-6">Overview of all lending operations</p>

      {loading && <Spinner />}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {kpis && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Applications', value: kpis.totalApplications, icon: '📋', sub: 'All time' },
              { label: 'Total Disbursed',    value: fmtINR(kpis.totalDisbursed),  icon: '💸', sub: 'Principal released' },
              { label: 'Total Collected',    value: fmtINR(kpis.totalCollected),  icon: '💰', sub: 'Repayments received' },
              { label: 'Active Loans',       value: kpis.activeLoans,              icon: '📊', sub: 'Currently disbursed' },
            ].map((k) => (
              <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-xs">{k.label}</span>
                  <span className="text-lg">{k.icon}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Pipeline mini cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Sales Leads',       value: loans.filter(l => false).length, icon: '👤', color: 'blue' },
              { label: 'Pending Review',    value: loans.filter(l => l.status === 'pending').length,    icon: '🛡', color: 'yellow' },
              { label: 'Ready to Disburse', value: loans.filter(l => l.status === 'sanctioned').length, icon: '💸', color: 'green' },
              { label: 'Active Loans',      value: kpis.activeLoans, icon: '💰', color: 'red' },
            ].map((c) => (
              <div key={c.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                <span className="text-xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{c.value}</p>
                  <p className="text-xs text-gray-400">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Applications table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Applications</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Applicant</th>
                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Amount</th>
                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 8).map((loan) => (
                    <tr key={loan._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {typeof loan.borrower === 'object' ? loan.borrower.name : loan.fullName}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{fmtINR(loan.amount)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_PILL[loan.status]}`}>
                          ● {loan.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(loan.appliedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loans.length === 0 && !loading && <Empty message="No applications yet." />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE: SALES
// ════════════════════════════════════════════════════════════════════════════
function SalesModule() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const { data, loading, error } = useLeads(query, page);
  const users  = data?.users || [];
  const total  = data?.pagination?.total || 0;
  const pages  = data?.pagination?.pages || 1;

  function handleSearch(e) {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-900">Sales Module</h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          👤 {total} Leads
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Track registered users who haven't applied yet</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="relative max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Name</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Email</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Registered</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Not Applied
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <Spinner />}
          {!loading && users.length === 0 && <Empty message="No leads found." />}
          {error && <p className="text-red-600 text-sm px-5 py-3">{error}</p>}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing {users.length} of {total}</p>
            <div className="flex gap-1">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium ${page === p ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE: SANCTION
// ════════════════════════════════════════════════════════════════════════════
function SanctionModule() {
  const { data, loading, error, refetch } = useSanctionLoans();
  const { action, loading: actLoading, error: actError } = useSanctionAction();

  const [rejectModal, setRejectModal] = useState(null); // loan object
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState('');

  const loans = data?.loans || [];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleApprove(loan) {
    const result = await action(loan._id, 'approve');
    if (result) { showToast('✅ Loan sanctioned!'); refetch(); }
  }

  async function handleReject() {
    if (!reason.trim()) return;
    const result = await action(rejectModal._id, 'reject', reason);
    if (result) {
      setRejectModal(null);
      setReason('');
      showToast('❌ Loan rejected.');
      refetch();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-900">Sanction Module</h2>
        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          🛡 {loans.length} Pending
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Review and approve or reject loan applications</p>

      {toast && (
        <div className="mb-4 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl inline-block">
          {toast}
        </div>
      )}
      {actError && <p className="text-red-600 text-sm mb-4">{actError}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {loading && <Spinner />}

      <div className="space-y-3">
        {!loading && loans.length === 0 && <Empty message="No pending applications." />}
        {loans.map((loan) => {
          const borrowerName = typeof loan.borrower === 'object' ? loan.borrower.name : loan.fullName;
          return (
            <div key={loan._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{borrowerName}</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">● Pending</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Amount</p>
                      <p className="font-semibold">{fmtINR(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tenure</p>
                      <p className="font-semibold">{loan.tenure} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Salary</p>
                      <p className="font-semibold">{fmtINR(loan.monthlySalary)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">PAN</p>
                      <p className="font-semibold font-mono text-xs">{loan.pan}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Applied: {fmtDate(loan.appliedAt)} &nbsp;·&nbsp; Total Repayment: <span className="font-semibold text-gray-600">{fmtINR(loan.totalRepayment)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setRejectModal(loan); setReason(''); }}
                    className="px-4 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                    ✕ Reject
                  </button>
                  <button
                    onClick={() => handleApprove(loan)}
                    disabled={actLoading}
                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
                    ✓ Approve
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Reject Application</h3>
              <button onClick={() => setRejectModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRejectModal(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleReject} disabled={!reason.trim() || actLoading}
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                {actLoading ? 'Rejecting…' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE: DISBURSEMENT
// ════════════════════════════════════════════════════════════════════════════
function DisbursementModule() {
  const { data, loading, error, refetch } = useDisbursementLoans();
  const { disburse, loading: disbLoading, error: disbError } = useDisburse();

  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState('');

  const loans = data?.loans || [];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleDisburse() {
    const result = await disburse(confirmModal._id);
    if (result) {
      setConfirmModal(null);
      showToast('✅ Funds disbursed successfully!');
      refetch();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-900">Disbursement Module</h2>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          💸 {loans.length} Ready
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Release funds for approved loan applications</p>

      {toast && (
        <div className="mb-4 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl inline-block">{toast}</div>
      )}
      {disbError && <p className="text-red-600 text-sm mb-4">{disbError}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {loading && <Spinner />}

      <div className="space-y-3">
        {!loading && loans.length === 0 && <Empty message="No loans ready for disbursement." />}
        {loans.map((loan) => {
          const borrowerName = typeof loan.borrower === 'object' ? loan.borrower.name : loan.fullName;
          return (
            <div key={loan._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{borrowerName}</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">● Sanctioned</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div><p className="text-xs text-gray-400">Loan Amount</p><p className="font-semibold">{fmtINR(loan.amount)}</p></div>
                    <div><p className="text-xs text-gray-400">Tenure</p><p className="font-semibold">{loan.tenure} days</p></div>
                    <div><p className="text-xs text-gray-400">Approved On</p><p className="font-semibold">{fmtDate(loan.sanctionedAt)}</p></div>
                    <div><p className="text-xs text-gray-400">Total Repayment</p><p className="font-semibold">{fmtINR(loan.totalRepayment)}</p></div>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmModal(loan)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  💸 Disburse Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Confirm Disbursement</h3>
              <button onClick={() => setConfirmModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
              <p className="text-sm font-medium text-blue-800 mb-1">ℹ Are you sure?</p>
              <p className="text-sm text-blue-700">
                This will release <strong>{fmtINR(confirmModal.amount)}</strong> to{' '}
                <strong>{typeof confirmModal.borrower === 'object' ? confirmModal.borrower.name : confirmModal.fullName}</strong>.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDisburse} disabled={disbLoading}
                className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                {disbLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {disbLoading ? 'Processing…' : '💸 Confirm Disbursement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE: COLLECTION
// ════════════════════════════════════════════════════════════════════════════
function CollectionModule() {
  const { data, loading, error, refetch } = useCollectionLoans();
  const { record, loading: recLoading, error: recError } = useRecordPayment();

  const [payModal, setPayModal] = useState(null); // loan object
  const [payForm, setPayForm] = useState({ utrNumber: '', amount: '', paymentDate: '' });
  const [toast, setToast] = useState('');

  const loans = data?.loans || [];

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  async function handleRecordPayment() {
    if (!payForm.utrNumber.trim() || !payForm.amount) return;
    const result = await record({
      loanId: payModal._id,
      utrNumber: payForm.utrNumber.trim(),
      amount: Number(payForm.amount),
      paymentDate: payForm.paymentDate || undefined,
    });
    if (result) {
      setPayModal(null);
      setPayForm({ utrNumber: '', amount: '', paymentDate: '' });
      showToast(result.message);
      refetch();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-900">Collection Module</h2>
        <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          💰 {loans.filter(l => l.status === 'disbursed').length} Active
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-6">Record payments for active loans</p>

      {toast && (
        <div className="mb-4 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl inline-block">{toast}</div>
      )}
      {recError && <p className="text-red-600 text-sm mb-4">{recError}</p>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {loading && <Spinner />}

      <div className="space-y-4">
        {!loading && loans.length === 0 && <Empty message="No active loans to collect." />}
        {loans.map((loan) => {
          const borrowerName = typeof loan.borrower === 'object' ? loan.borrower.name : loan.fullName;
          const pct = loan.totalRepayment > 0
            ? Math.min(100, Math.round(((loan.totalPaid || 0) / loan.totalRepayment) * 100))
            : 0;

          return (
            <div key={loan._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{borrowerName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_PILL[loan.status]}`}>
                      ● {loan.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div><p className="text-xs text-gray-400">Loan</p><p className="font-semibold">{fmtINR(loan.amount)}</p></div>
                    <div><p className="text-xs text-gray-400">Total Due</p><p className="font-semibold">{fmtINR(loan.totalRepayment)}</p></div>
                    <div><p className="text-xs text-gray-400">Paid</p><p className="font-semibold text-green-600">{fmtINR(loan.totalPaid || 0)}</p></div>
                    <div><p className="text-xs text-gray-400">Outstanding</p><p className={`font-semibold ${(loan.outstanding || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>{fmtINR(loan.outstanding || 0)}</p></div>
                  </div>
                </div>
                {loan.status === 'disbursed' && (
                  <button
                    onClick={() => { setPayModal(loan); setPayForm({ utrNumber: '', amount: '', paymentDate: '' }); }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                    + Record Payment
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Repayment Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${pct >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Recent payments */}
              {loan.recentPayments?.length > 0 && (
                <div className="mt-4 border-t border-gray-50 pt-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Recent Payments</p>
                  <div className="space-y-1.5">
                    {loan.recentPayments.map((p) => (
                      <div key={p._id} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-xs text-gray-500">{p.utrNumber}</span>
                        <span className="font-semibold text-green-600">{fmtINR(p.amount)}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Record Payment Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900">Record Payment</h3>
              <button onClick={() => setPayModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Loan: <strong>{fmtINR(payModal.amount)}</strong> — Outstanding: <strong className="text-red-600">{fmtINR(payModal.outstanding)}</strong>
            </p>
            <p className="text-xs text-gray-400 mb-5 font-mono">{payModal.applicationId}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UTR Number <span className="text-red-500">*</span></label>
                <input
                  value={payForm.utrNumber}
                  onChange={(e) => setPayForm({ ...payForm, utrNumber: e.target.value })}
                  placeholder="e.g. UTR2026123456789"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Must be unique across all payments</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  max={payModal.outstanding}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Max: {fmtINR(payModal.outstanding)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={payForm.paymentDate}
                  onChange={(e) => setPayForm({ ...payForm, paymentDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {recError && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-sm">
                {recError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setPayModal(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={!payForm.utrNumber.trim() || !payForm.amount || recLoading}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                {recLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {recLoading ? 'Recording…' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT LAYOUT: Sidebar + module switcher
// ════════════════════════════════════════════════════════════════════════════
function OpsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Determine first accessible module for this role
  const firstModule = NAV_ITEMS.find(
    (n) => n.roles.includes(user?.role || '') || user?.role === 'admin'
  )?.id || 'overview';

  const [activeModule, setActiveModule] = useState(firstModule);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const accessibleNav = NAV_ITEMS.filter(
    (n) => n.roles.includes(user?.role || '')
  );

  function handleLogout() { logout(); router.push('/login'); }

  const MODULE_COMPONENTS = {
    overview:     <OverviewModule />,
    sales:        <SalesModule />,
    sanction:     <SanctionModule />,
    disbursement: <DisbursementModule />,
    collection:   <CollectionModule />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} bg-white border-r border-gray-100 flex flex-col transition-all duration-200 shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg shrink-0" />
          {sidebarOpen && <span className="font-bold text-gray-900 text-sm">LendFlow</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {accessibleNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors
                ${activeModule === item.id
                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
              <span className="text-base shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 py-3">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors">
            <span className="shrink-0">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <span className="shrink-0">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Module content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {MODULE_COMPONENTS[activeModule]}
        </main>
      </div>
    </div>
  );
}

export default withAuth(OpsPage, ['admin', 'sales', 'sanction', 'disbursement', 'collection']);
