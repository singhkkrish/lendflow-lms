import { useState, useEffect, useCallback } from 'react';
import api, { ApiError } from '@/lib/api';
import {
  Loan, LoanWithPayments, LoanDetailResponse, AdminLoansResponse,
  SanctionLoansResponse, LeadsResponse, PaymentResponse,
  UploadResponse, LoanApplyPayload, User,
} from '@/types';
 
// ── Generic async hook ────────────────────────────────────────────────────────
function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
 
  useEffect(() => { execute(); }, [execute]);
 
  return { data, loading, error, refetch: execute };
}
 
// ── BORROWER HOOKS ────────────────────────────────────────────────────────────
 
/** Fetch borrower's own loans */
export function useMyLoans() {
  return useAsync<{ loans: LoanWithPayments[] }>(
    () => api.get('/loans/my'),
    []
  );
}
 
/** Fetch a single loan by ID with payment history */
export function useLoanDetail(id: string) {
  return useAsync<LoanDetailResponse>(
    () => api.get(`/loans/${id}`),
    [id]
  );
}
 
/** Submit a loan application */
export function useApplyLoan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breErrors, setBreErrors] = useState<string[]>([]);
 
  const apply = async (payload: LoanApplyPayload): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    setBreErrors([]);
    try {
      const data = await api.post<{ loan: Loan; message: string }>('/loans/apply', payload);
      return data.loan;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 422) {
          // BRE failure — extract individual rule errors
          const d = err.data as { errors?: string[] };
          setBreErrors(d?.errors || [err.message]);
        } else {
          setError(err.message);
        }
      } else {
        setError('Application failed. Please try again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
 
  return { apply, loading, error, breErrors };
}
 
/** Upload salary slip */
export function useUploadSalarySlip() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const upload = async (file: File): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await api.upload<UploadResponse>('/upload/salary-slip', formData);
      return data.url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed.');
      return null;
    } finally {
      setLoading(false);
    }
  };
 
  return { upload, loading, error };
}
 
// ── SANCTION HOOKS ────────────────────────────────────────────────────────────
 
/** Fetch pending applications for sanction module */
export function useSanctionLoans() {
  return useAsync<SanctionLoansResponse>(
    () => api.get('/loans/ops/sanction'),
    []
  );
}
 
/** Approve or reject a loan */
export function useSanctionAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const action = async (
    loanId: string,
    act: 'approve' | 'reject',
    rejectionReason?: string
  ): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.patch<{ loan: Loan }>(`/loans/${loanId}/sanction`, {
        action: act,
        rejectionReason,
      });
      return data.loan;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Action failed.');
      return null;
    } finally {
      setLoading(false);
    }
  };
 
  return { action, loading, error };
}
 
// ── DISBURSEMENT HOOKS ────────────────────────────────────────────────────────
 
/** Fetch sanctioned loans ready for disbursement */
export function useDisbursementLoans() {
  return useAsync<SanctionLoansResponse>(
    () => api.get('/loans/ops/disbursement'),
    []
  );
}
 
/** Mark a loan as disbursed */
export function useDisburse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const disburse = async (loanId: string): Promise<Loan | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.patch<{ loan: Loan }>(`/loans/${loanId}/disburse`, {});
      return data.loan;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Disbursement failed.');
      return null;
    } finally {
      setLoading(false);
    }
  };
 
  return { disburse, loading, error };
}
 
// ── COLLECTION HOOKS ──────────────────────────────────────────────────────────
 
/** Fetch active loans for collection */
export function useCollectionLoans() {
  return useAsync<{ loans: LoanWithPayments[]; count: number }>(
    () => api.get('/loans/ops/collection'),
    []
  );
}
 
/** Record a payment */
export function useRecordPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const record = async (payload: {
    loanId: string;
    utrNumber: string;
    amount: number;
    paymentDate?: string;
  }): Promise<PaymentResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<PaymentResponse>('/payments', payload);
      return data;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment failed.');
      return null;
    } finally {
      setLoading(false);
    }
  };
 
  return { record, loading, error };
}
 
// ── SALES HOOKS ───────────────────────────────────────────────────────────────
 
/** Fetch leads (borrowers who haven't applied) */
export function useLeads(search = '', page = 1) {
  return useAsync<LeadsResponse>(
    () => api.get(`/users/leads?search=${encodeURIComponent(search)}&page=${page}&limit=10`),
    [search, page]
  );
}
 
// ── ADMIN HOOKS ───────────────────────────────────────────────────────────────
 
/** Fetch all loans + KPIs for admin dashboard */
export function useAdminLoans(status = 'all', page = 1) {
  return useAsync<AdminLoansResponse>(
    () => api.get(`/loans?status=${status}&page=${page}&limit=20`),
    [status, page]
  );
}
 
/** Fetch all users */
export function useAllUsers() {
  return useAsync<{ users: User[] }>(
    () => api.get('/users'),
    []
  );
}
 
/** Fetch payments for a specific loan */
export function useLoanPayments(loanId: string) {
  return useAsync<{ payments: unknown[]; totalPaid: number; outstanding: number }>(
    () => api.get(`/payments/loan/${loanId}`),
    [loanId]
  );
}