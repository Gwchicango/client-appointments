"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-cover bg-center animated-background" style={{ backgroundImage: "url('/images/login.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">Iniciar Sesión</h1>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tu correo electrónico"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tu contraseña"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
          <p className="mt-4 text-center text-black">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}