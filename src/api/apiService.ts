"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_URL = process.env.NEXT_PUBLIC_TOKEN_URL;
const USERNAME = process.env.NEXT_PUBLIC_USERNAME;
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const GRANT_TYPE = process.env.NEXT_PUBLIC_GRANT_TYPE;
const SCOPE = process.env.NEXT_PUBLIC_SCOPE;

if (!API_URL || !TOKEN_URL || !USERNAME || !PASSWORD || !CLIENT_ID || !CLIENT_SECRET || !GRANT_TYPE || !SCOPE) {
  throw new Error("One or more environment variables are not defined");
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
 * Obtener el token de autenticación
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(TOKEN_URL, new URLSearchParams({
      username: USERNAME,
      password: PASSWORD,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: GRANT_TYPE,
      scope: SCOPE,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = response.data as { access_token: string };
    return data.access_token;
  } catch (error) {
    console.error("Error fetching auth token", error);
    return null;
  }
};

/**
 * Interceptor de solicitudes para agregar el token de autorización a las cabeceras.
 */
const addAuthInterceptor = (instance: any) => {
  instance.interceptors.request.use(async (config: any) => {
    let access_token = localStorage.getItem("access_token");

    if (!access_token) {
      access_token = await getAuthToken();
      if (access_token) {
        localStorage.setItem("access_token", access_token);
      }
    }

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

//metdo redirigir al login y borrar el token del localstorage
const redirectToLogin = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  window.location.href = "/auth/login";
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
          "Error fetching data",
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
          "Error posting data",
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
          "Error putting data",
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
          "Error patching data",
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
          "Error deleting data",
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