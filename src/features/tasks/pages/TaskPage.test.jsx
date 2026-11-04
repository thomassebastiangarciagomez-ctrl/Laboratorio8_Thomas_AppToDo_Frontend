import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { TaskPage } from './TaskPage'
import * as taskApi from '../../../api/taskApi'

vi.mock('../../../api/taskApi')

const sampleTasks = [
    {
        id: 1,
        title: 'Terminar laboratorio',
        description: 'Backend y frontend',
        status: 'PENDING',
        priority: 'HIGH',
        dueDate: '2026-09-25',
    },
]

async function waitForLoad() {
    await waitFor(() => expect(screen.queryByText(/cargando tareas/i)).not.toBeInTheDocument())
}

describe('TaskPage', () => {
    let alertSpy

    beforeEach(() => {
        vi.resetAllMocks()
        taskApi.getTasks.mockResolvedValue(sampleTasks)
        // jsdom no implementa alert; además se silencia console.error de los catch de la página.
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
        vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    test('carga y muestra las tareas al iniciar', async () => {
        render(<TaskPage />)

        await waitFor(() => {
            expect(screen.getByText('Terminar laboratorio')).toBeInTheDocument()
        })

        expect(taskApi.getTasks).toHaveBeenCalledTimes(1)
    })

    test('muestra el mensaje de carga mientras espera la respuesta', () => {
        taskApi.getTasks.mockReturnValue(new Promise(() => {}))

        render(<TaskPage />)

        expect(screen.getByText(/cargando tareas/i)).toBeInTheDocument()
    })

    test('muestra un mensaje de error cuando la API falla', async () => {
        taskApi.getTasks.mockRejectedValue(new Error('No se pudo conectar con el servidor'))

        render(<TaskPage />)

        await waitFor(() => {
            expect(screen.getByText(/no se pudo conectar con el servidor/i)).toBeInTheDocument()
        })
    })

    test('crea una tarea nueva y la muestra en la lista', async () => {
        const user = userEvent.setup()
        taskApi.getTasks.mockResolvedValue([])
        taskApi.createTask.mockResolvedValue({
            id: 2, title: 'Tarea creada en la prueba', description: '', status: 'PENDING', priority: 'MEDIUM', dueDate: null,
        })
        render(<TaskPage />)
        await waitForLoad()

        await user.type(screen.getByPlaceholderText(/escribe el título de la tarea/i), 'Tarea creada en la prueba')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(await screen.findByText('Tarea creada en la prueba')).toBeInTheDocument()
        expect(taskApi.createTask).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Tarea creada en la prueba', priority: 'MEDIUM', status: 'PENDING' })
        )
    })

    test('avisa con una alerta si no se puede crear la tarea', async () => {
        const user = userEvent.setup()
        taskApi.getTasks.mockResolvedValue([])
        taskApi.createTask.mockRejectedValue(new Error('Título duplicado'))
        render(<TaskPage />)
        await waitForLoad()

        await user.type(screen.getByPlaceholderText(/escribe el título de la tarea/i), 'Repetida')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('No se pudo guardar la tarea: Título duplicado')
        })
    })

    test('edita una tarea existente', async () => {
        const user = userEvent.setup()
        taskApi.updateTask.mockResolvedValue({ ...sampleTasks[0], title: 'Laboratorio corregido' })
        render(<TaskPage />)
        await screen.findByText('Terminar laboratorio')

        await user.click(screen.getByRole('button', { name: 'Editar' }))
        expect(screen.getByText('Editar tarea')).toBeInTheDocument()

        const title = screen.getByPlaceholderText(/escribe el título de la tarea/i)
        await user.clear(title)
        await user.type(title, 'Laboratorio corregido')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(await screen.findByText('Laboratorio corregido')).toBeInTheDocument()
        expect(taskApi.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Laboratorio corregido' }))
        expect(await screen.findByText('Nueva tarea')).toBeInTheDocument()
    })

    test('cancelar la edición vuelve al formulario de nueva tarea', async () => {
        const user = userEvent.setup()
        render(<TaskPage />)
        await screen.findByText('Terminar laboratorio')

        await user.click(screen.getByRole('button', { name: 'Editar' }))
        expect(screen.getByText('Editar tarea')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(screen.getByText('Nueva tarea')).toBeInTheDocument()
        expect(taskApi.updateTask).not.toHaveBeenCalled()
    })

    test('elimina una tarea de la lista', async () => {
        const user = userEvent.setup()
        taskApi.deleteTask.mockResolvedValue(null)
        render(<TaskPage />)
        await screen.findByText('Terminar laboratorio')

        await user.click(screen.getByRole('button', { name: 'Eliminar' }))

        await waitFor(() => {
            expect(screen.queryByText('Terminar laboratorio')).not.toBeInTheDocument()
        })
        expect(taskApi.deleteTask).toHaveBeenCalledWith(1)
        expect(screen.getByText(/no hay tareas registradas/i)).toBeInTheDocument()
    })

    test('avisa con una alerta si no se puede eliminar la tarea', async () => {
        const user = userEvent.setup()
        taskApi.deleteTask.mockRejectedValue(new Error('No tienes permisos'))
        render(<TaskPage />)
        await screen.findByText('Terminar laboratorio')

        await user.click(screen.getByRole('button', { name: 'Eliminar' }))

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('No se pudo eliminar la tarea: No tienes permisos')
        })
        expect(screen.getByText('Terminar laboratorio')).toBeInTheDocument()
    })

    test('avanza el estado de la tarea con el botón Iniciar', async () => {
        const user = userEvent.setup()
        taskApi.updateTask.mockResolvedValue({ ...sampleTasks[0], status: 'IN_PROGRESS' })
        render(<TaskPage />)
        await screen.findByText('Terminar laboratorio')

        await user.click(screen.getByRole('button', { name: 'Iniciar' }))

        expect(taskApi.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ status: 'IN_PROGRESS' }))
        expect(await screen.findByText('IN_PROGRESS')).toBeInTheDocument()
    })

    test('avisa con una alerta si no se puede cambiar el estado', async () => {
        const user = userEvent.setup()
        taskApi.updateTask.mockRejectedValue(new Error('Tarea no encontrada'))
        render(<TaskPage />)
        await screen.findByText('Terminar laboratorio')

        await user.click(screen.getByRole('button', { name: 'Iniciar' }))

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('No se pudo actualizar la tarea: Tarea no encontrada')
        })
    })
})
