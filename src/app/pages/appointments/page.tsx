"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import ConfirmModal from '@/app/(components)/ConfirmModal';
import GenericTable from '@/app/(components)/GenericTable';
import { appointmentApi, Appointment } from './appointmentsApi';
import { doctorApi, Doctor } from '@/app/pages/doctor/doctorApi';
import { userApi, User } from '@/app/pages/client/clientApi';
import Link from 'next/link';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

const AppointmentListPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const role = localStorage.getItem('role');
  const userId = Number(localStorage.getItem('idUser'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentResponse, doctorResponse, clientResponse] = await Promise.all([
          appointmentApi.getAppointments(),
          doctorApi.getDoctors(),
          userApi.getUsers(),
        ]);

        if (appointmentResponse.status === 200 && appointmentResponse.data) {
          let fetchedAppointments = appointmentResponse.data;
          if (role === 'PATIENT') {
            fetchedAppointments = fetchedAppointments.filter((appointment: Appointment) => appointment.idPatient === userId);
          }
          setAppointments(fetchedAppointments);
        } else {
          setError(appointmentResponse.statusText);
        }

        if (doctorResponse.status === 200 && doctorResponse.data) {
          setDoctors(doctorResponse.data);
        } else {
          setError(doctorResponse.statusText);
        }

        if (clientResponse.status === 200 && clientResponse.data) {
          setClients(clientResponse.data);
        } else {
          setError(clientResponse.statusText);
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, userId]);

  const handleDelete = async (id: number) => {
    try {
      const response = await appointmentApi.deleteAppointment(id);
      if (response.status === 200) {
        setAppointments(appointments.filter((appointment) => appointment.id !== id));
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError('Error deleting appointment');
    } finally {
      setIsModalOpen(false);
    }
  };

  const openModal = (id: number) => {
    setSelectedAppointmentId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const confirmDelete = () => {
    if (selectedAppointmentId !== null) {
      handleDelete(selectedAppointmentId);
    }
  };

  const getDoctorName = (id: number) => {
    const doctor = doctors.find((doctor) => doctor.id === id);
    return doctor ? `${doctor.name} ${doctor.lastname}` : 'Desconocido';
  };

  const getClientName = (id: number) => {
    const client = clients.find((client) => client.id === id);
    return client ? `${client.name} ${client.lastname}` : 'Desconocido';
  };

  const columns: { key: keyof Appointment | 'doctorName' | 'clientName'; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'clientName', label: 'Paciente' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Fecha' },
    { key: 'time', label: 'Hora' },
    { key: 'status', label: 'Estado' },
  ];

  const data = appointments.map((appointment) => ({
    ...appointment,
    clientName: getClientName(appointment.idPatient),
    doctorName: getDoctorName(appointment.idDoctor),
  }));

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}>
      <PageTemplate loading={loading}>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Lista de Citas</h2>
              <p>Aquí puedes encontrar una lista de todas las citas registradas en el sistema.</p>
            </div>
              <Link href="appointments/create" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Añadir Nueva Cita
              </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <GenericTable
            data={data}
            columns={columns}
            actions={(appointment) => (
              <>
                <Link href={`appointments/edit/${appointment.id}`}>
                  <span className="bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer">
                    Editar
                  </span>
                </Link>
                <button
                  onClick={() => openModal(appointment.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors ml-2"
                >
                  Cancelar
                </button>
              </>
            )}
          />
        </div>
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          title="Confirmar Cancelación"
          message="¿Estás seguro de que deseas cancelar esta cita?"
        />
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default AppointmentListPage;