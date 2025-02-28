import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../(context)/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    const role = localStorage.getItem('role');
    if (!token || !role || !allowedRoles.includes(role)) {
      router.push('dashboard');
    }
  }, [token, allowedRoles, router]);

  return <>{children}</>;
};

export default ProtectedRoute;