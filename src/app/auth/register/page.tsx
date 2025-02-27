"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/app/pages/client/clientApi";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await userApi.createUser({
        name,
        lastname,
        email,
        username,
        password,
        role: "PATIENT",
        phone,
        address,
        birthdate,
      });

      if (response.status === 200) {
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-black">
        <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-lg border border-gray-300 max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">Regístrate</h1>
          <form onSubmit={handleRegister}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="lastname">Apellido</label>
                <input
                  type="text"
                  id="lastname"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tu apellido"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
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
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="username">Nombre de Usuario</label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
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
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="phone">Teléfono</label>
                <input
                  type="text"
                  id="phone"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tu teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tu dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="birthdate">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="birthdate"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>
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