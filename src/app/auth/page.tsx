"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Obtener la ruta actual
    const path = window.location.pathname;

    // Redirigir según la ruta actual
    if (path.endsWith('/auth/login')) {
      router.push('/auth/login');
    } else if (path.endsWith('/auth/register')) {
      router.push('/auth/register');
    } else {
      // Redirigir a una página por defecto si la ruta no coincide
      router.push('/auth/login');
    }
  }, [router]);

  return null; // No mostrar nada mientras se redirige
}