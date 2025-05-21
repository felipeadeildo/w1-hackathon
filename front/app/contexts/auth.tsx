import { createContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import * as auth from '~/lib/auth'
import type { SignupInput } from '~/schemas/auth'
import type { User } from '~/types/user'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: SignupInput) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signup: async (data: SignupInput) => false,
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
        // if (error instanceof Error) {
        //   toast.error(error.message)
        // }
        auth.logout()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/app', { replace: true })
    }
  }, [user, isLoading, navigate])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await auth.login({ email, password })
      const user = await auth.getCurrentUser()
      setUser(user)
      toast.success('Login realizado com sucesso!')
      return true
    } catch (error) {
      console.error('Login failed:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return false
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
      return true
    } catch (error) {
      console.error('Signup failed:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
      return false
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
