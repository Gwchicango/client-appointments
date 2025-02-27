"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  return (
    <div className="relative min-h-screen animated-background" style={{ backgroundImage: "url('/images/landing.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <h1 className="text-5xl font-bold mb-8">Bienvenido a MedCitas</h1>
        <button
          onClick={handleLoginClick}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}