"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import GenericForm from '@/app/(components)/GenericForm';
import { doctorApi, DoctorPut, Doctor } from '../../doctorApi';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';
import { useParams } from 'next/navigation';

const EditDoctorPage: React.FC = () => {
  const [doctor, setDoctor] = useState<Partial<DoctorPut>>({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    availability: 'AVAILABLE',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) {
        setError('No doctor ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await doctorApi.getDoctorById(Number(id));
        if (response.status === 200 && response.data) {
          setDoctor(response.data);
        } else {
          setError(response.statusText);
        }
      } catch (err) {
        setError('Error fetching doctor');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

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
      const updatedDoctor = {
        ...doctor,
      };

      const response = await doctorApi.updateDoctor(Number(id), updatedDoctor as Doctor);
      if (response.status === 200) {
        router.push('/pages/doctor');
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError('Error updating doctor');
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof DoctorPut; label: string; type: string; options?: { value: string; label: string; }[] }[] = [
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'lastname', label: 'Apellido', type: 'text' },
    { name: 'email', label: 'Correo Electrónico', type: 'email' },
    { name: 'phone', label: 'Teléfono', type: 'text' },
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
    <ProtectedRoute allowedRoles={['admin']}>
      <PageTemplate loading={loading}>
        <GenericForm
          data={doctor}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          fields={fields}
          title="Editar Doctor"
        />
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default EditDoctorPage;