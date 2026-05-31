import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';
import { useMyLoans } from '@/hooks/useApi';
import withAuth from '@/lib/withAuth';
 
const fmtINR = (n) => '₹' + Number(n).toLocaleString('en-IN');
 
const STATUS_STYLES = {
  pending:    'bg-yellow-100 text-yellow-700',
  sanctioned: 'bg-blue-100 text-blue-700',
  disbursed:  'bg-green-100 text-green-700',
  rejected:   'bg-red-100 text-red-700',
  closed:     'bg-gray-100 text-gray-600',
};
 
const STATUS_TABS = ['All', 'Pending', 'Sanctioned', 'Active', 'Closed', 'Rejected'];
 
function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data, loading, error, refetch } = useMyLoans();
  const [activeTab, setActiveTab] = useState('All');
  const [expandedLoan, setExpandedLoan] = useState(null);
 
  const loans = data?.loans || [];
 
  // KPIs
  const totalBorrowed = loans.reduce((s, l) => s + l.amount, 0);
  const totalRepaid   = loans.reduce((s, l) => s + (l.totalPaid || 0), 0);
  const activeLoans   = loans.filter((l) => l.status === 'disbursed').length;
 
  // Tab filter
  const TAB_MAP = { All: null, Pending: 'pending', Sanctioned: 'sanctioned', Active: 'disbursed', Closed: 'closed', Rejected: 'rejected' };
  const filtered = TAB_MAP[activeTab]
    ? loans.filter((l) => l.status === TAB_MAP[activeTab])
    : loans;
 
  function handleLogout() { logout(); router.push('/login'); }
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg" />
          <span className="font-bold text-gray-900">LendFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <Link href="/apply"
            className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
            + New Application
          </Link>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>
 
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mb-6">Track your loan applications and repayments</p>
 
        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Loans',    value: loans.length,          icon: '📋' },
            { label: 'Active Loans',   value: activeLoans,            icon: '📊' },
            { label: 'Total Borrowed', value: fmtINR(totalBorrowed), icon: '💰' },
            { label: 'Total Repaid',   value: fmtINR(totalRepaid),   icon: '✅' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="text-2xl mb-1">{k.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{k.value}</p>
              <p className="text-xs text-gray-500">{k.label}</p>
            </div>
          ))}
        </div>
 
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {STATUS_TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
 
        {/* Loan list */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
 
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error} — <button onClick={refetch} className="underline">retry</button>
          </div>
        )}
 
        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mb-4">Start your first loan application to see it here</p>
            <Link href="/apply"
              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700">
              + Apply for a Loan
            </Link>
          </div>
        )}
 
        <div className="space-y-3">
          {filtered.map((loan) => {
            const pct = loan.totalRepayment > 0
              ? Math.min(100, Math.round(((loan.totalPaid || 0) / loan.totalRepayment) * 100))
              : 0;
            const isExpanded = expandedLoan === loan._id;
 
            return (
              <div key={loan._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedLoan(isExpanded ? null : loan._id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-lg">💼</div>
                    <div>
                      <p className="text-xs text-gray-400 font-mono">{loan.applicationId}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[loan.status]}`}>
                        ● {loan.status}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-semibold text-gray-900">{fmtINR(loan.amount)}</p>
                      <p className="text-xs text-gray-400">{loan.tenure} days</p>
                    </div>
                  </div>
 
                  <div className="flex items-center gap-6">
                    {['disbursed', 'closed'].includes(loan.status) && (
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-gray-400 mb-1">
                          Total Repayment  Paid  {pct}%
                        </p>
                        <div className="w-32 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{fmtINR(loan.totalRepayment)}</p>
                      </div>
                    )}
                    <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▶'}</span>
                  </div>
                </div>
 
                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
                      <div><p className="text-gray-400 text-xs">Amount</p><p className="font-semibold">{fmtINR(loan.amount)}</p></div>
                      <div><p className="text-gray-400 text-xs">Interest</p><p className="font-semibold text-orange-600">{fmtINR(loan.interest)}</p></div>
                      <div><p className="text-gray-400 text-xs">Total Due</p><p className="font-semibold">{fmtINR(loan.totalRepayment)}</p></div>
                      <div><p className="text-gray-400 text-xs">Outstanding</p><p className="font-semibold text-red-600">{fmtINR(loan.outstanding || 0)}</p></div>
                    </div>
 
                    {loan.status === 'rejected' && loan.rejectionReason && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
                        <strong>Rejection reason:</strong> {loan.rejectionReason}
                      </div>
                    )}
 
                    {loan.recentPayments?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Payments</p>
                        <div className="space-y-1">
                          {loan.recentPayments.map((p) => (
                            <div key={p._id} className="flex justify-between text-sm">
                              <span className="font-mono text-gray-500 text-xs">{p.utrNumber}</span>
                              <span className="font-semibold text-green-600">{fmtINR(p.amount)}</span>
                              <span className="text-gray-400 text-xs">{new Date(p.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
 
export default withAuth(DashboardPage, ['borrower']);