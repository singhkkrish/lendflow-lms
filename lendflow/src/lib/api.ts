/**
 * API Client — centralized fetch wrapper
 * Drop this in: src/lib/api.ts
 *
 * Usage:
 *   import api from '@/lib/api';
 *   const data = await api.get('/loans/my');
 *   const data = await api.post('/auth/login', { email, password });
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lf_token');
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData
      ? (body as FormData)
      : body
      ? JSON.stringify(body)
      : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string }).message || 'Request failed',
      res.status,
      data
    );
  }

  return data as T;
}

const api = {
  get:    <T>(path: string)                     => request<T>('GET', path),
  post:   <T>(path: string, body: unknown)      => request<T>('POST', path, body),
  patch:  <T>(path: string, body: unknown)      => request<T>('PATCH', path, body),
  delete: <T>(path: string)                     => request<T>('DELETE', path),
  upload: <T>(path: string, formData: FormData) => request<T>('POST', path, formData, true),
};

export { ApiError };
export default api;