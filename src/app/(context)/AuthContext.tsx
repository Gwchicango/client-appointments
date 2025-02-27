"use client";

import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  requestNewToken: (newOrgId?: number | null) => Promise<void>;
  orgId: null | number;
}

// Obtener el token inicial del localStorage
const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

// Crear el contexto de autenticación con el valor inicial del token
const AuthContext = createContext<AuthContextProps>({
  token: initialToken,
  setToken: () => {},
  requestNewToken: () => Promise.resolve(),
  orgId: null,
});

/**
 * El componente AuthProvider proporciona el contexto de autenticación a sus componentes hijos.
 * Administra el estado del token de autenticación y lo almacena en localStorage.
 * @param children - Los componentes hijos que tendrán acceso al contexto de autenticación.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter(); // Verificar si estamos en el cliente
  const [token, setToken] = useState<string | null>(initialToken);
  const [orgId, setOrgId] = useState<number | null>(null);

  // Efecto para manejar cambios en el token en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    if (!token) {
      return;
    }
    const decodedToken: { exp: number; iat: number; org: number | null } =
      jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // Si el token está caducado, eliminarlo y redirigir al usuario a la página de inicio de sesión
      setToken(null);
      localStorage.removeItem("access_token");
      //router.push("/auth/login");
      return;
    }

    localStorage.setItem("access_token", token ?? "");
    console.log(decodedToken);

    if (!decodedToken.org) {
      //router.push("/admin/organizations");
      return;
    }
    setOrgId(decodedToken.org);
  

  }, [token, router]);



  return (
    <AuthContext.Provider value={{ token, orgId, setToken, requestNewToken: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @returns El contexto de autenticación.
 */
export const useAuth = () => React.useContext(AuthContext);