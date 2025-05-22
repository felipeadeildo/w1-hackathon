import type { User } from '~/types/user'
import httpClient, { AUTH_TOKEN_KEY } from '../lib/httpClient'

interface LoginCredentials {
  email: string
  password: string
}

interface AuthToken {
  access_token: string
}

interface SignupCredentials {
  email: string
  password: string
  passwordConfirm: string
  name: string
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

  localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token)
  return response.data
}

export const signup = async (credentials: SignupCredentials): Promise<AuthToken> => {
  const response = await httpClient.post<AuthToken>(
    '/users/signup',
    {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    },
    {
      useAuth: false,
    },
  )

  if (!response.success) {
    throw new Error(response.detail)
  }

  localStorage.setItem(AUTH_TOKEN_KEY, response.data.access_token)
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
