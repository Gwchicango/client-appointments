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
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log("Checking authentication and authorization...");
    const storedRole = localStorage.getItem('user_role');
    const storedToken = localStorage.getItem('access_token');

    // Actualiza el estado del rol
    setRole(storedRole);

    console.log("role", storedRole);
    console.log("token", storedToken);

    // Redirige al login si no hay token o rol
    if (!storedToken || !storedRole) {
      router.push('/auth/login');
    } else if (storedRole && allowedRoles.length > 0 && !allowedRoles.includes(storedRole)) {
      // Redirige si el rol no está permitido
      router.push('/auth/unauthorized'); // Puedes crear una página para roles no autorizados
    }
  }, [token, allowedRoles, router]);

  // Solo renderiza los hijos si el usuario está autenticado y autorizado
  if (!token || !role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    return null; // O muestra un mensaje de carga o acceso denegado
  }

  return <>{children}</>;
};

export default ProtectedRoute;