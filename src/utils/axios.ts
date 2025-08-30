import axios, { AxiosError } from 'axios';
import { BASE_URL } from '../config/GlobalUrls';
import type { Launch, Launchpad } from '../types/spacex';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  status?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function handleApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as
      | { message?: string }
      | undefined;
    return {
      success: false,
      error: responseData?.message || axiosError.message || 'Network error',
      status: axiosError.response?.status,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: false,
    error: 'Unknown error occurred',
  };
}

export function isValidLaunch(data: unknown): data is Launch {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'flight_number' in data &&
    'date_utc' in data &&
    'upcoming' in data
  );
}

export function isValidLaunchpad(data: unknown): data is Launchpad {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'full_name' in data &&
    'latitude' in data &&
    'longitude' in data
  );
}

export function isValidLaunchArray(data: unknown): data is Launch[] {
  return Array.isArray(data) && data.every(isValidLaunch);
}
