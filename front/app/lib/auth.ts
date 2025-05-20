import type { User } from '~/types/user'
import httpClient, { AUTH_TOKEN_KEY } from './httpClient'

interface LoginCredentials {
  email: string
  password: string
}

interface AuthToken {
  token: string
}

interface SignupCredentials {
  email: string
  password: string
  passwordConfirm: string
}

interface SignupResponse {
  message: string
}

export const login = async (credentials: LoginCredentials): Promise<AuthToken> => {
  const formData = new FormData()
  formData.append('username', credentials.email)
  formData.append('password', credentials.password)

  const response = await httpClient.post<AuthToken>('/users/login', formData, {
    useAuth: false,
  })

  if (!response.success) {
    throw new Error(response.detail)
  }

  localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)

  return response.data
}

export const signup = async (credentials: SignupCredentials): Promise<SignupResponse> => {
  const formData = new FormData()
  formData.append('username', credentials.email)
  formData.append('password', credentials.password)

  const response = await httpClient.post<SignupResponse>('/users/signup', formData, {
    useAuth: false,
  })

  if (!response.success) {
    throw new Error(response.detail)
  }

  return response.data
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await httpClient.get<User>('/users/me')
  if (!response.success) {
    throw new Error(response.detail)
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}
