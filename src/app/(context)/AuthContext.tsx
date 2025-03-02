"use client";

import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  requestNewToken: (newOrgId?: number | null) => Promise<void>;
}

// Obtener el token inicial del localStorage
const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

// Crear el contexto de autenticación con el valor inicial del token
const AuthContext = createContext<AuthContextProps>({
  token: initialToken,
  setToken: () => {},
  requestNewToken: () => Promise.resolve(),
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

  // Efecto para manejar cambios en el token en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    if (!token) {
      return;
    }
    const decodedToken: { exp: number; iat: number; resource_access: { [key: string]: { roles: string[] } } } = jwtDecode(token);

    // Guardar el token y el rol en localStorage
    localStorage.setItem("access_token", token ?? "");
    const roles = decodedToken.resource_access?.CimedClient?.roles || [];
    if (roles.length > 0) {
      localStorage.setItem("user_role", roles[0]); // Guardar el primer rol encontrado
    }
    console.log(decodedToken);
  }, [token, router]);

  return (
    <AuthContext.Provider value={{ token, setToken, requestNewToken: async () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * @returns El contexto de autenticación.
 */
export const useAuth = () => React.useContext(AuthContext);