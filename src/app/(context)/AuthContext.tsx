"use client";

import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  requestNewToken: (newOrgId?: number | null) => Promise<void>;
  loading: boolean;
}

const initialToken =
  typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

const AuthContext = createContext<AuthContextProps>({
  token: initialToken,
  setToken: () => {},
  requestNewToken: () => Promise.resolve(),
  loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleTokenChange = (newToken: string | null) => {
      if (!newToken) {
        setLoading(false);
        return;
      }

      try {
        const decodedToken: {
          exp: number;
          iat: number;
          resource_access?: {
            [key: string]: { roles: string[] };
          };
        } = jwtDecode(newToken);

        console.log("Token decodificado:", decodedToken); // Depuración

        // Verificar si el token ha expirado
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.warn("El token ha expirado.");
          //localStorage.removeItem("access_token");
          //localStorage.removeItem("user_role");
          setToken(null);
          router.push("/auth/login");
          return;
        }

        // Guardar el token en localStorage
        localStorage.setItem("access_token", newToken ?? "");

        // Extraer roles del token
        const clientRoles = decodedToken.resource_access?.["CimedClient"]?.roles || [];
        if (clientRoles.length > 0) {
          localStorage.setItem("user_role", clientRoles[1]); // Guardar el primer rol encontrado
          console.log("Rol del usuario:", clientRoles[1]); // Depuración
        } else {
          console.warn("No se encontraron roles en el token.");
        }
      } catch (error) {
        console.error("Error decodificando el token:", error);
      } finally {
        setLoading(false);
      }
    };

    handleTokenChange(token);
  }, [token, router]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, requestNewToken: async () => {}, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);