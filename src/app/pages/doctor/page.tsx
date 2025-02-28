"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import ConfirmModal from '@/app/(components)/ConfirmModal';
import GenericTable from '@/app/(components)/GenericTable';
import { doctorApi, Doctor } from './doctorApi';
import Link from 'next/link';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

const DoctorListPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorApi.getDoctors();
        if (response.status === 200 && response.data) {
          setDoctors(response.data);
        } else {
          setError(response.statusText);
        }
      } catch (err) {
        setError('Error fetching doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await doctorApi.deleteDoctor(id);
      if (response.status === 200) {
        setDoctors(doctors.filter((doctor) => doctor.id !== id));
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError('Error deleting doctor');
    } finally {
      setIsModalOpen(false);
    }
  };

  const openModal = (id: number) => {
    setSelectedDoctorId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctorId(null);
  };

  const confirmDelete = () => {
    if (selectedDoctorId !== null) {
      handleDelete(selectedDoctorId);
    }
  };

  const columns: { key: keyof Doctor; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'lastname', label: 'Apellido' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'specialty', label: 'Especialidad' },
    { key: 'availability', label: 'Disponibilidad' },
    //{ key: 'createdAt', label: 'Creado el' },
  ];

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}>
      <PageTemplate loading={loading}>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Lista de Doctores</h2>
              <p>Aquí puedes encontrar una lista de todos los doctores registrados en el sistema.</p>
            </div>
            <Link href="doctor/create" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              Añadir Nuevo Doctor
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <GenericTable
            data={doctors}
            columns={columns}
            actions={(doctor) => (
              <>
                <Link href={`doctor/edit/?id=${doctor.id}`}>
                  <span className="bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer">
                    Editar
                  </span>
                </Link>
                <button
                  onClick={() => openModal(doctor.id)}
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
          message="¿Estás seguro de que deseas eliminar este doctor?"
        />
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default DoctorListPage;