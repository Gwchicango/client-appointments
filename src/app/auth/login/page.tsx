"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userApi } from "@/app/pages/client/clientApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await userApi.getUsers();
      const users = response.data;

      if (users) {
        const user = users.find((user) => user.email === email && user.password === password);
        if (user) {
          // Manejar la respuesta exitosa aquí (por ejemplo, redirigir al usuario)
          //guaradar en el local storage el rol del usuario
          localStorage.setItem("role", user.role);
          router.push("/pages/dashboard");
        } else {
          setError("Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.");
        }
      } else {
        setError("Error al obtener los usuarios. Por favor, intenta nuevamente.");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
      console.error("Login error:", error);
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