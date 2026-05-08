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
    (response) => response.data,
    async (error: AxiosError<ApiError>) => {
      const status = error.response?.status;
      const originalRequest = error.config;

      if (status === 401 && originalRequest && !(originalRequest as any)._retry) {
        (originalRequest as any)._retry = true;
        try {
          const response: any = await axios.post(`${instance.defaults.baseURL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          const { access_token } = response.data;
          if (typeof window !== "undefined") {
            localStorage.setItem("token", access_token);
            document.cookie = `auth_token=${access_token}; path=/; max-age=86400; SameSite=Lax`;
          }
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return instance(originalRequest);
        } catch (refreshError) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            document.cookie = "auth_token=; path=/; max-age=0";
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }

      if (status === 403 && typeof window !== "undefined") {
        window.location.href = "/forbidden";
      }

      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || "Có lỗi xảy ra",
        statusCode: status,
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
