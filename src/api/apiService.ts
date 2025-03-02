"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("La variable de entorno API_URL no está definida");
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

const axiosInstance = axios.create({
  baseURL: API_URL,
});

/**
 * Interceptor de solicitudes para agregar el token de autorización a las cabeceras.
 */
const addAuthInterceptor = (instance: any) => {
  instance.interceptors.request.use(async (config: any) => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  });
};

addAuthInterceptor(axiosInstance);

// Método para redirigir al login y borrar el token del localStorage
const redirectToLogin = () => {
  //localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  //window.location.href = "/auth/login";
};

/**
 * Servicio API para realizar solicitudes HTTP.
 */
const createApiService = (instance: any) => ({
  get: async <T>(path: string): Promise<ApiResponse<T>> => {
    try {
      const response = await (instance as typeof axios).get<T>(path);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        redirectToLogin();
        return {
          data: null,
          status: 401,
          statusText: "Unauthorized",
        };
      }
      const apiError: ApiError = {
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Error al obtener datos",
        statusCode: axiosError.response?.status,
        details: axiosError.response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  post: async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
    try {
      const response = await (instance as typeof axios).post<T>(path, body);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        redirectToLogin();
        return {
          data: null,
          status: 401,
          statusText: "Unauthorized",
        };
      }
      const apiError: ApiError = {
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Error al enviar datos",
        statusCode: axiosError.response?.status,
        details: axiosError.response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  put: async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
    try {
      const response = await (instance as typeof axios).put<T>(path, body);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        redirectToLogin();
        return {
          data: null,
          status: 401,
          statusText: "Unauthorized",
        };
      }
      const apiError: ApiError = {
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Error al actualizar datos",
        statusCode: axiosError.response?.status,
        details: axiosError.response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  patch: async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
    try {
      const response = await (instance as typeof axios).patch<T>(path, body);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        redirectToLogin();
        return {
          data: null,
          status: 401,
          statusText: "Unauthorized",
        };
      }
      const apiError: ApiError = {
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Error al modificar datos",
        statusCode: axiosError.response?.status,
        details: axiosError.response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },

  delete: async <T>(path: string): Promise<ApiResponse<T>> => {
    try {
      const response = await instance.delete(path);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 401) {
        redirectToLogin();
        return {
          data: null,
          status: 401,
          statusText: "Unauthorized",
        };
      }
      const apiError: ApiError = {
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Error al eliminar datos",
        statusCode: axiosError.response?.status,
        details: axiosError.response?.data?.details,
      };
      return {
        data: null,
        status: apiError.statusCode || 500,
        statusText: apiError.message,
      };
    }
  },
});

export const apiService = createApiService(axiosInstance);

export { axiosInstance };