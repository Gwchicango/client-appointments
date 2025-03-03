"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const UnauthorizedPage: React.FC = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/pages/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">Acceso No Autorizado</h1>
      <p className="mb-4 text-lg text-gray-700">No tienes permiso para acceder a esta página.</p>
      <div className="flex space-x-4">
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Volver
        </button>
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Ir a la Página Principal
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;