"use client";

import { apiService } from "@/api/apiService";

export interface Doctor {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  specialty: string;
  availability: string;
  // Otros campos relevantes
}

export interface DoctorPut {
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  specialty?: string;
  availability: string;
  // Otros campos relevantes
}

export interface DoctorPost {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  specialty: string;
  availability: string;
  // Otros campos relevantes
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

export const doctorApi = {
  getDoctors: async (): Promise<ApiResponse<Doctor[]>> => {
    try {
      const response = await apiService.get<Doctor[]>("/doctor-service/doctors");
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || "Error fetching doctors",
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

  getDoctorById: async (id: number): Promise<ApiResponse<Doctor>> => {
    try {
      const response = await apiService.get<Doctor>(`/doctor-service/doctors/${id}`);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error fetching doctor with id ${id}`,
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

  createDoctor: async (doctor: DoctorPost): Promise<ApiResponse<DoctorPost>> => {
    try {
      const response = await apiService.post<DoctorPost>("/doctor-service/doctors", doctor);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || "Error creating doctor",
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

  updateDoctor: async (id: number, doctor: Doctor): Promise<ApiResponse<Doctor>> => {
    try {
      const response = await apiService.put<Doctor>(`/doctor-service/doctors/${id}`, doctor);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error updating doctor with id ${id}`,
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

  deleteDoctor: async (id: number): Promise<ApiResponse<Doctor>> => {
    try {
      const response = await apiService.delete<Doctor>(`/doctor-service/doctors/${id}`);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error deleting doctor with id ${id}`,
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