import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import * as authApi from '../../../api/authApi'

vi.mock('../../../api/authApi')

describe('AuthContext.register', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('delega el registro en la API y no abre sesión', async () => {
        const created = { id: 3, email: 'nuevo@example.com' }
        authApi.register.mockResolvedValue(created)
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
        const data = { name: 'Nuevo', email: 'nuevo@example.com', password: 'ContrasenaDemo123!' }

        let response
        await act(async () => {
            response = await result.current.register(data)
        })

        expect(authApi.register).toHaveBeenCalledWith(data)
        expect(response).toEqual(created)
        expect(result.current.isAuthenticated).toBe(false)
    })
})
