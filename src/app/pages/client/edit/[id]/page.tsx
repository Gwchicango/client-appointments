"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import GenericForm from '@/app/(components)/GenericForm';
import { userApi, User } from '../../clientApi';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';
import { useParams } from 'next/navigation';

const EditClientPage: React.FC = () => {
  const [client, setClient] = useState<Partial<User>>({
    name: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    role: 'PATIENT',
    phone: '',
    address: '',
    birthdate: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) {
        setError('No client ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await userApi.getUserById(Number(id));
        if (response.status === 200 && response.data) {
          setClient(response.data);
        } else {
          setError(response.statusText);
        }
      } catch (err) {
        setError('Error fetching client');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClient((prevClient: Partial<User>) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedClient = {
        ...client,
        birthdate: dayjs(client.birthdate).format('YYYY-MM-DD'), // Formato de fecha compatible con LocalDate
      };

      const response = await userApi.updateUser(Number(id), updatedClient as User);
      if (response.status === 200) {
        router.push('/pages/client');
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError('Error updating client');
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof User; label: string; type: string; options?: { value: string; label: string; }[] }[] = [
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'lastname', label: 'Apellido', type: 'text' },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    { name: 'username', label: 'Nombre de Usuario', type: 'text' },
    { name: 'password', label: 'Contraseña', type: 'password' },
    { name: 'role', label: 'Rol', type: 'select', options: [
      { value: 'admin', label: 'Admin' },
      { value: 'PATIENT', label: 'Paciente' },
    ] },
    { name: 'phone', label: 'Teléfono', type: 'text' },
    { name: 'address', label: 'Dirección', type: 'text' },
    { name: 'birthdate', label: 'Fecha de Nacimiento', type: 'date' },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PageTemplate loading={loading}>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
          <GenericForm
            data={client}
            loading={loading}
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            fields={fields}
            title="Editar Cliente"
          />
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default EditClientPage;