"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(context)/AuthContext"; // Importa el contexto de autenticación

interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface ErrorResponse {
  error: string;
  error_description: string;
}


const authenticateUser = async (username: string, password: string): Promise<TokenData> => {
  const params = new URLSearchParams();
  params.append("grant_type", process.env.NEXT_PUBLIC_GRANT_TYPE || "password");
  params.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID || "CimedClient");
  params.append("client_secret", process.env.NEXT_PUBLIC_CLIENT_SECRET || "Pys0RdtC11sGfT6JlqvMUOn39rWEpEBQ");
  params.append("username", username);
  params.append("password", password);
  params.append("scope", process.env.NEXT_PUBLIC_SCOPE || "openid");

  const response = await fetch(process.env.NEXT_PUBLIC_TOKEN_URL || "http://172.172.141.223:8040/realms/CimedRealm/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data: TokenData = await response.json();
      return data;
    } else {
      throw new Error("Formato de respuesta inesperado");
    }
  } else {
    const errorText = await response.text();
    try {
      const error: ErrorResponse = JSON.parse(errorText);
      throw new Error(error.error_description || "Error al autenticar");
    } catch (e) {
      throw new Error("Error al autenticar: " + errorText);
    }
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth(); // Usa el contexto de autenticación

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const tokenData: TokenData = await authenticateUser(email, password);
      // Guarda el token en el almacenamiento local
      localStorage.setItem("access_token", tokenData.access_token);
      setToken(tokenData.access_token); // Actualiza el estado del token en el contexto

      // Redirige al usuario al dashboard
      router.push("/pages/dashboard");
    } catch (error) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center animated-background" style={{ backgroundImage: "url('/images/login.png')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-black">
        <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">Iniciar Sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-black py-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
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