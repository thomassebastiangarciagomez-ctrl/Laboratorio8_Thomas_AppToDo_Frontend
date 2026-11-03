import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import { TaskList } from './TaskList'

const sampleTasks = [
    {
        id: 1,
        title: 'Terminar laboratorio',
        description: 'Backend y frontend',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2026-09-25',
    },
    {
        id: 2,
        title: 'Preparar parcial',
        description: null,
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: '2026-09-27',
    },
]

describe('TaskList', () => {

    test('renderiza las tareas', () => {
        render(<TaskList tasks={sampleTasks} onEdit={() => {}} onDelete={() => {}} onChangeStatus={() => {}} />)

        expect(screen.getByText('Terminar laboratorio')).toBeInTheDocument()
        expect(screen.getByText('Preparar parcial')).toBeInTheDocument()
    })

    test('muestra el estado de cada tarea', () => {
        render(<TaskList tasks={sampleTasks} onEdit={() => {}} onDelete={() => {}} onChangeStatus={() => {}} />)

        expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument()
        expect(screen.getByText('PENDING')).toBeInTheDocument()
    })

    test('muestra la prioridad de cada tarea', () => {
        render(<TaskList tasks={sampleTasks} onEdit={() => {}} onDelete={() => {}} onChangeStatus={() => {}} />)

        expect(screen.getByText('HIGH')).toBeInTheDocument()
        expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    })

    test('ejecuta eliminar al hacer clic en el botón', async () => {
        const user = userEvent.setup()
        const handleDelete = vi.fn()

        render(<TaskList tasks={sampleTasks} onEdit={() => {}} onDelete={handleDelete} onChangeStatus={() => {}} />)

        const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i })
        await user.click(deleteButtons[0])

        expect(handleDelete).toHaveBeenCalledWith(1)
    })

    test('muestra un mensaje cuando no hay tareas', () => {
        render(<TaskList tasks={[]} onEdit={() => {}} onDelete={() => {}} onChangeStatus={() => {}} />)

        expect(screen.getByText(/no hay tareas registradas/i)).toBeInTheDocument()
    })
})
