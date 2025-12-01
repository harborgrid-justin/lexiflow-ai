// HTTP Client Utilities
// Core HTTP functions for API communication

import { API_BASE_URL, getAuthHeaders, getAuthHeadersWithoutContentType, getAuthToken } from './config';
import { ApiError, BackendErrorResponse } from './api-error';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: BackendErrorResponse | null = null;

    try {
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData = {
          statusCode: response.status,
          message: text || response.statusText || 'Request failed',
        };
      }
    } catch (parseError) {
      errorData = {
        statusCode: response.status,
        message: response.statusText || 'Request failed',
      };
    }

    if (errorData) {
      throw new ApiError(
        errorData.message || 'Request failed',
        errorData.statusCode || response.status,
        errorData.error,
        errorData.fieldErrors,
        errorData
      );
    }

    throw new ApiError('Request failed', response.status);
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text() as unknown as T;
};

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleResponse<T>(response);
  } catch (error) {
    if (retries > 0 && ApiError.isApiError(error) && error.isServerError()) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function fetchJson<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = { method: 'GET', headers: getAuthHeaders() };
  return fetchWithRetry<T>(url, options);
}

export async function postJson<T>(endpoint: string, data: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  };
  return handleResponse<T>(await fetch(url, options));
}

export async function putJson<T>(endpoint: string, data: unknown): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data) };
  return handleResponse<T>(await fetch(url, options));
}

export async function deleteJson(endpoint: string): Promise<void> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = { method: 'DELETE', headers: getAuthHeaders() };
  await handleResponse<void>(await fetch(url, options));
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ''
  );

  if (entries.length === 0) return '';

  const queryParams = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return `?${queryParams}`;
}

export async function uploadFile<T>(
  endpoint: string,
  file: File,
  metadata?: Record<string, any>
): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method: 'POST',
    headers: getAuthHeadersWithoutContentType(),
    body: formData,
  };

  const response = await fetch(url, options);
  return handleResponse<T>(response);
}

export async function downloadFile(
  endpoint: string
): Promise<{ blob: Blob; filename: string; contentType: string }> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = { method: 'GET', headers: getAuthHeadersWithoutContentType() };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new ApiError('Failed to download file', response.status);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition');
  const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

  let filename = 'download';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  return { blob, filename, contentType };
}

export function getDownloadUrl(resourcePath: string, id: string): string {
  const token = getAuthToken();
  return `${API_BASE_URL}${resourcePath}/${id}/download${token ? `?token=${token}` : ''}`;
}
