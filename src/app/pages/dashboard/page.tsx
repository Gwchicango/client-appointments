"use client";

import React, { useState, useEffect } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import { FaUsers, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import { doctorApi, Doctor } from '@/app/pages/doctor/doctorApi';
import { userApi, User } from '@/app/pages/client/clientApi';
import { appointmentApi, Appointment } from '@/app/pages/appointments/appointmentsApi';
import GenericTable from '@/app/(components)/GenericTable';

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <PageTemplate loading={loading}>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h2>
        <p className="mb-4">Here you can find an overview of your activities and statistics.</p>
      </div>
      <div className="space-y-4 text-black">
        <div className="bg-blue-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <FaUserMd className="text-4xl mr-4" />
            <h3 className="text-xl font-bold">Doctores</h3>
          </div>
          <div>
            <GenericTable data={doctors} columns={doctorColumns} />
          </div>
        </div>
        <div className="bg-green-500  p-4 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <FaUsers className="text-4xl mr-4" />
            <h3 className="text-xl font-bold">Clientes</h3>
          </div>
          <div>
            <GenericTable data={clients} columns={clientColumns} />
          </div>
        </div>
        <div className="bg-red-500 p-4 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-4xl mr-4" />
            <h3 className="text-xl font-bold">Citas</h3>
          </div>
          <div>
            <GenericTable data={appointments} columns={appointmentColumns} />
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default DashboardPage;