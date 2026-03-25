/* eslint-disable react-refresh/only-export-components -- useAuth is the public API for AuthProvider */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  api,
  ApiError,
  clearAuth,
  getStoredToken,
  getStoredUser,
  persistAuth,
} from '../api/client'
import type { AuthUser, LoginRequest, RegisterRequest } from '../api/types'

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  login: (body: LoginRequest) => Promise<void>
  register: (body: RegisterRequest) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(() => {
    const u = getStoredUser()
    return u ? { userId: u.userId, email: u.email } : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(
    async (body: LoginRequest) => {
      setError(null)
      setIsLoading(true)
      try {
        const res = await api.login(body)
        persistAuth(res)
        setToken(res.token)
        setUser({ userId: res.userId, email: res.email })
        navigate('/inbox', { replace: true })
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : 'Login failed'
        setError(msg)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const register = useCallback(
    async (body: RegisterRequest) => {
      setError(null)
      setIsLoading(true)
      try {
        const res = await api.register(body)
        persistAuth(res)
        setToken(res.token)
        setUser({ userId: res.userId, email: res.email })
        navigate('/inbox', { replace: true })
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : 'Registration failed'
        setError(msg)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      register,
      logout,
      isLoading,
      error,
      clearError,
    }),
    [token, user, login, register, logout, isLoading, error, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
