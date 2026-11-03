import { render, screen, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
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

describe('TaskPage', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('carga y muestra las tareas al iniciar', async () => {
        taskApi.getTasks.mockResolvedValue(sampleTasks)

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
})
