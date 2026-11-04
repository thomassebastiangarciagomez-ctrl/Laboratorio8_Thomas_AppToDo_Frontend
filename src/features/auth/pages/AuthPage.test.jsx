import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthPage } from './AuthPage'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext')

const PASSWORD = 'ContrasenaDemo123!'
let auth

function submitLogin() {
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: PASSWORD } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

function submitRegister() {
    fireEvent.click(screen.getByRole('button', { name: 'Regístrate' }))
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana Pérez' } })
    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: PASSWORD } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('AuthPage', () => {
    beforeEach(() => {
        auth = { login: vi.fn(), register: vi.fn(), sessionNotice: null }
        useAuth.mockReturnValue(auth)
    })

    it('empieza en el inicio de sesión', () => {
        render(<AuthPage />)

        expect(screen.getByText('INICIAR SESIÓN')).toBeTruthy()
    })

    it('inicia sesión con las credenciales escritas', async () => {
        auth.login.mockResolvedValue(undefined)
        render(<AuthPage />)

        submitLogin()

        expect(auth.login).toHaveBeenCalledWith({ email: 'ana@example.com', password: PASSWORD })
        await screen.findByRole('button', { name: 'Iniciar sesión' })
        expect(screen.queryByRole('alert')).toBeNull()
    })

    it('muestra el error si el inicio de sesión falla', async () => {
        auth.login.mockRejectedValue(new Error('Credenciales inválidas'))
        render(<AuthPage />)

        submitLogin()

        expect((await screen.findByRole('alert')).textContent).toBe('Credenciales inválidas')
    })

    it('muestra el aviso de sesión expirada que llega del contexto', () => {
        auth.sessionNotice = 'Tu sesión expiró. Inicia sesión de nuevo.'
        render(<AuthPage />)

        expect(screen.getByRole('status').textContent).toBe('Tu sesión expiró. Inicia sesión de nuevo.')
    })

    it('al registrarse vuelve al login con el aviso de cuenta creada', async () => {
        auth.register.mockResolvedValue({ id: 1 })
        render(<AuthPage />)

        submitRegister()

        expect(auth.register).toHaveBeenCalledWith({ name: 'Ana Pérez', email: 'ana@example.com', password: PASSWORD })
        expect((await screen.findByRole('status')).textContent).toBe('Cuenta creada. Ya puedes iniciar sesión.')
        expect(screen.getByText('INICIAR SESIÓN')).toBeTruthy()
    })

    it('si el registro falla muestra el error y se queda en el registro', async () => {
        auth.register.mockRejectedValue(new Error('El correo ya está registrado'))
        render(<AuthPage />)

        submitRegister()

        expect((await screen.findByRole('alert')).textContent).toBe('El correo ya está registrado')
        expect(screen.getByText('CREAR CUENTA')).toBeTruthy()
    })

    it('volver al login desde el registro limpia el error', async () => {
        auth.register.mockRejectedValue(new Error('El correo ya está registrado'))
        render(<AuthPage />)
        submitRegister()
        await screen.findByRole('alert')

        fireEvent.click(screen.getByRole('button', { name: 'Inicia sesión' }))

        expect(screen.getByText('INICIAR SESIÓN')).toBeTruthy()
        expect(screen.queryByRole('alert')).toBeNull()
    })

    it('el aviso de cuenta creada desaparece al volver al registro', async () => {
        auth.register.mockResolvedValue({ id: 1 })
        render(<AuthPage />)
        submitRegister()
        await screen.findByRole('status')

        fireEvent.click(screen.getByRole('button', { name: 'Regístrate' }))
        fireEvent.click(screen.getByRole('button', { name: 'Inicia sesión' }))

        expect(screen.queryByRole('status')).toBeNull()
    })
})
