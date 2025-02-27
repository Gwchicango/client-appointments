"use client";

import { apiService } from "@/api/apiService";

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  address: string;
  birthdate: string;
  createdAt: string;
}

export interface UserPost {
  name: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  address: string;
  birthdate: string;
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

export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiService.get<User[]>("/patient-service/users");
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || "Error fetching users",
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

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    try {
      const response = await apiService.get<User>(`/patient-service/users/${id}`);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error fetching user with id ${id}`,
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

  createUser: async (user: UserPost): Promise<ApiResponse<UserPost>> => {
    try {
      const response = await apiService.post<UserPost>("/patient-service/users", user);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || "Error creating user",
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

  updateUser: async (id: number, user: User): Promise<ApiResponse<User>> => {
    try {
      const response = await apiService.put<User>(`/patient-service/users/${id}`, user);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error updating user with id ${id}`,
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

  deleteUser: async (id: number): Promise<ApiResponse<User>> => {
    try {
      const response = await apiService
      .delete<User>(`/patient-service/users/${id}`);
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: (error as any).message || `Error deleting user with id ${id}`,
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