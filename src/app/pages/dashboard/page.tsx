"use client";

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import { FaUsers, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import { doctorApi, Doctor } from '@/app/pages/doctor/doctorApi';
import { userApi, User } from '@/app/pages/client/clientApi';
import { appointmentApi, Appointment } from '@/app/pages/appointments/appointmentsApi';
import GenericTable from '@/app/(components)/GenericTable';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("doctors");

  useEffect(() => {
    // Verificar si la página ya se ha recargado
    const hasReloaded = sessionStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      // Marcar que la página se ha recargado
      sessionStorage.setItem('hasReloaded', 'true');
      // Recargar la página
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorResponse, clientResponse, appointmentResponse] = await Promise.all([
          doctorApi.getDoctors(),
          userApi.getUsers(),
          appointmentApi.getAppointments(),
        ]);

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

        if (appointmentResponse.status === 200 && appointmentResponse.data) {
          setAppointments(appointmentResponse.data);
        } else {
          setError(appointmentResponse.statusText);
        }
      } catch (err) {
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter(appointment =>
    appointment.idPatient.toString().includes(searchTerm.toLowerCase()) ||
    appointment.idDoctor.toString().includes(searchTerm.toLowerCase()) ||
    appointment.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const doctorColumns: { key: keyof Doctor; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'lastname', label: 'Apellido' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'phone', label: 'Teléfono' },
    { key: 'specialty', label: 'Especialidad' },
  ];

  const clientColumns: { key: keyof User; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'lastname', label: 'Apellido' },
    { key: 'email', label: 'Correo Electrónico' },
    { key: 'phone', label: 'Teléfono' },
  ];

  const appointmentColumns: { key: keyof Appointment; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'idPatient', label: 'Paciente' },
    { key: 'idDoctor', label: 'Doctor' },
    { key: 'date', label: 'Fecha' },
    { key: 'time', label: 'Hora' },
    { key: 'status', label: 'Estado' },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin','user']}>
      <PageTemplate loading={loading}>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">¡Bienvenido al Panel de Control!</h2>
          <p className="mb-4">Aquí puedes encontrar un resumen de tus actividades y estadísticas.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'doctors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('doctors')}
            >
              Doctores
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('clients')}
            >
              Clientes
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'appointments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('appointments')}
            >
              Citas
            </button>
          </div>
          {activeTab === 'doctors' && (
            <div>
              <input
                type="text"
                placeholder="Buscar doctores..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <GenericTable data={filteredDoctors} columns={doctorColumns} />
            </div>
          )}
          {activeTab === 'clients' && (
            <div>
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <GenericTable data={filteredClients} columns={clientColumns} />
            </div>
          )}
          {activeTab === 'appointments' && (
            <div>
              <input
                type="text"
                placeholder="Buscar citas..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              <GenericTable data={filteredAppointments} columns={appointmentColumns} />
            </div>
          )}
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default DashboardPage;