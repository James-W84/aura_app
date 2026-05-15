import axios, { AxiosError, AxiosInstance } from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add token if available (for future auth)
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        // Handle errors globally
        if (error.response) {
          console.error(
            `API Error: ${error.response.status}`,
            error.response.data,
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request error:", error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  get<T = any>(url: string, config?: any) {
    return this.client.get<T, T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<T, T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<T, T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<T, T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<T, T>(url, config);
  }
}

export const api = new ApiClient();
