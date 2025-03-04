"use client";

import React, { useEffect, useState } from 'react';
import PageTemplate from '@/app/(components)/PageTemplate';
import GenericForm from '@/app/(components)/GenericForm';
import { appointmentApi, Appointment } from '../../appointmentsApi';
import { doctorApi, Doctor } from '../../../doctor/doctorApi';
import { userApi, User } from '../../../client/clientApi';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import ProtectedRoute from '@/app/(components)/ProtectedRoute';
import { useParams } from 'next/navigation';

const EditAppointmentPage: React.FC = () => {
  const [appointment, setAppointment] = useState<Partial<Appointment>>({
    idPatient: 0,
    idDoctor: 0,
    date: '',
    time: '',
    status: '',
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('No appointment ID provided');
        setLoading(false);
        return;
      }

      try {
        const [appointmentResponse, doctorResponse, clientResponse] = await Promise.all([
          appointmentApi.getAppointmentById(Number(id)),
          doctorApi.getDoctors(),
          userApi.getUsers(),
        ]);

        if (appointmentResponse.status === 200 && appointmentResponse.data) {
          setAppointment(appointmentResponse.data);
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
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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

      const updatedAppointment = {
        ...appointment,
        date: dateTime.format('YYYY-MM-DD'), // Formato de fecha compatible con LocalDate
        time: dateTime.format('HH:mm'), // Formato de hora compatible con LocalTime
      };

      const response = await appointmentApi.updateAppointment(Number(id), updatedAppointment as Appointment);
      if (response.status === 200) {
        // Actualiza la disponibilidad del doctor según el estado de la cita
        const doctorId = updatedAppointment.idDoctor;
        if (doctorId) {
          let availability = 'AVAILABLE';
          if (updatedAppointment.status === 'CONFIRMED') {
            availability = 'BUSY';
          }
          const doctorToUpdate = doctors.find(doc => doc.id === doctorId);
          if (doctorToUpdate) {
            await doctorApi.updateDoctor(doctorId, { ...doctorToUpdate, availability });
          }
        }
        router.push('/pages/appointments');
      } else {
        setError(response.statusText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating appointment');
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof Appointment; label: string; type: string; options?: { value: string; label: string; }[] }[] = [
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
    { name: 'status', label: 'Estado', type: 'select', options: [
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'CONFIRMED', label: 'Confirmada' },
      { value: 'CANCELLED', label: 'Cancelada' },
    ] },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PageTemplate loading={loading}>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Editar Cita</h2>
          <GenericForm
            data={appointment}
            loading={loading}
            error={error}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            fields={fields}
            title="Editar Cita"
          />
        </div>
      </PageTemplate>
    </ProtectedRoute>
  );
};

export default EditAppointmentPage;