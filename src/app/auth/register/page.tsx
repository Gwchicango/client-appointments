"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const getAdminToken = async () => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials"); // Flujo de client_credentials
  params.append("client_id", "CimedClient"); // ID del cliente
  params.append("client_secret", "Pys0RdtC11sGfT6JlqvMUOn39rWEpEBQ"); // Client secret

  const response = await fetch(
    "http://172.172.141.223:8040/realms/CimedRealm/protocol/openid-connect/token", // Endpoint de token
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.access_token; // Retorna el token de acceso
  } else {
    throw new Error("Error al obtener el token de administrador");
  }
};

interface UserCredentials {
  type: string;
  value: string;
  temporary: boolean;
}

interface UserData {
  username: string;
  email: string;
  enabled: boolean;
  credentials: UserCredentials[];
}

const registerUser = async (username: string, email: string, password: string): Promise<Response> => {
  const userData: UserData = {
    username: username,
    email: email,
    enabled: true,
    credentials: [
      {
        type: "password",
        value: password,
        temporary: false,
      },
    ],
  };

  const token = await getAdminToken();

  const response = await fetch(
    "http://172.172.141.223:8040/admin/realms/CimedRealm/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  return response;
};

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await registerUser(username, email, password);
      if (response.ok) {
        setSuccess("Usuario registrado correctamente.");
        setError(null);
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        setError(errorData.errorMessage || "Error al registrar el usuario.");
        setSuccess(null);
      }
    } catch (err) {
      setError("Error en la solicitud. Inténtalo de nuevo.");
      setSuccess(null);
      console.error("Error:", err);
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
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
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