"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../(context)/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, loading } = useAuth(); // Obtener el estado de carga
  const router = useRouter();
  const [role, setRole] = React.useState<string | null>(null);

  useEffect(() => {
    if (loading) return; // No hacer nada si aún está cargando

    const storedRole = localStorage.getItem("user_role");
    const storedToken = localStorage.getItem("access_token");

    // Actualiza el estado del rol
    setRole(storedRole);

    console.log("role", storedRole);

    // Redirige al login si no hay token o rol
    if (!storedToken) {
      console.log("No hay token o rol");
      router.push("/auth/login");
    } else if (storedRole && allowedRoles.length > 0 && !allowedRoles.includes(storedRole)) {
      // Redirige si el rol no está permitido
      router.push("/auth/unauthorized"); // Puedes crear una página para roles no autorizados
    }
  }, [token, allowedRoles, router, loading]); // Agregar loading como dependencia

  // Si está cargando, muestra un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>; // O un componente de carga
  }

  // Solo renderiza los hijos si el usuario está autenticado y autorizado
  if (!token || !role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    return null; // O muestra un mensaje de carga o acceso denegado
  }

  return <>{children}</>;
};

export default ProtectedRoute;