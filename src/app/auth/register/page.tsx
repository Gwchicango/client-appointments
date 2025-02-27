"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/api/apiService";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await apiService.post<{ message: string }>("/auth/register", {
        email,
        password,
      });

      if (response.status === 201) {
        router.push("/auth/login");
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center animated-background" style={{ backgroundImage: "url('/images/login.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">Regístrate</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Regístrate
            </button>
          </form>
          <p className="mt-4 text-center text-black">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;