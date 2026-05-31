/**
 * pages/index.tsx — Root redirect
 * Sends authenticated users to their correct home page,
 * unauthenticated users to /login.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';

export default function IndexPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else if (user?.role === 'borrower') {
      router.replace('/dashboard');
    } else {
      router.replace('/ops');
    }
  }, [user, router, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
