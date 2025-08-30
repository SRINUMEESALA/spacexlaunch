import { AxiosResponse } from 'axios';
import type { Launch, Launchpad } from '../types/spacex';
import {
  apiClient,
  handleApiError,
  isValidLaunch,
  isValidLaunchpad,
  isValidLaunchArray,
  type ApiResponse,
} from '../utils';

export async function getLaunches(): Promise<ApiResponse<Launch[]>> {
  try {
    const response: AxiosResponse<unknown> =
      await apiClient.get('/v5/launches');

    if (!isValidLaunchArray(response.data)) {
      return {
        success: false,
        error: 'Invalid data received from SpaceX API',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getLaunchById(id: string): Promise<ApiResponse<Launch>> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        error: 'Launch ID is required',
      };
    }

    const response: AxiosResponse<unknown> = await apiClient.get(
      `/v5/launches/${id}`
    );

    if (!isValidLaunch(response.data)) {
      return {
        success: false,
        error: 'Invalid response format from launch API',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getLaunchpad(
  id: string
): Promise<ApiResponse<Launchpad>> {
  try {
    if (!id || typeof id !== 'string') {
      return {
        success: false,
        error: 'Invalid launchpad ID provided',
      };
    }

    const response: AxiosResponse<unknown> = await apiClient.get(
      `/v4/launchpads/${id}`
    );

    if (!isValidLaunchpad(response.data)) {
      return {
        success: false,
        error: 'Invalid response format from launchpad API',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
