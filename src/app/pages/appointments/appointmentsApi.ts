"use client";

import { apiService } from "@/api/apiService";

export interface Appointment {
  id: number;
  idPatient: number;
  idDoctor: number;
  date: string;
  time: string;
  status: string;
}

export interface AppointmentPost {
  idPatient: number;
  idDoctor: number;
  date: string;
  time: string;
  status?: string;
}

interface ApiResponse<T> {
  data: T | null;
  status: number;
  statusText: string;
}

interface ApiError {
  message: string;
  statusCode?: number;
  details?: string;
}

export const appointmentApi = {
  getAppointments: async (): Promise<ApiResponse<Appointment[]>> => {
    try {
      const response = await apiService.get<Appointment[]>("/appointment-service/appointments");
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || "Error fetching appointments",
        statusCode: (error as any).response?.status,
        details: (error as any).response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  getAppointmentById: async (id: number): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiService.get<Appointment>(`/appointment-service/appointments/${id}`);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error fetching appointment with id ${id}`,
        statusCode: (error as any).response?.status,
        details: (error as any).response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  createAppointment: async (appointment: AppointmentPost): Promise<ApiResponse<AppointmentPost>> => {
    try {
      const response = await apiService.post<AppointmentPost>("/appointment-service/appointments", appointment);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || "Error creating appointment",
        statusCode: (error as any).response?.status,
        details: (error as any).response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  updateAppointment: async (id: number, appointment: Appointment): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiService.put<Appointment>(`/appointment-service/appointments/${id}`, appointment);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error updating appointment with id ${id}`,
        statusCode: (error as any).response?.status,
        details: (error as any).response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  deleteAppointment: async (id: number): Promise<ApiResponse<Appointment>> => {
    try {
      const response = await apiService.delete<Appointment>(`/appointment-service/appointments/${id}`);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error deleting appointment with id ${id}`,
        statusCode: (error as any).response?.status,
        details: (error as any).response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },
};