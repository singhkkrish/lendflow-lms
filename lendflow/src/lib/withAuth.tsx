import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';
import { UserRole } from '@/types';
 
export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
 
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }
 
    if (allowedRoles && allowedRoles.length > 0) {
      const role = user?.role;
      // Admin bypasses all role checks
      if (role !== 'admin' && !allowedRoles.includes(role as UserRole)) {
        // Redirect to appropriate home page
        if (role === 'borrower') router.replace('/dashboard');
        else router.replace('/ops');
      }
    }
  }, [user, allowedRoles, router, isAuthenticated]);
 
  return { user, isAuthenticated: isAuthenticated() };
}
 
function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  const AuthGuard = (props: P) => {
    const { isAuthenticated } = useRequireAuth(allowedRoles);
 
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
 
    return <WrappedComponent {...props} />;
  };
 
  AuthGuard.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  return AuthGuard;
}
 
export default withAuth;