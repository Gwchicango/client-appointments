"use client";

import React, { useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import GenericForm from '@/app/(components)/GenericForm';
import { doctorApi, DoctorPost } from '../doctorApi';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

const CreateDoctorPage: React.FC = () => {
  const [doctor, setDoctor] = useState<Partial<DoctorPost>>({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    specialty: '',
    availability: 'AVAILABLE',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newDoctor = {
        ...doctor,
      };

      const response = await doctorApi.createDoctor(newDoctor as DoctorPost);
      if (response.status === 200) {
        router.push('/pages/doctor');
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError('Error creating doctor');
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof DoctorPost; label: string; type: string; options?: { value: string; label: string; }[] }[] = [
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'lastname', label: 'Apellido', type: 'text' },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    { name: 'phone', label: 'Teléfono', type: 'text' },
    { name: 'specialty', label: 'Especialidad', type: 'text' },
    {
      name: 'availability',
      label: 'Disponibilidad',
      type: 'select',
      options: [
        { value: 'AVAILABLE', label: 'Disponible' },
        { value: 'BUSY', label: 'Ocupado' },
      ],
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin'] }>
      <PageTemplate loading={loading}>
        <GenericForm
          data={doctor}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          fields={fields}
          title="Añadir Nuevo Doctor"
        />
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default CreateDoctorPage;