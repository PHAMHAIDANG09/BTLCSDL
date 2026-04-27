/**
 * Axios API Instance Configuration
 * Setup baseURL, Interceptors (Request & Response), Error Handling
 */

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Define response interface
 */
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, any>;
}

/**
 * Get token from localStorage
 * Note: Có thể thay bằng Zustand store sau
 */
const getToken = (): string | null => {
  if (typeof window === "undefined") return null; // SSR safety
  return localStorage.getItem("token") || null;
};

/**
 * Create Axios Instance
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * REQUEST INTERCEPTOR
   * Tự động append JWT token vào Authorization header
   */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  /**
   * RESPONSE INTERCEPTOR
   * Xử lý lỗi response từ server
   */
  instance.interceptors.response.use(
    (response) => {
      // Return dữ liệu trực tiếp nếu thành công
      return response.data;
    },
    (error: AxiosError<ApiError>) => {
      const status = error.response?.status;
      const errorData = error.response?.data;

      // Xử lý lỗi 401 (Unauthorized)
      if (status === 401) {
        // Xoá token khỏi localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }

        // Redirect về login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      // Xử lý lỗi 403 (Forbidden)
      if (status === 403) {
        if (typeof window !== "undefined") {
          window.location.href = "/forbidden";
        }
      }

      // Xử lý lỗi 500 (Internal Server Error)
      if (status === 500) {
        console.error("Server Error:", error.response?.data);
      }

      // Return error object để component xử lý
      const apiError: ApiError = {
        message: errorData?.message || error.message || "Có lỗi xảy ra",
        statusCode: status,
        errors: errorData?.errors,
      };

      return Promise.reject(apiError);
    },
  );

  return instance;
};

/**
 * Export API instance
 */
export const api = createApiInstance();

export default api;
