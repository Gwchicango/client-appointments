"use client";
import { AuthProvider, useAuth } from "../(context)/AuthContext";
import { useEffect } from "react";
// Asegúrate de que el nombre del módulo esté escrito correctamente
import { HeroUIProvider } from "@heroui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();

  useEffect(() => {
    if (!token && window.location.pathname.includes("/auth/login")) {
      window.location.replace("/auth/login");
    }
  }, [token]);

  return (
    <AuthProvider>
      <HeroUIProvider locale="es-ES">{children}</HeroUIProvider>
    </AuthProvider>
  );
}