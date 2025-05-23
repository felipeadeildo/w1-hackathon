export const AUTH_TOKEN_KEY = 'auth_token'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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
  status?: number
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

interface RequestOptions extends RequestInit {
  useAuth?: boolean
  params?: Record<string, unknown>
  onUploadProgress?: (progressEvent: ProgressEvent) => void
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  try {
    const { useAuth = true, params, onUploadProgress, ...customOptions } = options

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

    // If we have a progress callback and the request has a body, use XHR for progress tracking
    if (onUploadProgress && options.body instanceof FormData) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', onUploadProgress)

        xhr.addEventListener('load', () => {
          let data
          try {
            data = JSON.parse(xhr.responseText)
          } catch {
            data = { detail: 'Failed to parse response' }
          }

          const responseHeaders: Record<string, string> = {}
          xhr
            .getAllResponseHeaders()
            .split('\r\n')
            .forEach((header) => {
              const [key, value] = header.split(': ')
              if (key) responseHeaders[key.toLowerCase()] = value
            })

          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
              data,
              metadata: {
                headers: responseHeaders,
                status: xhr.status,
              },
            } as ApiSuccessResponse<T>)
          } else {
            if (xhr.status === 422) {
              resolve({
                success: false,
                detail: 'Dados inválidos. Por favor, verifique as informações enviadas.',
                status: xhr.status,
              })
            } else {
              resolve({
                success: false,
                detail: data.detail || `Erro inesperado (${xhr.status})`,
                status: xhr.status,
              })
            }
          }
        })

        xhr.addEventListener('error', () => {
          resolve({
            success: false,
            detail: 'Erro de conexão com o servidor',
          })
        })

        xhr.open(options.method || 'GET', `${API_BASE_URL}${url}`, true)

        // Add headers
        headers.forEach((value, key) => {
          xhr.setRequestHeader(key, value)
        })

        // Ensure we're only sending FormData in this flow
        if (options.body instanceof FormData) {
          xhr.send(options.body)
        } else {
          console.error('XHR upload only supports FormData')
          xhr.send(null)
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...customOptions,
      headers,
    })

    const data = await response.json()
    if (!response.ok) {
      if (response.status === 422) {
        return {
          success: false,
          detail: 'Dados inválidos. Por favor, verifique as informações enviadas.',
          status: response.status,
        }
      }
      return {
        success: false,
        detail: data.detail || `Erro inesperado (${response.status})`,
        status: response.status,
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
      detail: error instanceof Error ? error.message : 'Erro de conexão com o servidor',
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
  patch: <T>(
    endpoint: string,
    data: FormData | Record<string, unknown>,
    options?: RequestOptions,
  ) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...options,
    }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
}

export default httpClient
