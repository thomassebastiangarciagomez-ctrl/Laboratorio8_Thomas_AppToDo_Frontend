import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import { TaskForm } from './TaskForm'

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
})
