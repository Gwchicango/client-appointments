"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import GenericForm from '@/app/(components)/GenericForm';
import { appointmentApi, AppointmentPost } from '../appointmentsApi';
import { doctorApi, Doctor } from '../../doctor/doctorApi';
import { userApi, User } from '../../client/clientApi';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';

const CreateAppointmentPage: React.FC = () => {
  const [appointment, setAppointment] = useState<Partial<AppointmentPost>>({
    idPatient: 0, // Cadena vacía por defecto
    idDoctor: 0,  // Cadena vacía por defecto
    date: '',
    time: '',
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorsAndClients = async () => {
      try {
        const [doctorResponse, clientResponse] = await Promise.all([
          doctorApi.getDoctors(),
          userApi.getUsers(),
        ]);

        if (doctorResponse.status === 200 && doctorResponse.data) {
          // Filtra los doctores que están ocupados
          const availableDoctors = doctorResponse.data.filter((doctor: Doctor) => doctor.availability !== 'BUSY');
          setDoctors(availableDoctors);
        } else {
          setError(doctorResponse.statusText);
        }

        if (clientResponse.status === 200 && clientResponse.data) {
          setClients(clientResponse.data);
        } else {
          setError(clientResponse.statusText);
        }
      } catch (err) {
        setError('Error fetching doctors and clients');
      }
    };

    fetchDoctorsAndClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value, // Asigna el valor directamente (es una cadena)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verifica que idPatient e idDoctor no sean cadenas vacías
      if (!appointment.idPatient || !appointment.idDoctor) {
        throw new Error("Debe seleccionar un paciente y un doctor");
      }

      // Convierte idPatient e idDoctor a números
      const idPatient = Number(appointment.idPatient);
      const idDoctor = Number(appointment.idDoctor);

      // Verifica que la fecha y la hora sean válidas
      if (!appointment.date || !appointment.time) {
        throw new Error("Fecha y hora son requeridas");
      }

      // Combina la fecha y la hora en un formato válido
      const dateTimeString = `${appointment.date}T${appointment.time}`;
      const dateTime = dayjs(dateTimeString);

      if (!dateTime.isValid()) {
        throw new Error("Fecha u hora inválida");
      }

      const newAppointment = {
        ...appointment,
        idPatient, // Usa el valor convertido a número
        idDoctor,  // Usa el valor convertido a número
        date: dateTime.format('YYYY-MM-DD'), // Formato de fecha compatible con LocalDate
        time: dateTime.format('HH:mm'), // Formato de hora compatible con LocalTime
      };

      const response = await appointmentApi.createAppointment(newAppointment as AppointmentPost);
      if (response.status === 200) {
        router.push('/pages/appointments');
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating appointment');
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof AppointmentPost; label: string; type: string; options?: { value: string; label: string; }[] }[] = [
    {
      name: 'idPatient',
      label: 'Paciente',
      type: 'select',
      options: clients.map(client => ({ value: client.id.toString(), label: `${client.name} ${client.lastname}` })),
    },
    {
      name: 'idDoctor',
      label: 'Doctor',
      type: 'select',
      options: doctors.map(doctor => ({ value: doctor.id.toString(), label: `${doctor.name} ${doctor.lastname}` })),
    },
    { name: 'date', label: 'Fecha', type: 'date' },
    { name: 'time', label: 'Hora', type: 'time' },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'user']}>
      <PageTemplate loading={loading}>
        <GenericForm
          data={appointment}
          loading={loading}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          fields={fields}
          title="Añadir Nueva Cita"
        />
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default CreateAppointmentPage;