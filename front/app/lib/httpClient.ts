export const AUTH_TOKEN_KEY = 'auth_token'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export interface ResponseMetadata {
  headers: Record<string, string>
  status: number
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  metadata: ResponseMetadata
}

export interface ApiErrorResponse {
  success: false
  detail: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

interface RequestOptions extends RequestInit {
  useAuth?: boolean
  params?: Record<string, unknown>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  try {
    const { useAuth = true, params, ...customOptions } = options

    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const query = searchParams.toString()
      if (query) url += `?${query}`
    }

    const headers = new Headers(customOptions.headers || {})
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    if (useAuth) {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (token) {
        headers.append('Authorization', `Bearer ${token}`)
      }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...customOptions,
      headers,
    })

    const data = await response.json()
    if (!response.ok) {
      return {
        success: false,
        detail: data.detail || `Error: ${response.status}`,
      }
    }

    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value
    })

    return {
      success: true,
      data,
      metadata: {
        headers: responseHeaders,
        status: response.status,
      },
    }
  } catch (error) {
    console.error('API request error:', error)
    return {
      success: false,
      detail: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data: FormData | Record<string, unknown>, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    }),
  put: <T>(
    endpoint: string,
    data: FormData | Record<string, unknown> | string[],
    options?: RequestOptions,
  ) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
}

export default httpClient
