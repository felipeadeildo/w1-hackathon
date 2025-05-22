import { createContext, useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { SignupInput } from '~/schemas/auth'
import * as auth from '~/services/auth'
import type { User } from '~/types/user'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User | null>
  signup: (data: SignupInput) => Promise<User | null>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => null,
  signup: async () => null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
        auth.logout()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await auth.login({ email, password })
      const user = await auth.getCurrentUser()
      setUser(user)
      toast.success('Login realizado com sucesso!')
      return user
    } catch (error) {
      console.error('Login failed:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: SignupInput) => {
    setIsLoading(true)
    try {
      await auth.signup(data)
      const user = await auth.getCurrentUser()
      setUser(user)
      toast.success('Conta criada com sucesso!')
      return user
    } catch (error) {
      console.error('Signup failed:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    auth.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
