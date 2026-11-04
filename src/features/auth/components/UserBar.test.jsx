import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserBar } from './UserBar'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext')

describe('UserBar', () => {
    let logout

    beforeEach(() => {
        logout = vi.fn()
    })

    it('muestra el nombre del usuario sin insignia si es USER', () => {
        useAuth.mockReturnValue({ user: { name: 'Ana Pérez', role: 'USER' }, logout })
        render(<UserBar />)

        expect(screen.getByText('Ana Pérez')).toBeTruthy()
        expect(screen.queryByText('ADMIN')).toBeNull()
    })

    it('muestra la insignia ADMIN si el rol es ADMIN', () => {
        useAuth.mockReturnValue({ user: { name: 'Admin Local', role: 'ADMIN' }, logout })
        render(<UserBar />)

        expect(screen.getByText('ADMIN')).toBeTruthy()
        expect(screen.getByText('Admin Local')).toBeTruthy()
    })

    it('el botón Cerrar sesión ejecuta logout', () => {
        useAuth.mockReturnValue({ user: { name: 'Ana Pérez', role: 'USER' }, logout })
        render(<UserBar />)

        fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

        expect(logout).toHaveBeenCalledTimes(1)
    })
})
