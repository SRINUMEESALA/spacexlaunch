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

export interface PaginatedLaunchesResponse {
  docs: Launch[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

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

export async function getLaunchesPaginated(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedLaunchesResponse>> {
  try {
    const requestBody = {
      query: {},
      options: {
        page,
        limit,
        sort: { date_utc: -1 },
        populate: [],
      },
    };

    const response: AxiosResponse<unknown> = await apiClient.post(
      '/v5/launches/query',
      requestBody
    );

    const data = response.data as Partial<PaginatedLaunchesResponse>;
    if (!data || !Array.isArray(data.docs) || !isValidLaunchArray(data.docs)) {
      return {
        success: false,
        error: 'Invalid paginated data received from SpaceX API',
      };
    }

    return {
      success: true,
      data: data as PaginatedLaunchesResponse,
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
