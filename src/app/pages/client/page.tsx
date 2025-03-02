"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import ConfirmModal from '@/app/(components)/ConfirmModal';
import GenericTable from '@/app/(components)/GenericTable';
import { userApi, User } from './clientApi';
import Link from 'next/link';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await userApi.getUsers();
        if (response.status === 200 && response.data) {
          setClients(response.data);
        } else {
          setError(response.statusText);
        }
      } catch (err) {
        setError('Error fetching clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await userApi.deleteUser(id);
      if (response.status === 200) {
        setClients(clients.filter((client) => client.id !== id));
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError('Error deleting client');
    } finally {
      setIsModalOpen(false);
    }
  };

  const openModal = (id: number) => {
    setSelectedClientId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedClientId(null);
  };

  const confirmDelete = () => {
    if (selectedClientId !== null) {
      handleDelete(selectedClientId);
    }
  };

  const columns: { key: keyof User; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'lastname', label: 'Apellido' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'username', label: 'Nombre de Usuario' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'address', label: 'Dirección' },
    { key: 'birthdate', label: 'Fecha de Nacimiento' },
    //{ key: 'createdAt', label: 'Creado el' },
  ];

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <PageTemplate loading={loading}>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Lista de Clientes</h2>
              <p>Aquí puedes encontrar una lista de todos los clientes registrados en el sistema.</p>
            </div>
            <Link href="client/create" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Añadir Nuevo Cliente
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <GenericTable
            data={clients}
            columns={columns}
            actions={(client) => (
              <>
                <Link href={`client/edit/${client.id}`}>
                  <span className="bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer">
                    Editar
                  </span>
                </Link>
                <button
                  onClick={() => openModal(client.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </>
            )}
          />
        </div>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que deseas eliminar este cliente?"
        />
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default ClientListPage;