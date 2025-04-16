import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'
import { AuthProvider } from '../contexts/AuthContext'

// Mock the API functions
jest.mock('../services/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    })

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    }

    // Mock the login function to return a successful response
    const { login } = await import('../services/api')
    (login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: 'mock-token',
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    })

    // Mock the login function to throw an error
    const { login } = await import('../services/api')
    (login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'))

    await act(async () => {
      await expect(result.current.login('test@example.com', 'wrong-password')).rejects.toThrow(
        'Invalid credentials'
      )
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    })

    // First login to set the authenticated state
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    }

    const { login, logout } = await import('../services/api')
    (login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: 'mock-token',
    })

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    // Mock the logout function
    (logout as jest.Mock).mockResolvedValueOnce(undefined)

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
}) 