import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import { TaskForm } from './TaskForm'

const noop = () => {}

const editingTask = {
    id: 5,
    title: 'Estudiar',
    description: 'Capítulo 3',
    priority: 'HIGH',
    dueDate: '2026-10-01',
    status: 'IN_PROGRESS',
}

describe('TaskForm', () => {

    test('renderiza el formulario', () => {
        render(<TaskForm onSubmit={() => {}} editingTask={null} onCancelEdit={() => {}} />)

        expect(screen.getByText(/nueva tarea/i)).toBeInTheDocument()
    })

    test('permite escribir un título', async () => {
        const user = userEvent.setup()
        render(<TaskForm onSubmit={() => {}} editingTask={null} onCancelEdit={() => {}} />)

        const input = screen.getByPlaceholderText(/escribe el título de la tarea/i)
        await user.type(input, 'Terminar laboratorio')

        expect(input).toHaveValue('Terminar laboratorio')
    })

    test('ejecuta la acción guardar con los datos del formulario', async () => {
        const user = userEvent.setup()
        const handleSubmit = vi.fn()

        render(<TaskForm onSubmit={handleSubmit} editingTask={null} onCancelEdit={() => {}} />)

        await user.type(screen.getByPlaceholderText(/escribe el título de la tarea/i), 'Mi tarea')
        await user.click(screen.getByRole('button', { name: /guardar/i }))

        expect(handleSubmit).toHaveBeenCalledTimes(1)
        expect(handleSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Mi tarea' })
        )
    })

    test('valida que el título sea obligatorio', async () => {
        const user = userEvent.setup()
        const handleSubmit = vi.fn()

        render(<TaskForm onSubmit={handleSubmit} editingTask={null} onCancelEdit={() => {}} />)

        await user.click(screen.getByRole('button', { name: /guardar/i }))

        expect(handleSubmit).not.toHaveBeenCalled()
    })

    test('envía los valores por defecto cuando solo se escribe el título', async () => {
        const user = userEvent.setup()
        const handleSubmit = vi.fn()
        render(<TaskForm onSubmit={handleSubmit} editingTask={null} onCancelEdit={noop} />)

        await user.type(screen.getByPlaceholderText(/escribe el título de la tarea/i), 'Solo título')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(handleSubmit).toHaveBeenCalledWith({
            title: 'Solo título',
            description: '',
            priority: 'MEDIUM',
            dueDate: null,
            status: 'PENDING',
        })
    })

    test('envía todos los campos diligenciados', async () => {
        const user = userEvent.setup()
        const handleSubmit = vi.fn()
        const { container } = render(<TaskForm onSubmit={handleSubmit} editingTask={null} onCancelEdit={noop} />)

        await user.type(screen.getByPlaceholderText(/escribe el título de la tarea/i), 'Tarea completa')
        await user.type(screen.getByPlaceholderText(/escribe la descripción/i), 'Detalle de la tarea')
        await user.selectOptions(screen.getByDisplayValue('MEDIUM'), 'HIGH')
        fireEvent.change(container.querySelector('input[type="date"]'), { target: { value: '2026-12-01' } })
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(handleSubmit).toHaveBeenCalledWith({
            title: 'Tarea completa',
            description: 'Detalle de la tarea',
            priority: 'HIGH',
            dueDate: '2026-12-01',
            status: 'PENDING',
        })
    })

    test('limpia el formulario después de guardar', async () => {
        const user = userEvent.setup()
        render(<TaskForm onSubmit={vi.fn()} editingTask={null} onCancelEdit={noop} />)
        const title = screen.getByPlaceholderText(/escribe el título de la tarea/i)

        await user.type(title, 'Temporal')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(title).toHaveValue('')
    })

    test('sin edición no muestra Estado ni el botón Cancelar', () => {
        render(<TaskForm onSubmit={noop} editingTask={null} onCancelEdit={noop} />)

        expect(screen.queryByText(/estado:/i)).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
    })

    test('en modo edición carga los datos de la tarea', () => {
        const { container } = render(<TaskForm onSubmit={noop} editingTask={editingTask} onCancelEdit={noop} />)

        expect(screen.getByText('Editar tarea')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/escribe el título de la tarea/i)).toHaveValue('Estudiar')
        expect(screen.getByPlaceholderText(/escribe la descripción/i)).toHaveValue('Capítulo 3')
        expect(screen.getByDisplayValue('HIGH')).toBeInTheDocument()
        expect(screen.getByDisplayValue('IN_PROGRESS')).toBeInTheDocument()
        expect(container.querySelector('input[type="date"]').value).toBe('2026-10-01')
    })

    test('en modo edición tolera descripción y fecha vacías', () => {
        const sinExtras = { id: 9, title: 'Sin extras', description: null, priority: 'LOW', dueDate: null, status: 'PENDING' }
        const { container } = render(<TaskForm onSubmit={noop} editingTask={sinExtras} onCancelEdit={noop} />)

        expect(screen.getByPlaceholderText(/escribe la descripción/i)).toHaveValue('')
        expect(container.querySelector('input[type="date"]').value).toBe('')
    })

    test('en modo edición guarda los cambios, incluido el estado', async () => {
        const user = userEvent.setup()
        const handleSubmit = vi.fn()
        render(<TaskForm onSubmit={handleSubmit} editingTask={editingTask} onCancelEdit={noop} />)

        await user.selectOptions(screen.getByDisplayValue('IN_PROGRESS'), 'COMPLETED')
        await user.click(screen.getByRole('button', { name: 'Guardar' }))

        expect(handleSubmit).toHaveBeenCalledWith({
            title: 'Estudiar',
            description: 'Capítulo 3',
            priority: 'HIGH',
            dueDate: '2026-10-01',
            status: 'COMPLETED',
        })
    })

    test('el botón Cancelar avisa que se cancela la edición', async () => {
        const user = userEvent.setup()
        const onCancelEdit = vi.fn()
        render(<TaskForm onSubmit={noop} editingTask={editingTask} onCancelEdit={onCancelEdit} />)

        await user.click(screen.getByRole('button', { name: 'Cancelar' }))

        expect(onCancelEdit).toHaveBeenCalledTimes(1)
    })
})
