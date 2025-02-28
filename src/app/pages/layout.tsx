"use client";
import { AuthProvider } from "../(context)/AuthContext";
import { HeroUIProvider } from "@heroui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <HeroUIProvider locale="es-ES">
        {children}
      </HeroUIProvider>
    </AuthProvider>
  );
}